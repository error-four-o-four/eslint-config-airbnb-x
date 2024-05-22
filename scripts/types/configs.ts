// import type { Linter } from 'eslint';

// import {
// 	configWithPluginKeyValues,
// 	mergedConfigKeyValues,
// } from '../utils/constants.ts';

// import type { PartiallyRequired } from './utils.ts';

// import { addedConfigKeys, customConfigKeys } from '../generate/setup.ts';

// import convertedConfigs from '../../src/configs/airbnb/index.ts';

// export type ConvertedConfigs = typeof convertedConfigs;
// export type ConvertedConfigKeys = keyof ConvertedConfigs;

// export type AddedConfigKeys = (typeof addedConfigKeys)[number];
// export type CustomConfigKeys = (typeof customConfigKeys)[number];

// export type CustomConfigs = {
// 	[K in CustomConfigKeys]: Linter.FlatConfig
// };

// export type ConfigWithPluginKeys = (typeof configWithPluginKeyValues)[number];

// //
// // mergeConfigs.ts
// //

// export type ConfigWithLanguageOptions = PartiallyRequired<Linter.FlatConfig, 'languageOptions'>;

// export type MergedConfigKeys = (typeof mergedConfigKeyValues)[number];

// export type MergedConfigs = {
// 	[K in MergedConfigKeys]: K extends 'base-mixed'
// 	? PartiallyRequired<Linter.FlatConfig, 'languageOptions' | 'rules'>
// 	: K extends 'base-js'
// 	? PartiallyRequired<Linter.FlatConfig, 'settings' | 'rules'>
// 	: PartiallyRequired<Linter.FlatConfig, 'languageOptions' | 'settings' | 'rules'>;
// };
