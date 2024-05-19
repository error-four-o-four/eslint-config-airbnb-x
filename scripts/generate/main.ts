import type { Linter } from 'eslint';
import type { CustomConfigs } from './types.ts';

import type { ConvertedConfigs, MetaDataProps } from '../shared/types.ts';

import customMetaData from '../extractedMetaData.ts';

import {
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
	configHasOptions,
	configHasSettings,
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

const message = 'Made a wrong assumption';

export function applyCustomMetaData(
	sourceConfigs: ConvertedConfigs,
	targetConfigs: CustomConfigs,
) {
	customMetaData.forEach((meta, rule) => {
		const value = getRuleValue(rule, meta, sourceConfigs);
		const replaced = handlePluginRule(rule, meta, value, targetConfigs);
		handleTypescriptRule(rule, meta, value, targetConfigs);

		if (meta.replacedBy) {
			/** @todo create manual overwrite */
			/** @todo consider to define replacements explicetly => 'replacements.ts' */
			console.log(`Replacement required '${rule}' => '${meta.replacedBy}'`);
		}

		if ((meta.deprecated || replaced) && !meta.unprefixed) {
			targetConfigs.disableLegacy.rules[rule] = 0;
			return;
		}

		if (meta.deprecated) {
			return;
		}

		if (!meta.deprecated) {
			const targetKey = mapConfigKeys(meta.source);
			const targetValue = getRuleValue(rule, meta, sourceConfigs);
			targetConfigs[targetKey].rules[rule] = targetValue;
			return;
		}

		/** @note this should never happen */
		console.log(rule, '\n', meta, '\n');
		throw new Error('Could not apply all rules');
	});

	// sort rules
	customConfigKeys.forEach((config) => {
		/** @todo put plugin rules at the end */
		const target = targetConfigs[config];
		target.rules = Object.keys(target.rules)
			.sort()
			.reduce((all, key) => ({
				...all,
				[key]: target.rules[key],
			}), {});
	});
}

function handlePluginRule(
	rule: string,
	meta: MetaDataProps,
	value: Linter.RuleEntry,
	targetConfigs: CustomConfigs,
): boolean {
	if (!meta.plugins) return false;

	/**
	 * @note if a note is replaced by a plugin rule it will be added to 'disableLegacy' config
	 * rules which originate in eslint-plugin-import-x won't be replaced
	 */
	let replaced = false;

	meta.plugins
		.filter((plugin) => plugin.prefix !== 'type')
		.forEach((plugin) => {
			/** @note assume the orrect origin of the plugin rule */
			if ((meta.unprefixed && plugin.prefix !== 'import')
						|| (!meta.unprefixed && plugin.prefix === 'import')) {
				console.log(rule, meta);
				throw new Error(message);
			}

			const prefixedRule = meta.unprefixed
				? getPrefixedRule(plugin.prefix, meta.unprefixed)
				: getPrefixedRule(plugin.prefix, rule);

			const targetKey = mapPrefixToConfigKey(plugin.prefix);
			const targetValue = plugin.deprecated
				? 0 : value;
			targetConfigs[targetKey].rules[prefixedRule] = targetValue;

			replaced = !meta.unprefixed;
		});

	if (replaced) return replaced;

	if (meta.plugins.length === 1 && meta.plugins[0].prefix !== 'type') {
		return replaced;
	}

	/** @note the remaing rules have overlaps */
	// console.log('remaining\n', rule, '\n', meta);

	/** @note assume that all plugin rules are applied and the remaining rules might be added to typescript config */
	if (!meta.plugins.find((plugin) => plugin.prefix === 'type')) {
		console.log(rule, meta);
		throw new Error(message);
	}

	return replaced;
}

function handleTypescriptRule(
	rule: string,
	meta: MetaDataProps,
	value: Linter.RuleEntry,
	targetConfigs: CustomConfigs,
) {
	if (!meta.plugins) return;

	if (!meta.plugins.find((plugin) => plugin.prefix === 'type')) return;

	meta.plugins
		.filter((plugin) => plugin.prefix === 'type')
		.forEach((plugin) => {
			if (meta.deprecated && !plugin.replacedBy) {
				/** @note assume that all deprecated rules have a replacement */
				throw new Error(message);
			}

			if (meta.deprecated && plugin.replacedBy) {
				/** @note assume that the deprecated rules are replaced by stylistic */
				plugin.replacedBy.forEach((key) => {
					if (key in targetConfigs.style.rules) return;
					throw new Error(message);
				});
			}

			if (meta.unprefixed) {
				/** @todo special case */
				console.log(rule, '\n', meta, '\n');
				// return;
			}

			const prefixedRule = meta.unprefixed
				? getPrefixedRule(plugin.prefix, meta.unprefixed)
				: getPrefixedRule(plugin.prefix, rule);

			if (plugin.deprecated) {
				targetConfigs.typescript.rules[prefixedRule] = 0;
				return;
			}

			targetConfigs.typescript.rules[rule] = 0;
			targetConfigs.typescript.rules[prefixedRule] = value;
		});
}

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
