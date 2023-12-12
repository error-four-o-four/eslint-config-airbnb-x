import parser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin-js';

import airbnb from './configs/airbnb/index.js';
import legacy from './configs/legacy/index.js';

import { baseOptions, baseSettings, globalsNode } from './setup/options.js';
import { pluginNames, plugins } from './setup/plugins.js';

const configs = [
	legacy,
	stylistic.configs['disable-legacy'],
	// remove languageOptions
	...airbnb.map((config) => ({
		name: config.name,
		rules: config.rules,
	})),
];

/**
 *
 * @param {import('eslint').Linter.FlatConfig[]} overrides
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
export default function defineBaseConfig(...overrides) {
	return [
		{
			name: 'airbnb:setup',
			languageOptions: {
				parser,
				...baseOptions,
				...globalsNode,
			},
			plugins: {
				[pluginNames.import]: plugins[pluginNames.import],
				[pluginNames.node]: plugins[pluginNames.node],
			},
			settings: baseSettings,
		},
		...configs,
		...overrides,
	];
}
