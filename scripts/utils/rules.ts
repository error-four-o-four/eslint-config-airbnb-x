import { Linter } from 'eslint';

import type { Rule } from 'eslint';

import { pluginNames, pluginRules, getPlugin } from './plugins.ts';

import type {
	ConfigWithPlugin,
	PluginImport,
	PluginNotTypescript,
} from './plugins.ts';

import type { AirbnbConfigs, AirbnbNames, FlatConfig } from '../types.ts';

const rulesEslint = new Linter().getRules();

export function getRules(configs: AirbnbConfigs) {
	const rules: ProcessedRule[] = [];
	const names = Object.keys(configs) as AirbnbNames[];

	names.forEach((configName) => {
		const configFlat = configs[configName];

		if (!configFlat.rules) return;

		Object.entries(configFlat.rules).forEach(([ruleName, ruleValue]) => {
			rules.push(getProcessedRule(configName, ruleName, ruleValue));
		});
	});

	return rules.sort(sortRules);
}

export function getApprovedRules(rules: ProcessedRule[]) {
	return rules.filter(
		(rule: ProcessedRule) => !rule.meta.deprecated && !rule.meta.plugin
	);
}

export function getPluginRules(rules: ProcessedRule[]) {
	return rules.filter((rule: ProcessedRule) => rule.meta.plugin);
}

export function getLegacyRules(rules: ProcessedRule[]) {
	return rules.filter((rule: ProcessedRule) => rule.meta.deprecated);
}

// @todo filter replacedBy rules
// export function getReplacedRules(rules: ProcessedRule[]) {
// return rules.filter((rule: ProcessedRule) => rule.meta.deprecated && rule.meta.replacedBy);
// }

export function getProcessedRule(
	config: string,
	name: string,
	value: Linter.RuleEntry
): ProcessedRule {
	// Airbnb config uses eslint-plugin-import
	// therefore some rules are prefixed with 'import'
	const isImportsRule =
		name.includes('/') && name.startsWith(pluginNames.import);

	const key = isImportsRule ? name.split('/')[1] : name;
	const raw = findRawRule(key, isImportsRule);

	let meta: ApprovedMeta | DeprecatedMeta = {
		deprecated: false,
		config,
		plugin: isImportsRule ? pluginNames.import : undefined,
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

function findRawRule(
	name: string,
	isImportsRule: boolean
): Rule.RuleModule | null {
	const raw = isImportsRule
		? pluginRules[pluginNames.import][name]
		: rulesEslint.get(name);

	return raw || null;
}

function getDeprecatedMeta(name: string, meta: Rule.RuleMetaData | undefined) {
	const plugin = findPlugin(name);

	const replacedBy = meta && meta.replacedBy ? meta.replacedBy[0] : undefined;
	const url = meta?.docs?.url;

	return {
		plugin,
		replacedBy,
		url,
	};
}

function findPlugin(ruleName: string) {
	const possiblePlugins: PluginNotTypescript[] = [
		pluginNames.import,
		pluginNames.node,
		pluginNames.stylistic,
	];

	const isReplacedIn = (
		plugin: PluginNotTypescript,
		name: string
	): plugin is PluginNotTypescript => name in pluginRules[plugin];

	let replacedIn: PluginNotTypescript | undefined;

	possiblePlugins.forEach((pluginName) => {
		if (replacedIn) return;

		if (isReplacedIn(pluginName, ruleName)) replacedIn = pluginName;
	});

	return replacedIn;
}

export function copyRules(
	name: AirbnbNames,
	rules: ProcessedRule[],
	target: FlatConfig
) {
	target.rules = rules
		.filter((rule) => rule.meta.config === name)
		.reduce(
			(all, rule) =>
				Object.assign(all, {
					[rule.name]: rule.value,
				}),
			{}
		);
}

export function copyPluginRules(
	name: ConfigWithPlugin,
	rules: ProcessedRule[],
	target: FlatConfig
) {
	const plugin = getPlugin(name);
	target.rules = rules
		.filter((rule) => rule.meta.plugin === plugin)
		.reduce(
			(all, rule) =>
				Object.assign(all, {
					[`${plugin}/${rule.name}`]: rule.value,
				}),
			{}
		);

	if (name === 'node') {
		disableDeprecatedPluginRules(name, target);
	}

	if (name === 'imports') {
		overwriteImportsRules(target);
	}
}

function disableDeprecatedPluginRules(
	name: ConfigWithPlugin,
	target: FlatConfig
) {
	const plugin = getPlugin(name);
	Object.entries(pluginRules[plugin])
		.filter((entry) => entry[1].meta?.deprecated)
		.forEach((entry) => {
			if (!target.rules) {
				throw new Error(
					`This shouldn't happen! Expected config '${name}' to have rules!`
				);
			}

			target.rules[`${plugin}/${entry[0]}`] = 0;
		});
}

function overwriteImportsRules(target: FlatConfig) {
	if (!target.rules) {
		throw new Error(
			`This shouldn't happen! Expected config 'imports' to have rules!`
		);
	}

	// @todo types

	const noExtraneousDepsKey = 'import/no-extraneous-dependencies';
	const noExtraneousDepsVals = target.rules[
		noExtraneousDepsKey
	] as Linter.RuleLevelAndOptions; // ??

	const [severity, dependants] = noExtraneousDepsVals;

	target.rules['import/named'] = 0;
	target.rules[noExtraneousDepsKey] = [
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

export function copyLegacyRules(source: ProcessedRule[], target: FlatConfig) {
	const rules: Linter.RulesRecord = {};

	source
		.filter((rule) => rule.meta.plugin !== 'import')
		.forEach((rule) => {
			if (!rule.meta.deprecated) {
				throw new Error(
					`This shouldn't happen! Expected ${rule.name} to be deprecated`
				);
			}
			rules[rule.name] = 0;
		});

	target.rules = rules;
}

export function copyTypescriptRules(
	source: ProcessedRule[],
	target: FlatConfig
) {
	const filtered = source.filter((rule) => isTypescriptRule(rule.name));
	const rules: Linter.RulesRecord = {};

	filtered.forEach((rule) => {
		// console.log(`'${rule.name}' is replaced in @typescript-eslint`);
		rules[rule.name] = 0;
	});

	filtered.forEach((rule) => {
		rules[`${pluginNames.typescript}/${rule.name}`] = rule.value;
	});

	target.rules = rules;
}

function isTypescriptRule(name: string) {
	return name in pluginRules[pluginNames.typescript];
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

type ApprovedMeta = {
	deprecated: false;
	config: string;
	plugin?: PluginImport;
};

type DeprecatedMeta = {
	deprecated: true;
	config: string;
	plugin?: PluginNotTypescript;
	replacedBy?: string;
	url?: string;
};

export type ProcessedRule = {
	meta: ApprovedMeta | DeprecatedMeta;
	name: string;
	value: Linter.RuleEntry;
};
