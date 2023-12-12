import parser from '@typescript-eslint/parser';
import pluginPrettier from 'eslint-plugin-prettier';

import configs from './src/configs/index.js';

import { baseOptions, baseSettings, globalsNode } from './src/setup/options.js';
import { pluginNames, plugins } from './src/setup/plugins.js';

const rules = configs
	.filter((config) => config.name !== 'airbnb:stylistic')
	.map((config) => ({
		name: config.name,
		rules: config.rules,
	}));

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
export default [
	{
		name: 'setup',
		languageOptions: {
			parser,
			...baseOptions,
			...globalsNode,
		},
		plugins: {
			// import
			[pluginNames.i]: plugins[pluginNames.i],
			// node
			[pluginNames.n]: plugins[pluginNames.n],
			// ts
			// [pluginNames.ts]: plugins[pluginNames.ts],
		},
		settings: baseSettings,
	},
	...rules,
	{
		name: 'custom:overrides',
		rules: {
			'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
			// 'stylistic/no-tabs': 'off',
			// 'stylistic/indent': ['warn', 'tab'],
			// 'stylistic/linebreak-style': ['warn', 'windows'],
			// 'stylistic/implicit-arrow-linebreak': ['error', 'below'],
			// 'stylistic/max-len': [
			//   'warn',
			//   {
			//     code: 80,
			//     tabWidth: 2,
			//     ignoreComments: true,
			//     ignoreStrings: true,
			//   },
			// ],
		},
	},
	{
		name: 'custom:prettier',
		plugins: {
			prettier: pluginPrettier,
		},
		rules: {
			'prettier/prettier': 'warn',
		},
	},
	{
		files: ['scripts/**/*.js', 'eslint.config.js'],
		languageOptions: {
			globals: {
				console: false,
			},
		},
		rules: {
			'no-console': 'off',
			'import/no-extraneous-dependencies': 'off',
		},
	},
];
