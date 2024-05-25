import type { Linter } from 'eslint';

/** @note created with 'node:extract' */
import type {
	ESLintRule,
	PluginRule,
	UnprefixedPluginRule,
	ImportXRule,
	UnprefixedImportXRule,
	NodeRule,
	UnprefixedNodeRule,
	StylisticRule,
	UnprefixedStylisticRule,
	TypeScriptRule,
	UnprefixedTypeScriptRule,
} from '../extractedLiteralsData.ts';

import type {
	ConvertedConfigs,
	PluginPrefix,
	MetaDataProps,
} from '../shared/types/main.ts';

import type {
	CustomConfigs,
	CustomConfigKeysWithPlugin,
	CustomConfigKeysWithOptions,
	CustomConfigKeysWithSettings,
} from './types.ts';

/** @note created with 'node:extract' */
import {
	eslintRulesArray,
	importRulesArray,
	nodeRulesArray,
	styleRulesArray,
	typeRulesArray,
} from '../extractedLiteralsData.ts';

import {
	isPrefixed,
	getUnprefixedRule,
} from '../shared/utils/main.ts';

import { assertNotNull } from '../shared/utils/assert.ts';

import { pluginPrefix } from '../../src/globalSetup.ts';

import {
	configKeysWithPlugin,
	configKeysWithOptions,
	configKeysWithSettings,
} from './setup.ts';

// export const isConvertedConfigKey = (
// 	(key: string): key is keyof ConvertedConfigs => Object
// 		.values(convertedConfigKeys)
// 		.includes(key as keyof ConvertedConfigs)
// );

// export const isConvertedConfigWithOptionsKey = (
// 	(key: string): key is ConvertedConfigKeysWithOptions => convertedConfigWithOptionKeys
// 		.includes(key as ConvertedConfigKeysWithOptions)
// );

export const configHasPlugin = (
	(key: string): key is CustomConfigKeysWithPlugin => configKeysWithPlugin
		.includes(key as CustomConfigKeysWithPlugin)
);

export const configHasOptions = (
	(key: string): key is CustomConfigKeysWithOptions => configKeysWithOptions
		.includes(key as CustomConfigKeysWithOptions)
);

export const configHasSettings = (
	(key: string): key is CustomConfigKeysWithSettings => configKeysWithSettings
		.includes(key as CustomConfigKeysWithSettings)
);

// export const isCustomConfigKey = (
// 	(key: string): key is CustomConfigKeys => Object
// 		.values(customConfigKeys)
// 		.includes(key as CustomConfigKeys)
// );

// export const isConfigWithPluginKey = (
// 	(key: string): key is ConfigKeysWithPlugin => configKeysWithPlugin
// 		.includes(key as ConfigKeysWithPlugin)
// );

// export const isConfigWithOptionsKey = (
// 	(key: string): key is ConfigKeysWithOptions => configKeysWithOptions
// 		.includes(key as ConfigKeysWithOptions)
// );

// export const isConfigWithSettingsKey = (
// 	(key: string): key is ConfigKeysWithSettings => configKeysWithSettings
// 		.includes(key as ConfigKeysWithSettings)
// );

// const eslintRules = new Set(eslintRulesArray);
// const importXRules = new Set(importRulesArray);
// const nodeRules = new Set(nodeRulesArray);
// const stylisticRules = new Set(styleRulesArray);
// const typescriptRules = new Set(typeRulesArray);

const rules = {
	eslint: new Set(eslintRulesArray),
	import: new Set(importRulesArray),
	node: new Set(nodeRulesArray),
	style: new Set(styleRulesArray),
	type: new Set(typeRulesArray),
} as Record<'eslint' | keyof PluginPrefix, Set<string>>;

export const verify = {
	isESLintRule(rule: string): rule is ESLintRule {
		return rules.eslint.has(rule);
	},
	isUnprefixedImportXRule(
		rule: string,
	): rule is UnprefixedImportXRule {
		return rules.import.has(rule);
	},
	isUnprefixedNodeRule(
		rule: string,
	): rule is UnprefixedNodeRule {
		return rules.node.has(rule);
	},
	isUnprefixedStylisticRule(
		rule: string,
	): rule is UnprefixedStylisticRule {
		return rules.style.has(rule);
	},
	isUnprefixedTypescriptRule(
		rule: string,
	): rule is UnprefixedTypeScriptRule {
		return rules.type.has(rule);
	},
	isImportXRule(rule: string): rule is ImportXRule {
		const unprefixed = getUnprefixedPluginRule(rule, pluginPrefix.import);
		return unprefixed ? this.isUnprefixedImportXRule(unprefixed) : false;
	},
	isNodeRule(rule: string): rule is NodeRule {
		const unprefixed = getUnprefixedPluginRule(rule, pluginPrefix.node);
		return unprefixed ? this.isUnprefixedNodeRule(unprefixed) : false;
	},
	isStylisticRule(rule: string): rule is StylisticRule {
		const unprefixed = getUnprefixedPluginRule(rule, pluginPrefix.style);
		return unprefixed ? this.isUnprefixedStylisticRule(unprefixed) : false;
	},
	isTypescriptRule(rule: string): rule is TypeScriptRule {
		const unprefixed = getUnprefixedPluginRule(rule, pluginPrefix.type);
		return unprefixed ? this.isUnprefixedTypescriptRule(unprefixed) : false;
	},
	isPluginRule(rule: string): rule is PluginRule {
		if (!isPrefixed(rule)) return false;

		const unprefixed = getUnprefixedRule(rule);

		return this.isUnprefixedImportXRule(unprefixed)
			|| this.isUnprefixedNodeRule(unprefixed)
			|| this.isUnprefixedStylisticRule(unprefixed)
			|| this.isUnprefixedTypescriptRule(unprefixed);
	},
};

function getUnprefixedPluginRule(rule: string, prefix: keyof PluginPrefix) {
	if (!isPrefixed(rule)) return false;

	if (!rule.startsWith(prefix)) return false;

	return getUnprefixedRule(rule) as UnprefixedPluginRule;
}

export function getRuleValue(
	rule: string,
	meta: MetaDataProps,
	source: ConvertedConfigs,
) {
	const config = source[meta.source];
	assertNotNull(config.rules);

	const value = config.rules[rule];
	assertNotNull(value);

	return Array.isArray(value)
		? value as Linter.RuleLevelAndOptions
		: value as Linter.RuleLevel;
}

// export const configPrefixMap = {
// 	imports: 'import',
// 	node: 'node',
// 	style: 'style',
// 	typescript: 'type',
// } as Record<CustomConfigKeysWithPlugin, keyof PluginPrefix>;

export function mapConfigKeys(
	key: keyof ConvertedConfigs,
): keyof CustomConfigs {
	return (key === 'es6' ? 'es2022' : key);
}

const prefixConfigMap = {
	import: 'imports',
	node: 'node',
	style: 'style',
	type: 'typescript',
} as Record<keyof PluginPrefix, CustomConfigKeysWithPlugin>;

export function mapPrefixToConfigKey(
	prefix: keyof PluginPrefix,
) {
	return prefixConfigMap[prefix];
}
