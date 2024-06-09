import type { Rule } from 'eslint';

import type { FlatConfig, PluginPrefix } from '../../src/globalTypes.ts';
import type { ConvertedConfigs } from '../shared/types/main.ts';

import type {
	RuleItem,
	RuleProps,
	MaybeInvalidProps,
} from './replacements.ts';

import type { CustomConfigs } from './types.ts';

import rawMetaData from '../shared/raw.ts';

import { assertNotNull } from '../shared/utils/assert.ts';

import {
	getUnprefixedRule,
	isBuiltinRule,
	toKebabCase,
} from '../shared/utils/main.ts';

import {
	sourceConfig,
	convertedConfigs,
	convertedConfigKeys,
	customConfigKeys,
	configKeysWithOptions,
	configKeysWithSettings,
} from './setup.ts';

import { getLanguageOptions, getSettings } from './options.ts';
import { getReplacement, requiresReplacement } from './replacements.ts';
import { getOverwrite, requiresOverwrite } from './overwrites.ts';
import { mapConfigKeys, mapPrefixToConfigKey } from './utils.ts';

const ruleSourceConfigMap = mapSourceConfigKeys();

const targetConfigs = customConfigKeys.reduce(
	(all, key) => {
		const tmp: FlatConfig = {};

		tmp.name = `airbnb:${toKebabCase(key)}`;
		tmp.rules = {};

		return {
			...all,
			[key]: tmp,
		};
	},
	{} as CustomConfigs,
);

adjustAirbnbRules();

export function getCustomConfigs() {
	return targetConfigs;
}

function getRuleMetaData(rule: string) {
	let ruleMetaData: Rule.RuleMetaData | undefined;

	if (isBuiltinRule(rule)) {
		ruleMetaData = rawMetaData.eslint.get(rule);
	} else {
		const unprefixedRule = getUnprefixedRule(rule);
		ruleMetaData = rawMetaData.import.get(unprefixedRule);
	}

	return ruleMetaData;
}

function mapSourceConfigKeys() {
	const result: Record<string, keyof ConvertedConfigs> = {};

	convertedConfigKeys
		.forEach((key) => {
			const config = convertedConfigs[key];

			if (!config.rules) return;

			Object.keys(config.rules)
				.forEach((rule) => result[rule] = key);
		});

	return new Map(Object.entries(result));
}

function getSourceConfigKey(rule: string) {
	const config = ruleSourceConfigMap.get(rule);

	if (config) return config;

	throw new Error(`Could not find corresponding 'keyof ConvertedConfigs' of '${rule}'`);
}

function getRuleProps([rule, value]: RuleItem): MaybeInvalidProps {
	const meta = getRuleMetaData(rule);
	const source = getSourceConfigKey(rule);

	const result: MaybeInvalidProps = {
		rule,
		meta,
		value,
		source,
	};

	if (!isBuiltinRule(rule)) {
		result.unprefixed = getUnprefixedRule(rule);
	}

	return result;
}

function requiresDisapproval(item: RuleProps) {
	return item.meta.deprecated;
}

function disapproveRule(item: RuleProps) {
	if (item.unprefixed) {
		const prefix = item.rule.split('/')[0] as keyof PluginPrefix;
		const target = mapPrefixToConfigKey(prefix);
		targetConfigs[target].rules[item.rule] = 0;
		return;
	}

	targetConfigs.disableLegacy.rules[item.rule] = 0;
}

function isValidSourceRule(rule: string): rule is keyof typeof sourceConfig.rules {
	return (rule in sourceConfig.rules);
}

function isValidRuleProps(item: MaybeInvalidProps): item is RuleProps {
	return isValidSourceRule(item.rule) && !!item.meta;
}

function iterateRuleProps(item: MaybeInvalidProps) {
	if (!isValidRuleProps(item)) {
		console.log(`Skipped rule '${item.rule}' because 'RuleMetaData' or 'RuleEntry' is undefined`);
		return;
	}

	if (requiresReplacement(item)) {
		disapproveRule(item);

		const props = getReplacement(item);
		assertNotNull(props);

		targetConfigs[props.target].rules[props.replacedBy] = props.value;

		console.log(`Replaced '${item.source}' rule '${item.rule}' by '${props.replacedBy}' in '${props.target}'`);
		return;
	}

	if (requiresDisapproval(item)) {
		disapproveRule(item);

		/** @todo check has been replaced */
		return;
	}

	const targetKey = mapConfigKeys(item.source);

	if (requiresOverwrite(item)) {
		item.value = getOverwrite(item);
	}

	targetConfigs[targetKey].rules[item.rule] = item.value;
}

function adjustAirbnbRules() {
	(Object.entries(sourceConfig.rules) as RuleItem[])
		.map(getRuleProps)
		.forEach(iterateRuleProps);
}

// export function applyCustomMetaData(
// 	sourceConfigs: ConvertedConfigs,
// 	targetConfigs: CustomConfigs,
// ) {
// 	customMetaData.forEach((meta, rule) => {
// 		let replaced = false;
// 		let handled = false;

// 		if (meta.plugins) {
// 			replaced = handlePluginsRule(
// 				rule,
// 				meta,
// 				sourceConfigs,
// 				targetConfigs,
// 			);

// 			const pluginTS = meta.plugins.find((data) => data.prefix === 'type');
// 			const overwriteIsRequired = overwriteTypescriptIsRequired(rule);

// 			// if (pluginTS && verify.isImportXRule(rule)) {
// 			// 	/** @todo */
// 			// 	console.log(`Skipped overlapping rule '${rule}' in 'typescript'`, meta.plugins);
// 			// 	return;
// 			// }

// 			if (pluginTS || overwriteIsRequired) {
// 				handleTypescriptRule(
// 					rule,
// 					meta,
// 					pluginTS,
// 					sourceConfigs,
// 					targetConfigs,
// 				);
// 			}

// 			if (verify.isImportXRule(rule)) {
// 				/** @note exit early to narrow input of subsequent function */
// 				return;
// 			}
// 		}

// 		/** @note 'replaced' is set to true when it should be added to 'disableLegacy' config */
// 		handled = handleEslintRule(
// 			rule,
// 			meta,
// 			sourceConfigs,
// 			targetConfigs,
// 			replaced,
// 		);

// 		if (!handled) {
// 			/** @note this should never happen */
// 			console.log(rule, '\n', meta, '\n');
// 			throw new Error('Could not apply all rules');
// 		}
// 	});

// 	applyTypescript(targetConfigs);

// 	/** @note sort rules and prepend plugin rules */
// 	sortRulesRecord(targetConfigs);
// }

// const message = 'Made a wrong assumption';

// function handlePluginsRule(
// 	rule: string,
// 	meta: MetaDataProps,
// 	sourceConfigs: ConvertedConfigs,
// 	targetConfigs: CustomConfigs,
// ): boolean {
// 	assertNotNull(meta.plugins);

// 	const plugins = meta.plugins.filter((plugin) => plugin.prefix !== 'type');

// 	if (plugins.length === 0) return false;

// 	if (plugins.length > 1) {
// 		/** @todo */
// 		console.log(`'${rule}' is included in several plugins`);
// 		console.log(meta);
// 		throw new Error(message);
// 	}

// 	const [plugin] = plugins;
// 	const value = getRuleValue(rule, meta, sourceConfigs);
// 	const props = getPluginRuleProps(rule, value, meta, plugin);
// 	targetConfigs[props.key].rules[props.rule] = props.value;

// 	return verify.isESLintRule(rule);
// }

// function getPluginRuleProps(
// 	rule: string,
// 	value: Linter.RuleEntry,
// 	meta: MetaDataProps,
// 	plugin: MetaDataPluginProps,
// ) {
// 	const prefixedRule = (verify.isImportXRule(rule))
// 		? rule
// 		: getPrefixedRule<PluginRule>(plugin.prefix, rule);

// 	const result: RuleProps = {
// 		key: mapPrefixToConfigKey(plugin.prefix),
// 		rule: prefixedRule,
// 		value,
// 	};

// 	if (replacement.isRequired(prefixedRule)) {
// 		return replacement.get(prefixedRule, meta, value);
// 	}

// 	if (overwrite.isRequired(prefixedRule)) {
// 		result.value = overwrite.get(prefixedRule, value, meta, plugin);
// 		return result;
// 	}

// 	if (plugin.deprecated) {
// 		result.value = 0;
// 		return result;
// 	}

// 	result.value = value;
// 	return result;
// }

// function handleEslintRule(
// 	rule: string,
// 	meta: MetaDataProps,
// 	sourceConfigs: ConvertedConfigs,
// 	targetConfigs: CustomConfigs,
// 	wasReplaced: boolean,
// ) {
// 	if (verify.isImportXRule(rule)) {
// 		throw new Error('Expected \'ESLintRule\' - received \'ImportXRule\'');
// 	}

// 	/** @note check if the rule has already been replaced in 'eslint-config-airbnb-base' */
// 	if (meta.replacedBy && hasBeenReplaced(rule, meta, sourceConfigs)) {
// 		wasReplaced = true;
// 	}

// 	/** @note check the manually added replacements */
// 	/** @todo consider to add condition !wasReplaced */
// 	if (replacement.isRequired(rule)) {
// 		const value = getRuleValue(rule, meta, sourceConfigs);
// 		const props = replacement.get(rule, meta, value);
// 		targetConfigs[props.key].rules[props.rule] = props.value;
// 		wasReplaced = true;
// 	}

// 	/** @note add all deprecated and replaced rules to 'disableLegacy' config */
// 	if (meta.deprecated || wasReplaced) {
// 		targetConfigs.disableLegacy.rules[rule] = 0;
// 		return true;
// 	}

// 	if (!meta.deprecated) {
// 		const targetKey = mapConfigKeys(meta.source);
// 		const sourceValue = getRuleValue(rule, meta, sourceConfigs);
// 		const targetValue = overwrite.isRequired(rule)
// 			? overwrite.get(rule, sourceValue, meta) : sourceValue;
// 		targetConfigs[targetKey].rules[rule] = targetValue;
// 		return true;
// 	}

// 	return false;
// }

// function sortRulesRecord(targetConfigs: CustomConfigs) {
// 	customConfigKeys.forEach((config) => {
// 		const target = targetConfigs[config];
// 		const unprefixed = Object.keys(target.rules).filter((rule) => !rule.includes('/'));
// 		const prefixed = Object.keys(target.rules).filter((rule) => rule.includes('/'));
// 		const sorted = [...unprefixed.sort(), ...prefixed.sort()];

// 		target.rules = sorted.reduce((all, key) => ({
// 			...all,
// 			[key]: target.rules[key],
// 		}), {});
// 	});
// }

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
