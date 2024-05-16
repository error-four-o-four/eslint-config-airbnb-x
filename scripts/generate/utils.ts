import type {
	ConvertedConfigs,
	PluginPrefix,
} from '../shared/types.ts';

import type {
	CustomConfigs,
	CustomConfigKeysWithPlugin,
	CustomConfigKeysWithOptions,
	CustomConfigKeysWithSettings,
} from './types.ts';

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

// export const configPrefixMap = {
// 	imports: 'import',
// 	node: 'node',
// 	style: 'style',
// 	typescript: 'type',
// } as Record<CustomConfigKeysWithPlugin, keyof PluginPrefix>;

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

export function mapConfigKeys(
	key: keyof ConvertedConfigs,
): keyof CustomConfigs {
	return (key === 'es6' ? 'es2022' : key);
}
