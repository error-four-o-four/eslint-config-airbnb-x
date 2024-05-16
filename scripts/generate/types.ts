/* eslint-disable stylistic/indent */
import type { Linter } from 'eslint';

// import type { ConvertedConfigs } from '../shared/types.ts';

import {
	customConfigKeys,
	configKeysWithPlugin,
	configKeysWithOptions,
	configKeysWithSettings,
} from './setup.ts';

// export type ConvertedConfigKeysWithOptions = keyof Pick<
// 	ConvertedConfigs,
// 	'es6' | 'imports' | 'node'
// >;

type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;

type ConfigWithRules = PartiallyRequired<Linter.FlatConfig, 'rules'>;

export type CustomConfigs = Record<
	(typeof customConfigKeys)[number],
	ConfigWithRules
>;

export type CustomConfigKeysWithPlugin = (
	typeof configKeysWithPlugin
)[number];

export type CustomConfigKeysWithOptions = (
	typeof configKeysWithOptions
)[number];

export type CustomConfigKeysWithSettings = (
	typeof configKeysWithSettings
)[number];

// #####

export type LanguageOptionsCreator = {
	[K in CustomConfigKeysWithOptions]: () => Linter.FlatConfig['languageOptions']
};

export type SettingsCreator = {
	[K in CustomConfigKeysWithSettings]: ({ settings }: Linter.FlatConfig) => Linter.FlatConfig['settings']
};
