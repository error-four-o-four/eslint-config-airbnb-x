import type { ESLint, Linter } from 'eslint';
import type { ImportSettings as ImportXSettings } from 'eslint-plugin-import-x/types.js';
import type { KebabCase } from 'type-fest';

import { pluginPrefix } from './globalSetup.ts';

export const strTypeConfig = 'FlatConfig';
export const strTypePlugin = 'ESLintPlugin';
export const strTypeParser = 'ESLintParser';

export type FlatConfig = Linter.FlatConfig;
export type ESLintPlugin = ESLint.Plugin;
export type ESLintParser = Linter.FlatConfigParserModule;

export type ImportSettings = {
	[K in keyof ImportXSettings as `${PluginPrefix['import']}/${KebabCase<K>}`]: ImportXSettings[K]
};

export type PluginPrefix = typeof pluginPrefix;
