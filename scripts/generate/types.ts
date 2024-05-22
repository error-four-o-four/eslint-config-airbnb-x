import type { Linter } from 'eslint';

/** @note created with 'node:extract' */
import type {
	ESLintRule,
	PluginRule,
} from '../extractedLiteralsData.ts';

import type {
	MetaDataProps,
	MetaDataPluginProps,
} from '../shared/types/main.ts';

import type {
	PartiallyRequired,
} from '../shared/types/utils.ts';

import {
	customConfigKeys,
	configKeysWithPlugin,
	configKeysWithOptions,
	configKeysWithSettings,
} from './setup.ts';

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

// #####

export type RuleProps = {
	key: keyof CustomConfigs,
	rule: ESLintRule | PluginRule,
	value: Linter.RuleEntry;
};

export type ReplacementOptions = {
	meta: MetaDataProps;
	value: Linter.RuleEntry;
};

export type OverwriteOptions = ReplacementOptions & {
	plugin?: MetaDataPluginProps;
};
