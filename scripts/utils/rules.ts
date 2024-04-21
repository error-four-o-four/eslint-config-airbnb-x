import { Linter, type Rule } from 'eslint';

import {
	ImportRules,
	RenamePrefix,
} from '@antfu/eslint-define-config';

import type {
	AirbnbConfigs,
	AirbnbConfigKeys,
	ConfigWithPluginKeys,
} from '../types/configs.ts';

import type {
	ProcessedRule,
	ApprovedMeta,
	DeprecatedMeta,
} from '../types/rules.ts';

import { pluginPrefix } from '../../src/plugins.ts';

import { airbnbConfigKeyValues } from './constants.ts';

import { getPluginPrefix } from './plugins.ts';

import rawRules from './rawRules.ts';

export function getRules(configs: AirbnbConfigs) {
	const rules: ProcessedRule[] = [];

	airbnbConfigKeyValues.forEach((configName) => {
		const configFlat = configs[configName];

		if (!configFlat.rules) return;

		Object.keys(configFlat.rules).forEach((ruleName) => {
			// @todo assertion
			const ruleValue = configFlat.rules![ruleName];

			if (ruleValue === undefined) {
				console.log(`${configName}: ${ruleName} is undefined`);
				return;
			}

			rules.push(getProcessedRule(configName, ruleName, ruleValue));
		});
	});

	return rules.sort(sortRules);
}

export function getApprovedRules(rules: ProcessedRule[]) {
	const isApprovedRule = (
		rule: ProcessedRule,
	): rule is ProcessedRule<ApprovedMeta> => (
		!rule.meta.deprecated && !rule.meta.plugin
	);

	const filtered: ProcessedRule<ApprovedMeta>[] = [];

	rules.forEach((rule) => {
		if (isApprovedRule(rule)) {
			filtered.push(rule);
		}
	});

	return filtered;
}

export function getPluginRules(rules: ProcessedRule[]) {
	return rules.filter((rule: ProcessedRule) => rule.meta.plugin);
}

export function getLegacyRules(rules: ProcessedRule[]) {
	const isDeprecatedRule = (
		rule: ProcessedRule,
	): rule is ProcessedRule<DeprecatedMeta> => rule.meta.deprecated;

	const filtered: ProcessedRule<DeprecatedMeta>[] = [];

	rules.forEach((rule) => {
		if (isDeprecatedRule(rule)) {
			filtered.push(rule);
		}
	});

	return filtered;
}

function getProcessedRule(
	config: AirbnbConfigKeys,
	name: string,
	value: Linter.RuleEntry,
): ProcessedRule {
	// Airbnb config uses eslint-plugin-import
	// therefore some rules are prefixed with 'import'
	const isImportsRule = name.includes('/') && name.startsWith(pluginPrefix.import);

	// get meta from eslint/import rules
	const key = isImportsRule ? name.split('/')[1] : name;
	const raw = rawRules.getAirbnbRule(key, isImportsRule);

	// classify as deprecated or as approved
	let meta: ApprovedMeta | DeprecatedMeta = {
		deprecated: false,
		config,
		plugin: isImportsRule ? pluginPrefix.import : undefined,
	};

	if (!raw || (raw.meta && raw.meta.deprecated)) {
		meta = Object.assign(meta, {
			deprecated: true,
			...getDeprecatedMeta(key, raw?.meta),
		});
	}

	return {
		name: key,
		meta,
		value,
	};
}

function getDeprecatedMeta(name: string, meta: Rule.RuleMetaData | undefined) {
	const plugin = rawRules.getReplacedIn(name);

	const replacedBy = meta && meta.replacedBy ? meta.replacedBy[0] : undefined;
	const url = meta?.docs?.url;

	return {
		plugin,
		replacedBy,
		url,
	};
}

export function copyRulesBy(
	source: ProcessedRule[],
	filter: (...args: any[]) => any,
	copyValue = true,
): Linter.RulesRecord {
	return source
		.filter(filter)
		.reduce(
			(all, rule) => Object.assign(
				all,
				{ [rule.name]: copyValue ? rule.value : 0 },
			),
			{},
		);
}

export function copyPluginRules(
	key: ConfigWithPluginKeys,
	source: ProcessedRule[],
) {
	const rules = getPrefixedRules(key, source);

	if (key === 'node') {
		disableDeprecatedPluginRules(key, rules);
	}

	if (key === 'imports') {
		overwriteImportsRules(rules);
	}

	return rules;
}

function getPrefixedRules(
	key: ConfigWithPluginKeys,
	source: ProcessedRule[],
): Linter.RulesRecord {
	const plugin = getPluginPrefix(key);
	return source
		.filter((rule) => rule.meta.plugin === plugin)
		.reduce(
			(all, rule) => Object.assign(
				all,
				{ [`${plugin}/${rule.name}`]: rule.value },
			),
			{},
		);
}

function disableDeprecatedPluginRules(
	key: ConfigWithPluginKeys,
	target: Linter.RulesRecord,
) {
	const plugin = getPluginPrefix(key);

	(Object.entries(rawRules[plugin]) as [string, Rule.RuleModule][])
		.filter((entry) => entry[1].meta?.deprecated)
		.forEach((entry) => {
			target[`${plugin}/${entry[0]}`] = 0;
		});

	// @todo sort by name
}

function overwriteImportsRules(target: Linter.RulesRecord) {
	// @todo types

	const noExtraneousDepsKey = 'import/no-extraneous-dependencies';
	const noExtraneousDepsVals = target[
		noExtraneousDepsKey
	] as Linter.RuleLevelAndOptions; // ??

	const [severity, dependants] = noExtraneousDepsVals;

	// target.rules['import/named'] = 0;
	target[noExtraneousDepsKey] = [
		severity,
		{
			devDependencies: [
				...dependants.devDependencies,
				'**/eslint.config.js',
				'**/vite.config.js',
				'**/vite.config.*.js',
			],
			optionalDependencies: dependants.optionalDependencies,
		},
	];
}

export function isTypescriptRule(name: string) {
	return rawRules.typescript.has(name);
}

//
// ### merge ### adjust ts rules
//

type OverwriteKeys = RenamePrefix<
	Pick<
		ImportRules,
	'import/extensions'
	| 'import/named'
	| 'import/no-extraneous-dependencies'
	| 'import/no-named-as-default-member'
	>,
	'import/',
	`${typeof pluginPrefix.import}/`
>;

export const getImportOverwrites = {
	// https://github.com/typescript-eslint/typescript-eslint/blob/13583e65f5973da2a7ae8384493c5e00014db51b/docs/linting/TROUBLESHOOTING.md#eslint-plugin-import
	'import/named': () => 0,
	'import/no-named-as-default-member': () => 0,
	// add e.g vite.config.ts
	'import/no-extraneous-dependencies': (source) => {
		const regex = /\bjs(x?)\b/g;
		const [severity, dependencies] = source;

		let {
			devDependencies,
			// eslint-disable-next-line prefer-const
			optionalDependencies,
		} = <{
			devDependencies: string[],
			optionalDependencies: string[]
		}>dependencies;

		devDependencies = [
			...devDependencies,
			...devDependencies
				.filter((dep) => dep.includes('js') && !dep.includes('eslintrc'))
				.map((dep) => dep.replace(regex, 'ts$1')),
		];

		return [
			severity,
			{
				devDependencies,
				optionalDependencies,
			},
		];
	},
	'import/extensions': (source) => {
		const [
			severity,
			level,
			options,
		] = source;

		return [
			severity,
			level,
			{
				...options,
				ts: 'never',
				tsx: 'never',
			},
		];
	},
} as {
	[K in keyof OverwriteKeys]: (...args: any[]) => Linter.RuleEntry<any[]>
};

export function isImportOverwriteRule(
	name: string,
): name is keyof OverwriteKeys {
	return Object.keys(getImportOverwrites).includes(name);
}

// export function sortRulesByEntryName(
// 	a: ApprovedRuleEntry,
// 	b: ApprovedRuleEntry
// ) {
// 	const nameA = a[0].toUpperCase();
// 	const nameB = b[0].toUpperCase();

// 	return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
// }

export function sortRules(a: ProcessedRule, b: ProcessedRule) {
	const nameA = a.name.toUpperCase();
	const nameB = b.name.toUpperCase();

	return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
}
