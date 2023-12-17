import plugin from '@typescript-eslint/eslint-plugin';

import { GLOB_TS, pluginNames } from '../setup/constants.js';

import typescript from './custom/typescript.js';

/** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
export default {
	name: typescript.name,
	plugins: {
		[pluginNames.typescript]: plugin,
	},
	files: GLOB_TS,
	rules: typescript.rules,
};
