import type { Linter } from 'eslint';

import {
	addedConfigKeyValues,
	airbnbConfigKeyValues,
	configWithPluginKeyValues,
	customConfigKeyValues,
} from '../utils/constants.ts';

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
