import type { ConfigWithPluginKeys } from '../types/configs.ts';

import { pluginPrefix } from '../../src/plugins.ts';

import {
	configWithPluginKeys,
	configWithPluginKeyValues,
} from './constants.ts';

export function configHasPlugin(key: string): key is ConfigWithPluginKeys {
	return configWithPluginKeyValues.includes(key as ConfigWithPluginKeys);
}

const map = {
	[configWithPluginKeys.imports]: pluginPrefix.import,
	[configWithPluginKeys.node]: pluginPrefix.node,
	[configWithPluginKeys.stylistic]: pluginPrefix.stylistic,
	[configWithPluginKeys.typescript]: pluginPrefix.typescript,
};

export function getPluginPrefix(key: ConfigWithPluginKeys) {
	return map[key];
}

// export function getPlugin(name: PluginKey) {
// 	return configPluginMap[name] as PluginNames;
// }
