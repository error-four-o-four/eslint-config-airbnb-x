import * as plugin from 'eslint-plugin-i';

import { EXTS, pluginNames } from '../setup/constants.js';

import imports from './airbnb/imports.js';

const plugins = {
	[pluginNames.import]: plugin,
};

const settings = {
	'import/core-modules': [],
	'import/external-module-folders': ['node_modules', 'node_modules/@types'],
	'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
	'import/extensions': EXTS,
	'import/parsers': {
		'@typescript-eslint/parser': EXTS,
	},
	'import/resolver': {
		node: {},
		typescript: { extensions: [...EXTS, '.json'] },
	},
};

// override
const noExtraneousDeps = imports.rules['import/no-extraneous-dependencies'];

const rules = {
	...imports.rules,
	'import/named': 0,
	'import/no-extraneous-dependencies': [
		noExtraneousDeps[0],
		{
			devDependencies: [
				...noExtraneousDeps[1].devDependencies,
				'**/eslint.config.js',
				'**/vite.config.js',
				'**/vite.config.ts',
			],
			optionalDependencies: noExtraneousDeps[1].optionalDependencies,
		},
	],
};

/** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
export default {
	name: imports.name,
	plugins,
	settings,
	rules,
};

// /** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
// export const importsJs = {
// 	name: imports.name,
// 	plugins,
// 	settings: getSettings(),
// 	rules,
// };

// /** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
// export const importsTs = {
// 	name: imports.name,
// 	plugins,
// 	settings: getSettings(EXT_TS),
// 	rules,
// };

// /** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
// export const importsMixed = {
// 	name: imports.name,
// 	plugins,
// 	settings: getSettings(EXT_ALL),
// 	rules,
// };
