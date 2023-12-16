import * as plugin from 'eslint-plugin-i';

import { EXT_ALL, EXT_JS, EXT_TS, pluginNames } from '../setup/constants.js';

import imports from './airbnb/imports.js';

const plugins = {
	[pluginNames.import]: plugin,
};

const settings = {
	'import/core-modules': [],
	'import/external-module-folders': ['node_modules', 'node_modules/@types'],
	'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
};

const getExtensions = (array) => ({
	'import/extensions': array,
	'import/parsers': {
		'@typescript-eslint/parser': array,
	},
	'import/resolver': {
		node: {},
		typescript: { extensions: [...array, '.json'] },
	},
});

// @todo
// check installed packages
// get extensions dynamically
const getSettings = (extensions = EXT_JS) => ({
	...settings,
	...getExtensions(extensions),
});

const rules = {
	...imports.rules,
	'import/named': 0,
};

/** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
export const importsJs = {
	name: imports.name,
	plugins,
	settings: getSettings(),
	rules,
};

/** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
export const importsTs = {
	name: imports.name,
	plugins,
	settings: getSettings(EXT_TS),
	rules,
};

/** @type {import('../../shared/types.d.ts').NamedFlatConfig} */
export const importsMixed = {
	name: imports.name,
	plugins,
	settings: getSettings(EXT_ALL),
	rules,
};
