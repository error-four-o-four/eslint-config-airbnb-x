import type { ConvertedConfigs } from '../shared/types/main.ts';

/** @note created with 'node:compat' */
import sourceConfig from '../../src/configs/airbnb/all.ts';
import convertedConfigs from '../../src/configs/airbnb/index.ts';

// #####

export {
	sourceConfig,
	convertedConfigs,
};

export const convertedConfigKeys = Object.keys(
	convertedConfigs,
) as [keyof ConvertedConfigs];

const extractedConfigKeys = convertedConfigKeys.filter(
	(key): key is Readonly<Exclude<keyof ConvertedConfigs, 'es6'>> => key !== 'es6',
);

const addedConfigKeys = [
	'es2022',
	'typescript',
	'disableLegacy',
] as const;

type ConcatTuple<
	K1 extends string[],
	K2 extends string[],
> = [...K1, ...K2];

export const customConfigKeys: ConcatTuple<
	Exclude<keyof ConvertedConfigs, 'es6'>[],
	(typeof addedConfigKeys)[number][]
> = [...extractedConfigKeys, ...addedConfigKeys] as const;

type CustomKeys = (typeof customConfigKeys)[number];

export const configKeysWithPlugin: Extract<
	CustomKeys,
	'imports' | 'node' | 'style' | 'typescript'
>[] = [
	'imports',
	'node',
	'style',
	'typescript',
] as const;

export const configKeysWithOptions: Extract<
	CustomKeys,
	'es2022' | 'imports' | 'node' | 'typescript'
>[] = [
	'es2022',
	'imports',
	'node',
	'typescript',
] as const;

export const configKeysWithSettings: Extract<
	CustomKeys,
	'imports' | 'typescript'
>[] = ['imports', 'typescript'] as const;
