import globals from 'globals';

import type { FlatConfig } from '../globalTypes.ts';

import { ECMA_VERSION, SOURCE_TYPE } from '../globalSetup.ts';

import { assertNotNull } from '../utils/assert.ts';

import type { TargetConfigs } from './types.ts';
import { merge } from 'ts-deepmerge';

const defaultOptions: FlatConfig['languageOptions'] = {
	ecmaVersion: ECMA_VERSION,
	sourceType: SOURCE_TYPE,
};

const languageOptions: {
	[K in keyof Partial<TargetConfigs>]:
	(sourceOptions: FlatConfig['languageOptions']) => FlatConfig['languageOptions']
} = {
	es2022: (sourceOptions) => ({
		...defaultOptions,
		parserOptions: {
			ecmaFeatures: {
				jsx: false,
				...sourceOptions?.parserOptions?.ecmaFeatures,
			},
		},
		globals: {

			...globals.es2022,
		},
	}),
	node: () => ({
		...defaultOptions,
		parserOptions: {
			ecmaFeatures: { globalReturn: true },
		},
		globals: {

			...globals.node,

			...globals.nodeBuiltin,
		},
	}),
	imports: () => ({
		...defaultOptions,
		parserOptions: {
			// required to satisfy 'import/no-named-as-default'
			ecmaVersion: ECMA_VERSION,
			sourceType: 'module', // !== languageOptions.sourceType (!)
		},
	}),
	// typescript: () => ({
	// 	ecmaVersion: ECMA_VERSION,
	// 	sourceType: SOURCE_TYPE,
	// 	parserOptions: {
	// 		// required to satisfy 'import/no-named-as-default'
	// 		ecmaVersion: ECMA_VERSION,
	// 		sourceType: SOURCE_TYPE,
	// 		// @todo https://github.com/privatenumber/get-tsconfig?tab=readme-ov-file#faq
	// 		project: true,
	// 	},
	// }),
};

export function getLanguageOptions(
	key: keyof TargetConfigs,
	source: FlatConfig['languageOptions'],
) {
	const fn = languageOptions[key];

	assertNotNull(fn, `Expected config '${key}' to have 'languageOptions'`);

	return fn(source);
}

export function getTypescriptOptions(
	source: NonNullable<FlatConfig['languageOptions']>,
): FlatConfig['languageOptions'] {
	return merge(source, {
		parserOptions: {
			projectService: true,
		},
	});
}
