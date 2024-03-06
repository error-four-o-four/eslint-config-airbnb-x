import type { Linter } from 'eslint';

import {
	addedConfigKeyValues,
	airbnbConfigKeyValues,
	configWithPluginKeyValues,
	customConfigKeyValues,
	mergedConfigKeyValues,
} from '../utils/constants.ts';

import { PartiallyRequired } from './utils.ts';

export interface BaseConfig extends Linter.BaseConfig {}
export type BaseConfigEntry = [AirbnbConfigKeys, BaseConfig];

export type AddedConfigKeys = (typeof addedConfigKeyValues)[number];
export type AirbnbConfigKeys = (typeof airbnbConfigKeyValues)[number];
export type CustomConfigKeys = (typeof customConfigKeyValues)[number];

export interface FlatConfig extends Linter.FlatConfig {
	name?: string;
}

export type AirbnbConfigs = {
	[K in AirbnbConfigKeys]: FlatConfig
};

export type CustomConfigs = {
	[K in CustomConfigKeys]: FlatConfig
};

export type ConfigWithPluginKeys = (typeof configWithPluginKeyValues)[number];

//
// mergeConfigs.ts
//

export type ConfigWithLanguageOptions = PartiallyRequired<FlatConfig, 'languageOptions'>;

export type MergedConfigKeys = (typeof mergedConfigKeyValues)[number];

export type MergedConfigs = {
	[K in MergedConfigKeys]: K extends 'base-mixed'
		? PartiallyRequired<FlatConfig, 'languageOptions' | 'rules'>
		: K extends 'base-js'
			? PartiallyRequired<FlatConfig, 'settings' | 'rules'>
			: PartiallyRequired<FlatConfig, 'languageOptions' | 'settings' | 'rules'>;
};
