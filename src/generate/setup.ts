import type { FlatConfig } from '../globalTypes.ts';
import type { ConcatTuple } from '../utils/types.ts';

/** @note created with 'node:compat' */
import airbnbConfig from '../../lib/configs/merged/compat.ts';
import sourceConfigs from '../../lib/configs/compat/index.ts';

import { toKebabCase } from '../utils/helpers.ts';

import type { SourceConfigs, TargetConfigs } from './types.ts';

// #####

export {
	airbnbConfig,
	sourceConfigs,
};

export const sourceConfigKeys = Object.keys(
	sourceConfigs,
) as Readonly<Array<keyof SourceConfigs>>;

const extractedConfigKeys = sourceConfigKeys.filter(
	(key): key is Readonly<Exclude<keyof SourceConfigs, 'es6'>> => key !== 'es6',
);

const addedConfigKeys = ['es2022', 'disableLegacy'] as const;

export const targetConfigKeys: ConcatTuple<
	Exclude<keyof SourceConfigs, 'es6'>[],
	(typeof addedConfigKeys)[number][]
> = [...extractedConfigKeys, ...addedConfigKeys] as const;

export const targetConfigs = targetConfigKeys.reduce(
	(all, key) => {
		const tmp: FlatConfig = {};

		tmp.name = `airbnb:${toKebabCase(key)}`;
		tmp.rules = {};

		return {
			...all,
			[key]: tmp,
		};
	},
	{} as TargetConfigs,
);

// #####

export const removedRules = ['require-jsdoc', 'valid-jsdoc'];
