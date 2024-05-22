import type { Linter } from 'eslint';

/** @note created with 'node:extract' */
import type { PluginRule } from '../extractedLiteralsData.ts';

import type {
	ConvertedConfigs,
	MetaDataProps,
	MetaDataPluginProps,
} from '../shared/types/main.ts';

import type {
	CustomConfigs,
	RuleProps,
} from './types.ts';

/** @note created with 'node:extract' */
import customMetaData from '../extractedMetaData.ts';

import {
	assertNotNull,
	toKebabCase,
	getPrefixedRule,
} from '../shared/utils.ts';

import {
	customConfigKeys,
	configKeysWithOptions,
	configKeysWithSettings,
} from './setup.ts';

import {
	getLanguageOptions,
	getSettings,
} from './options.ts';

import {
	hasBeenReplaced,
	requiresReplacement,
	getReplacement,
} from './replacements.ts';

import {
	requiresOverwrite,
	getOverwrite,
} from './overwrites.ts';

import {
	configHasOptions,
	configHasSettings,
	verify,
	getRuleValue,
	mapConfigKeys,
	mapPrefixToConfigKey,
} from './utils.ts';

export function createCustomConfigs() {
	return customConfigKeys.reduce(
		(all, key) => {
			const tmp: Linter.FlatConfig = {};

			tmp.name = `airbnb:${toKebabCase(key)}`;

			if (configHasOptions(key)) {
				tmp.languageOptions = {};
			}

			if (configHasSettings(key)) {
				tmp.settings = {};
			}

			tmp.rules = {};

			return {
				...all,
				[key]: tmp,
			};
		},
		{} as CustomConfigs,
	);
}

export function applyCustomMetaData(
	sourceConfigs: ConvertedConfigs,
	targetConfigs: CustomConfigs,
) {
	customMetaData.forEach((meta, rule) => {
		let replaced = false;
		let handled = false;

		if (meta.plugins) {
			replaced = handlePluginsRule(
				rule,
				meta,
				sourceConfigs,
				targetConfigs,
			);

			const pluginTS = meta.plugins.find((data) => data.prefix === 'type');

			if (pluginTS && verify.isImportXRule(rule)) {
				/** @todo */
				console.log(`Skipped overlapping rule '${rule}' in 'typescript'`, meta.plugins);
				return;
			}

			if (pluginTS) {
				handleTypescriptRule(
					rule,
					meta,
					pluginTS,
					sourceConfigs,
					targetConfigs,
				);
			}

			if (verify.isImportXRule(rule)) {
				/** @note exit early to narrow input of subsequent function */
				return;
			}
		}

		/** @note 'replaced' is set to true when it should be added to 'disableLegacy' config */
		handled = handleEslintRule(
			rule,
			meta,
			sourceConfigs,
			targetConfigs,
			replaced,
		);

		if (!handled) {
			/** @note this should never happen */
			console.log(rule, '\n', meta, '\n');
			throw new Error('Could not apply all rules');
		}
	});

	/** @note sort rules and prepend plugin rules */
	sortRulesRecord(targetConfigs);
}

const message = 'Made a wrong assumption';

function handlePluginsRule(
	rule: string,
	meta: MetaDataProps,
	sourceConfigs: ConvertedConfigs,
	targetConfigs: CustomConfigs,
): boolean {
	assertNotNull(meta.plugins);

	const plugins = meta.plugins.filter((plugin) => plugin.prefix !== 'type');

	if (plugins.length === 0) return false;

	if (plugins.length > 1) {
		/** @todo */
		console.log(`'${rule}' is included in several plugins`);
		console.log(meta);
		throw new Error(message);
	}

	const [plugin] = plugins;
	const value = getRuleValue(rule, meta, sourceConfigs);
	const props = getPluginRuleProps(rule, value, meta, plugin);
	targetConfigs[props.key].rules[props.rule] = props.value;

	return verify.isESLintRule(rule);
}

function getPluginRuleProps(
	rule: string,
	value: Linter.RuleEntry,
	meta: MetaDataProps,
	plugin: MetaDataPluginProps,
) {
	const prefixedRule = (verify.isImportXRule(rule))
		? rule
		: getPrefixedRule<PluginRule>(plugin.prefix, rule);

	const result: RuleProps = {
		key: mapPrefixToConfigKey(plugin.prefix),
		rule: prefixedRule,
		value,
	};

	if (requiresReplacement(prefixedRule)) {
		return getReplacement(prefixedRule, meta, value);
	}

	if (requiresOverwrite(prefixedRule)) {
		result.value = getOverwrite(prefixedRule, value, meta, plugin);
		return result;
	}

	if (plugin.deprecated) {
		result.value = 0;
		return result;
	}

	result.value = value;
	return result;
}

function handleTypescriptRule(
	rule: string,
	meta: MetaDataProps,
	plugin: MetaDataPluginProps,
	sourceConfigs: ConvertedConfigs,
	targetConfigs: CustomConfigs,
) {
	/** @todo */
	// if (verify.isImportXRule(rule)) {
	// 	console.log('skipped overlapping rule in config \'typescript\'');
	// 	console.log(rule, '\n', meta.plugins, '\n');
	// 	return;
	// }

	assertNotNull(meta.plugins);

	const prefixedRule = getPrefixedRule(plugin.prefix, rule);

	if (plugin.deprecated) {
		targetConfigs.typescript.rules[prefixedRule] = 0;
		return;
	}

	if (meta.deprecated) {
		return;
	}

	const sourceValue = getRuleValue(rule, meta, sourceConfigs);
	const targetValue = requiresOverwrite(prefixedRule)
		? getOverwrite(prefixedRule, sourceValue, meta, plugin) : sourceValue;

	targetConfigs.typescript.rules[rule] = 0;
	targetConfigs.typescript.rules[prefixedRule] = targetValue;
}

function handleEslintRule(
	rule: string,
	meta: MetaDataProps,
	sourceConfigs: ConvertedConfigs,
	targetConfigs: CustomConfigs,
	wasReplaced: boolean,
) {
	if (verify.isImportXRule(rule)) {
		throw new Error('Expected \'ESLintRule\' - received \'ImportXRule\'');
	}

	/** @note check if the rule has already been replaced in 'eslint-config-airbnb-base' */
	if (meta.replacedBy && hasBeenReplaced(rule, meta, sourceConfigs)) {
		wasReplaced = true;
	}

	/** @note check the manually added replacements */
	/** @todo consider to add condition !wasReplaced */
	if (requiresReplacement(rule)) {
		const value = getRuleValue(rule, meta, sourceConfigs);
		const props = getReplacement(rule, meta, value);
		targetConfigs[props.key].rules[props.rule] = props.value;
		wasReplaced = true;
	}

	/** @note add all deprecated and replaced rules to 'disableLegacy' config */
	if (meta.deprecated || wasReplaced) {
		targetConfigs.disableLegacy.rules[rule] = 0;
		return true;
	}

	if (!meta.deprecated) {
		const targetKey = mapConfigKeys(meta.source);
		const sourceValue = getRuleValue(rule, meta, sourceConfigs);
		const targetValue = requiresOverwrite(rule)
			? getOverwrite(rule, sourceValue, meta) : sourceValue;
		targetConfigs[targetKey].rules[rule] = targetValue;
		return true;
	}

	return false;
}

function sortRulesRecord(targetConfigs: CustomConfigs) {
	customConfigKeys.forEach((config) => {
		const target = targetConfigs[config];
		const unprefixed = Object.keys(target.rules).filter((rule) => !rule.includes('/'));
		const prefixed = Object.keys(target.rules).filter((rule) => rule.includes('/'));
		const sorted = [...unprefixed.sort(), ...prefixed.sort()];

		target.rules = sorted.reduce((all, key) => ({
			...all,
			[key]: target.rules[key],
		}), {});
	});
}

// #####

export function applyOptionsAndSettings(
	sourceConfigs: ConvertedConfigs,
	targetConfigs: CustomConfigs,
) {
	configKeysWithOptions.forEach((config) => {
		const target = targetConfigs[config];
		target.languageOptions = getLanguageOptions[config]();
	});

	configKeysWithSettings.forEach(
		(config) => {
			const source = sourceConfigs.imports;
			const target = targetConfigs[config];
			target.settings = getSettings[config](source);
		},
	);
}
