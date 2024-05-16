import type { Rule } from 'eslint';

import convertedConfigs from '../../src/configs/airbnb/index.ts';

import { pluginPrefix } from '../setupGlobal.ts';

export type ConvertedConfigs = typeof convertedConfigs;

export type PluginPrefix = typeof pluginPrefix;

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

// ##### Utils

export type AnyRecord = Record<string, any>;

export type ObjectEntry<T> = [keyof T, T[keyof T]];

export type ValueOf<T> = T[keyof T];
