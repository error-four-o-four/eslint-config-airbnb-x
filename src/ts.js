// @TODO WiP

// https://github.com/iamturns/eslint-config-airbnb-typescript/blob/master/lib/shared.js
// https://github.com/antfu/eslint-config/blob/main/src/configs/typescript.ts
// https://github.com/vercel/style-guide/blob/canary/eslint/typescript.js

import pluginTs from '@typescript-eslint/eslint-plugin/dist/index.js';
import parserTs from '@typescript-eslint/parser/dist/index.js';

import { baseOptions, baseSettings } from './options.js';

const name = '@typescript-eslint';

/** @type {import('eslint').Linter.RulesRecord} */
export const rules = {
	// brace-style => deprecated
};

/** @type {import('eslint').Linter.FlatConfig} */
export default {
	name: 'airbnb:typescript',
	plugins: {
		[name]: pluginTs,
	},
	languageOptions: {
		...baseOptions,
		parser: parserTs,
	},
	settings: {
		...baseSettings,
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
		},
		'import/resolver': {
			node: {
				extensions: ['.mjs', '.js', '.json', '.mts', '.ts', '.d.ts'],
			},
		},
		'import/extensions': ['.mjs', '.js', '.mts', '.ts', '.d.ts'],
	},
};
