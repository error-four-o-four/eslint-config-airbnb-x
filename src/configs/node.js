import plugin from 'eslint-plugin-n';
import globals from 'globals';

import { pluginNames } from '../setup/constants.js';

import config from './airbnb/node.js';

// @todo differentiate esm and cjs
/** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
export default {
	name: config.name,
	languageOptions: {
		globals: {
			...globals.nodeBuiltin,
			...globals.node,
		},
	},
	plugins: {
		[pluginNames.node]: plugin,
	},
	rules: config.rules,
};
