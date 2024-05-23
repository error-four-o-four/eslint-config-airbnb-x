import globals from 'globals';

import type { Linter } from 'eslint';

import type { ImportSettings } from '../shared/types/main.ts';

import type {
	LanguageOptionsCreator,
	SettingsCreator,
} from './types.ts';

import {
	ECMA_VERSION,
	SOURCE_TYPE,
	EXTS_JS,
	EXTS_MIXED,
} from '../setupGlobal.ts';

// #####

const defaultOptions: Linter.FlatConfig['languageOptions'] = {
	ecmaVersion: ECMA_VERSION,
	sourceType: SOURCE_TYPE,
};

export const getLanguageOptions = {
	es2022: () => ({
		...defaultOptions,
		parserOptions: {
			ecmaFeatures: {
				jsx: false,
				// @todo !!! double check necessity
				generators: false,
				objectLiteralDuplicateProperties: false,
			},
		},
	}),
	node: () => ({
		...defaultOptions,
		parserOptions: { ecmaFeatures: { globalReturn: true } },
		globals: {
			...globals.es2021,
			...globals.node,
			...globals.nodeBuiltin,
		},
	}),
	imports: () => ({
		...defaultOptions,
		parserOptions: {
			// required to satisfy 'import/no-named-as-default'
			ecmaVersion: ECMA_VERSION,
			sourceType: SOURCE_TYPE,
		},
	}),
	typescript: () => ({
		ecmaVersion: ECMA_VERSION,
		sourceType: SOURCE_TYPE,
		parserOptions: {
			// required to satisfy 'import/no-named-as-default'
			ecmaVersion: ECMA_VERSION,
			sourceType: SOURCE_TYPE,
			// @todo https://github.com/privatenumber/get-tsconfig?tab=readme-ov-file#faq
			project: true,
		},
	}),
} as LanguageOptionsCreator;

// #####

export const getSettings = {
	imports: ({ settings }): ImportSettings => ({
		...settings,
		'import/extensions': EXTS_JS,
		'import/parsers': { espree: EXTS_JS },
		'import/resolver': {
			node: { extensions: ['.json'] },
			typescript: { extensions: EXTS_JS as string[] },
		},
	}),
	typescript: ({ settings }): ImportSettings => ({
		...settings,
		'import/extensions': EXTS_MIXED,
		'import/external-module-folders': ['node_modules', 'node_modules/@types'],
		'import/parsers': { '@typescript-eslint/parser': EXTS_MIXED },
		'import/resolver': {
			node: { extensions: ['.json'] },
			typescript: { extensions: EXTS_MIXED as string[] },
		},
	}),
} as SettingsCreator;
