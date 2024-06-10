import type { ESLint, Linter } from 'eslint';
import type { ImportSettings as ImportXSettings } from 'eslint-plugin-import-x/types.js';

import type { KebabCase, SetRequired } from 'type-fest';

import { pluginPrefix } from './globalSetup.ts';

export type FlatConfig = Linter.FlatConfig;
export type ESLintPlugin = ESLint.Plugin;
export type ESLintParser = Linter.FlatConfigParserModule;

export type FlatConfigWithRules = SetRequired<Linter.FlatConfig, 'rules'>;

export type PluginPrefix = typeof pluginPrefix;
export type BasePluginPrefix = Omit<PluginPrefix, 'type'>;

export type ImportSettings = {
	[K in keyof ImportXSettings as `${PluginPrefix['import']}/${KebabCase<K>}`]: ImportXSettings[K]
};
