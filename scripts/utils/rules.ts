import { Linter } from 'eslint';

// @ts-expect-error missing types
import * as pluginImport from 'eslint-plugin-i';

// @ts-expect-error missing types
import pluginNode from 'eslint-plugin-n';

import pluginStylistic from '@stylistic/eslint-plugin';
import pluginTypescript from '@typescript-eslint/eslint-plugin';

import { pluginNames } from './names.ts';

import type {
	ApprovedRuleEntry,
	CustomNames,
	DeprecatedRule,
	NamedConfigEntry,
	RawRule,
	RuleEntry,
	RuleMeta,
} from '../types.ts';

const rulesEslint = new Linter().getRules();

const plugins = {
	[pluginNames.import]: pluginImport,
	[pluginNames.node]: pluginNode,
	[pluginNames.stylistic]: pluginStylistic,
	[pluginNames.typescript]: pluginTypescript,
} as const;

const pluginKeys = Object.values(pluginNames);

const pluginRules = pluginKeys.reduce(
	(all, plugin) =>
		Object.assign(all, {
			[plugin]: Object.keys(plugins[plugin].rules),
		}),
	{} as { [K in keyof typeof plugins]: string[] }
);

// Airbnb config uses eslint-plugin-import
// therefore some rules are prefixed with 'import'
export function findRawRule(name: string): RawRule | null {
	const isImportRule = name.startsWith('import');

	const key = isImportRule ? name.split('/')[1] : name;
	const raw = isImportRule
		? plugins[pluginNames.import].rules[key]
		: rulesEslint.get(key);

	return raw || null;
}

export function handleApprovedRule(
	rawRule: RawRule,
	ruleName: string,
	ruleValue: RuleEntry,
	rules: ApprovedRuleEntry[]
) {
	if (rawRule.meta && !rawRule.meta.deprecated) {
		rules.push([ruleName, ruleValue]);
		return true;
	}

	return false;
}

function findReplacedIn(ruleName: string) {
	const replacedIn: string = [
		pluginNames.import,
		pluginNames.node,
		pluginNames.stylistic,
	].reduce(
		// (result, [name, rules]) => result !== null ? result : rules.includes(ruleName) ? name : result,
		// (result, name) => {
		// 	if (result) return result;
		// 	const rules = map[name];
		// 	if (rules.includes(ruleName)) return name;
		// 	return result;
		// },
		(result, pluginName) =>
			result || (pluginRules[pluginName].includes(ruleName) ? pluginName : ''),
		''
	);

	return replacedIn || undefined;
}

export function handleDeprecatedRule(
	configName: string,
	ruleName: string,
	ruleValue: RuleEntry,
	ruleMeta: RuleMeta | undefined,
	deprecatedRules: DeprecatedRule[],
	processedRules: ApprovedRuleEntry[]
) {
	const strippedName = ruleName.includes('/')
		? ruleName.split('/')[1]
		: ruleName;
	const pluginName = findReplacedIn(strippedName);

	const replacedBy =
		ruleMeta && ruleMeta.replacedBy ? ruleMeta.replacedBy[0] : undefined;
	const url = ruleMeta?.docs?.url;

	deprecatedRules.push({
		name: strippedName,
		value: ruleValue,
		config: configName,
		plugin: pluginName,
		replacedBy,
		url,
	});

	if (pluginName && pluginName !== pluginNames.stylistic) {
		processedRules.push([`${pluginName}/${strippedName}`, ruleValue]);
	}
}

export function isTypescriptRule(ruleName: string) {
	return pluginRules[pluginNames.typescript].includes(ruleName);
}

export function getTypescriptRuleName(ruleName: string) {
	const scope: CustomNames = 'typescript';
	return `${scope}/${ruleName}`;
}

export function getSortedRulesFromEntries(entries: NamedConfigEntry[]) {
	const all: ApprovedRuleEntry[] = [];

	entries.forEach((entry) => {
		const { rules } = entry[1];

		if (!rules) {
			throw Error(`Could not find any rules in plugin '${entry[0]}'`);
		}

		all.push(...Object.entries(rules));
	});

	return all.sort(sortRulesByEntryName);
}

export function sortRulesByEntryName(
	a: ApprovedRuleEntry,
	b: ApprovedRuleEntry
) {
	const nameA = a[0].toUpperCase();
	const nameB = b[0].toUpperCase();

	return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
}

export function sortRules(a: DeprecatedRule, b: DeprecatedRule) {
	const nameA = a.name.toUpperCase();
	const nameB = b.name.toUpperCase();

	return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
}
