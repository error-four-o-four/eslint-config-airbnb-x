import { merge } from 'ts-deepmerge';

import customConfigs from '../../src/configs/custom/index.ts';

import type {
	ConfigWithLanguageOptions,
	MergedConfigKeys,
	MergedConfigs,
} from '../types/configs.ts';

import {
	customConfigKeys,
	mergedConfigKeys,
	mergedConfigKeyValues,
} from './constants.ts';

const mergedConfigCreator = {
	[mergedConfigKeys.baseMixed]: () => {
		// get all configs with languageOptions
		const desiredConfigs = Object
			.entries(customConfigs)
			.filter(
				([name, config]) => {
					const isNotTS = name !== customConfigKeys.typescript;
					const hasLanguageOptions = Object.hasOwn(config, 'languageOptions');
					return isNotTS && hasLanguageOptions;
				},
			).map((entry) => entry[1]) as ConfigWithLanguageOptions[];

		const languageOptions = merge<ConfigWithLanguageOptions['languageOptions'][]>(
			...desiredConfigs.map((config) => config.languageOptions),
		);

		return {
			languageOptions,
			rules: {},
		};
	},
	[mergedConfigKeys.baseJs]: () => ({
		settings: customConfigs.imports.settings || {},
		rules: {},
	}),
	[mergedConfigKeys.baseTs]: () => ({
		languageOptions: {
			parserOptions: {
				project: true,
			},
		},
		settings: customConfigs.typescript.settings || {},
		rules: {},
	}),
} as {
	[K in MergedConfigKeys]: () => MergedConfigs[K]
};

// eslint-disable-next-line import/prefer-default-export
export function createMergedConfigs() {
	return mergedConfigKeyValues.reduce(
		(all, key) => Object.assign(all, { [key]: mergedConfigCreator[key]() }),
		{},
	) as MergedConfigs;
}
