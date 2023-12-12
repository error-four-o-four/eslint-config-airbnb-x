import { ECMA_VERSION, SOURCE_TYPE } from './constants.js';

import configNode from '../configs/airbnb/node.js';

export const baseOptions = {
	sourceType: SOURCE_TYPE,
	ecmaVersion: ECMA_VERSION,
	parserOptions: {
		sourceType: SOURCE_TYPE,
		ecmaVersion: ECMA_VERSION,
		ecmaFeatures: {
			jsx: 'preserve',
		},
	},
};

export const globalsNode = {
	globals: configNode.languageOptions.globals,
};

/** @type {import('eslint').Linter.FlatConfig.settings} */
export const baseSettings = {
	'import/core-modules': [],
	'import/extensions': ['.mjs', '.js'],
	'import/external-module-folders': ['node_modules', 'node_modules/@types'],
	'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
	'import/parsers': {
		'@typescript-eslint/parser': ['.mjs', '.js'],
	},
	'import/resolver': {
		node: { extensions: ['.mjs', '.js', '.json'] },
		typescript: {},
	},
};
