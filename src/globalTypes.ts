import type { ImportSettings as ImportXSettings } from 'eslint-plugin-import-x/types.js';
import type { Linter } from 'eslint';
import type { KebabCase } from 'type-fest';

import { pluginPrefix } from './globalSetup.ts';

export type FlatConfig = Linter.FlatConfig;

export type ImportSettings = {
	[K in keyof ImportXSettings as `${PluginPrefix['import']}/${KebabCase<K>}`]: ImportXSettings[K]
};

export type PluginPrefix = typeof pluginPrefix;
