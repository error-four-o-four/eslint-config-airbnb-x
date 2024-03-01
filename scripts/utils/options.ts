import globals from 'globals';

import { Settings } from '@antfu/eslint-define-config';

import {
	AirbnbConfigKeys,
	CustomConfigKeys,
	FlatConfig,
} from '../types/configs.ts';

import {
	EXTS_JS,
	ECMA_VERSION,
	SOURCE_TYPE,
	EXTS_TS,
} from './constants.ts';

import { pluginPrefix } from '../../src/plugins.ts';

const defaultOptions: FlatConfig['languageOptions'] = {
	ecmaVersion: ECMA_VERSION,
	sourceType: SOURCE_TYPE,
};

export const getLanguageOptions = {
	es6: () => ({
		parserOptions: {
			ecmaFeatures: {
				jsx: false,
				// @todo !!! double check necessity
				generators: false,
				objectLiteralDuplicateProperties: false,
			},
		},
		...defaultOptions,
	}),
	node: () => ({
		parserOptions: { ecmaFeatures: { globalReturn: true } },
		globals: {
			...globals.es2021,
			...globals.node,
			...globals.nodeBuiltin,
		},
		...defaultOptions,
	}),
	imports: () => ({
		parserOptions: {
			// required to satisfy 'import/no-named-as-default'
			ecmaVersion: ECMA_VERSION,
			sourceType: SOURCE_TYPE,
		},
		...defaultOptions,
	}),
	typescript: () => ({
		ecmaVersion: ECMA_VERSION,
		sourceType: SOURCE_TYPE,
		parserOptions: {
			// required to satisfy 'import/no-named-as-default'
			ecmaVersion: ECMA_VERSION,
			sourceType: SOURCE_TYPE,
			project: true,
		},
	}),
} as {
	[K in ConfigKeysWithOptions]: (...args: any[]) => FlatConfig['languageOptions']
};

type ConfigKeysWithOptions = Extract<
	AirbnbConfigKeys | CustomConfigKeys,
	'es6' | 'node' | 'imports' | 'typescript'
>;

const importSettingsKeys = {
	extensions: `${pluginPrefix.import}/extensions`,
	resolver: `${pluginPrefix.import}/resolver`,
	parsers: `${pluginPrefix.import}/parsers`,
};

export const getSettings = {
	imports: (source) => ({
		...source,
		[importSettingsKeys.extensions]: EXTS_JS,
		[importSettingsKeys.resolver]: {
			node: { extensions: ['.json'] },
			typescript: { extensions: EXTS_JS },
		},
		[importSettingsKeys.parsers]: { espree: EXTS_JS },
	}),
	typescript: (source) => {
		const exts = [...EXTS_JS, ...EXTS_TS];

		return ({
			...source,
			[importSettingsKeys.resolver]: {
				node: { extensions: ['.json'] },
				typescript: { extensions: exts },
			},
			[importSettingsKeys.extensions]: [exts],
			[importSettingsKeys.parsers]: { '@typescript-eslint/parser': exts },
		});
	},
} as {
	[K in ConfigKeysWithSettings]: ({ settings }: FlatConfig) => Settings
};

type ConfigKeysWithSettings = Extract<
	AirbnbConfigKeys | CustomConfigKeys,
	'imports' | 'typescript'
>;