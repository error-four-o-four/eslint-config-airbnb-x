import parser from '@typescript-eslint/parser';

import rules from './rules.js';

import { pluginNames, plugins } from './plugins.js';
import { baseOptions, baseSettings } from './options.js';

/**
 *
 * @param {import('eslint').Linter.FlatConfig[]} overrides
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
const defineBaseConfig = (overrides = []) => [
	{
		name: 'airbnb:setup',
		languageOptions: {
			// use typescript parser by default
			// to support 'imports/exports' field in package.json
			parser,
			...baseOptions,
		},
		plugins: {
			// import
			[pluginNames.i]: plugins[pluginNames.i],
			// node
			[pluginNames.n]: plugins[pluginNames.n],
			// stylistic
			[pluginNames.s]: plugins[pluginNames.s],
		},
		settings: baseSettings,
	},
	...rules,
	...overrides,
];

export default defineBaseConfig;
