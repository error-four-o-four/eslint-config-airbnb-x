import type { Linter } from 'eslint';
import type { CustomConfigs } from './types.ts';
import type {
	ConvertedConfigs, MetaDataProps, RawMetaData,
} from '../shared/types.ts';

import customMetaData from '../extractedMetaData.ts';

// import { pluginPrefix } from '../setupGlobal.ts';

import {
	assertNotNull,
	toKebabCase,
	toPrefixedKey,
	// toPrefixedKey,
} from '../shared/utils.ts';

import {
	customConfigKeys,
	configKeysWithOptions,
	configKeysWithSettings,
} from './setup.ts';

import { hasOverwrite, overwrite } from './overwrites.ts';
import { getLanguageOptions, getSettings } from './options.ts';

import {
	configHasOptions,
	configHasSettings,
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

function getRuleValue(
	rule: string,
	meta: MetaDataProps,
	source: ConvertedConfigs,
) {
	const config = source[meta.source];
	assertNotNull(config.rules);

	let value = config.rules[rule];
	assertNotNull(value);

	if (hasOverwrite(rule)) {
		value = overwrite(rule, value);
	}

	return Array.isArray(value)
		? value as Linter.RuleLevelAndOptions
		: value as Linter.RuleLevel;
}

export function applyCustomMetaData(
	sourceConfigs: ConvertedConfigs,
	targetConfigs: CustomConfigs,
) {
	customMetaData.forEach((meta, rule) => {
		const value = getRuleValue(rule, meta, sourceConfigs);

		const origin: keyof Pick<RawMetaData, 'eslint' | 'import'> = meta.unprefixed
			? 'import' : 'eslint';

		if (meta.replacedBy) {
			/** @todo create manual overwrite */
			console.log(`Create manual overwrite '${rule}:${meta.replacedBy}'`);
		}

		/** @todo consider to add rules which are replaced by a plugin */
		if (meta.deprecated && origin === 'eslint') {
			targetConfigs.disableLegacy.rules[rule] = 0;
		}

		// console.log(!meta.deprecated && !meta.plugins && origin === 'eslint', !meta.deprecated, !meta.plugins, origin === 'eslint');

		if (!meta.deprecated && !meta.plugins && origin === 'eslint') {
			const targetKey = mapConfigKeys(meta.source);
			targetConfigs[targetKey].rules[rule] = value;
		}

		if (!meta.plugins) {
			return;
		}

		meta.plugins.forEach((metaPlugin) => {
			if (metaPlugin.prefix === 'import' && meta.source === 'imports') {
				const target = targetConfigs[meta.source];
				target.rules[rule] = metaPlugin.deprecated ? 0 : value;
				return;
			}

			if (metaPlugin.prefix === 'type') {
				const targetKey = mapConfigKeys(meta.source);
				targetConfigs[targetKey].rules[rule] = value;

				const prefixedRule = toPrefixedKey(metaPlugin.prefix, rule);
				const target = targetConfigs.typescript;
				target.rules[rule] = 0;
				target.rules[prefixedRule] = metaPlugin.deprecated ? 0 : value;
				return;
			}

			if (metaPlugin.prefix === 'node' || metaPlugin.prefix === 'style') {
				const targetKey = mapPrefixToConfigKey(metaPlugin.prefix);
				const target = targetConfigs[targetKey];
				const prefixedRule = toPrefixedKey(metaPlugin.prefix, rule);
				target.rules[prefixedRule] = metaPlugin.deprecated ? 0 : value;
				return;
			}

			console.log(meta);
			throw new Error(`Rule '${rule}' was not processed`);
		});

		// const config = mapPrefixToConfigKey(meta.prefix);
		// const prefixedKey = toPrefixedKey(meta.prefix, rule);
		// const pluginValue = meta.origin === 'import' && meta.deprecated ? 0 : value;
		// targetConfigs[config].rules[prefixedKey] = pluginValue;

		// throw new Error(`Rule '${rule}' was not processed`);
	});

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

// export function applyTypescriptMetaData(
// 	sourceConfigs: ConvertedConfigs,
// 	targetConfigs: CustomConfigs,
// ) {
// 	const unprefixed: Record<string, Linter.RuleEntry> = {};
// 	const prefixed: Record<string, Linter.RuleEntry> = {};

// 	customMetaDataTs.forEach((meta, key) => {
// 		const prefixedKey = toPrefixedKey(pluginPrefix.type, key);
// 		const value = getRuleValue(key, meta, sourceConfigs);

// 		if (!meta.deprecated) {
// 			unprefixed[key] = 0;
// 			prefixed[prefixedKey] = value;
// 		} else {
// 			prefixed[prefixedKey] = 0;
// 		}
// 	});

// 	targetConfigs.typescript.rules = {
// 		...unprefixed,
// 		...prefixed,
// 	};
// }

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
