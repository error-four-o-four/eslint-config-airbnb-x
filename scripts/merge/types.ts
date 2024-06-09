import type { Linter } from 'eslint';

import type { SetRequired } from 'type-fest';

import { mergedConfigKeys } from './setup.ts';

// export type MergedConfigs = {
// 	[K in (typeof mergedConfigKeys)[number]]: K extends 'baseMixed'
// 	? SetRequired<Linter.FlatConfig, 'files' | 'languageOptions' | 'rules'>
// 	: K extends 'baseJs'
// 	? SetRequired<Linter.FlatConfig, 'files' | 'settings' | 'rules'>
// 	: K extends 'baseTs'
// 	? SetRequired<Linter.FlatConfig, 'files' | 'languageOptions' | 'settings' | 'rules'>
// 	: never;
// };

export type MergedConfigs = Record<
	(typeof mergedConfigKeys)[number],
	SetRequired<Linter.FlatConfig, 'rules'>
>;
