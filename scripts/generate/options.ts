import globals from 'globals';

import type { Linter } from 'eslint';

import type {
	LanguageOptionsCreator,
	SettingsCreator,
} from './types.ts';

import {
	pluginPrefix,
	ECMA_VERSION,
	SOURCE_TYPE,
	EXTS_JS,
	EXTS_TS,
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

const importSettingsKeys = {
	extensions: `${pluginPrefix.import}/extensions`,
	externalModuleFolders: `${pluginPrefix.import}/external-module-folders`,
	parsers: `${pluginPrefix.import}/parsers`,
	resolver: `${pluginPrefix.import}/resolver`,
};

export const getSettings = {
	imports: ({ settings }) => ({
		...settings,
		[importSettingsKeys.extensions]: EXTS_JS,
		[importSettingsKeys.parsers]: { espree: EXTS_JS },
		[importSettingsKeys.resolver]: {
			node: { extensions: ['.json'] },
			typescript: { extensions: EXTS_JS },
		},
	}),
	typescript: ({ settings }) => {
		const exts = [...EXTS_JS, ...EXTS_TS];

		return {
			...settings,
			[importSettingsKeys.extensions]: exts,
			[importSettingsKeys.externalModuleFolders]: ['node_modules', 'node_modules/@types'],
			[importSettingsKeys.parsers]: { '@typescript-eslint/parser': exts },
			[importSettingsKeys.resolver]: {
				node: { extensions: ['.json'] },
				typescript: { extensions: exts },
			},
		};
	},
} as SettingsCreator;
