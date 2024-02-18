import type { Linter } from 'eslint';

import names from './names.ts';

import { pluginNames } from './plugins.ts';

const modified = {
	...Object.fromEntries(
		Object.entries(names.airbnb).filter(([name]) => name !== 'es6'),
	),
	es2022: 'es2022',
} as ModifiedNamesType;

type ModifiedNamesType = {
	readonly es2022: 'es2022';
} & Omit<typeof names.airbnb, 'es6'>;

const airbnbNameValues = Object.values(names.airbnb);
const customNameValues = Object.values(names.custom);

const configNameValues = [
	...Object.values(modified),
	...customNameValues,
] as const;

export type AirbnbNames = (typeof airbnbNameValues)[number];
export type CustomNames = (typeof customNameValues)[number];
export type ConfigNames = (typeof configNameValues)[number];

export type AirbnbConfigs = { [K in AirbnbNames]: Linter.FlatConfig };
export type CustomConfigs = { [K in ConfigNames]: Linter.FlatConfig };

export type BaseConfigEntry = [AirbnbNames, Linter.BaseConfig];

export interface FlatConfig extends Linter.FlatConfig { }

export interface NamedFlatConfig extends FlatConfig {
	name: string;
}

export type ConfigWithPlugin = keyof Pick<
	typeof names.config,
	'node' | 'imports' | 'stylistic' | 'typescript'
>;

// PLUGINS

const pluginKeys = Object.values(pluginNames);

export type PluginNames = (typeof pluginKeys)[number];

export type PluginImport = keyof Pick<typeof pluginNames, 'import'>;

export type PluginNotTypescript = keyof Pick<
	typeof pluginNames,
	'node' | 'import' | 'stylistic'
>;

// RULES

export type ApprovedMeta = {
	deprecated: false;
	config: string;
	plugin?: PluginImport;
};

export type DeprecatedMeta = {
	deprecated: true;
	config: string;
	plugin?: PluginNotTypescript;
	replacedBy?: string;
	url?: string;
};

// @todo union
export type ProcessedRule<T = ApprovedMeta | DeprecatedMeta> = {
	meta: T;
	name: string;
	value: Linter.RuleEntry;
};
