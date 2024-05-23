import type { Rule } from 'eslint';

import type { ImportSettings as ImportXSettings } from 'eslint-plugin-import-x/types.js';

import type { KebabCase } from 'type-fest';

/** @note created with 'node:compat' */
import convertedConfigs from '../../../src/configs/airbnb/index.ts';

import { pluginPrefix } from '../../setupGlobal.ts';

export type ConvertedConfigs = typeof convertedConfigs;

export type PluginPrefix = typeof pluginPrefix;

export type ImportSettings = {
	[K in keyof ImportXSettings as `${PluginPrefix['import']}/${KebabCase<K>}`]: ImportXSettings[K]
};

export type RawMetaData = Readonly<
	Record<
		'eslint' | keyof PluginPrefix,
		Map<string, Rule.RuleMetaData>
	>
>;

type BaseProps = {
	deprecated?: true;
	replacedBy?: string[];
	url?: string;
};

export type MetaDataProps = BaseProps & {
	unprefixed?: string;
	source: keyof ConvertedConfigs;
	plugins?: MetaDataPluginProps[];
};

export type MetaDataPluginProps = BaseProps & {
	prefix: keyof PluginPrefix;
};

export type MetaDataItem = MetaDataProps & {
	rule: string,
};
