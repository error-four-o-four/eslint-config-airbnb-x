import pluginPrettier from 'eslint-plugin-prettier';
// import defineBaseConfig from './tmp/base.min.js';

import { GLOBS } from './src/setup/constants.js';
import { assignFiles } from './src/setup/utils.js';

import bestPractices from './src/configs/airbnb/best-practices.js';
import errors from './src/configs/airbnb/errors.js';
import style from './src/configs/airbnb/style.js';
import variables from './src/configs/airbnb/variables.js';
import es6 from './src/configs/airbnb/es6.js';
import strict from './src/configs/airbnb/strict.js';

import legacy from './src/configs/custom/disable-legacy.js';
import node from './src/configs/node.js';
import imports from './src/configs/imports.js';
import typescript from './src/configs/typescript.js';
import setup from './src/setup/index.js';

const message = 'linting ...';
/* eslint-disable no-console */
console.log(`\u001b[33m${message}\u001b[0m`);

/* eslint-disable no-console */

const configs = [
	legacy,
	bestPractices,
	errors,
	node,
	style,
	variables,
	{
		// omit languageOptions
		name: es6.name,
		rules: es6.rules,
	},
	strict,
	setup,
	imports,
	typescript,
].map((config) => assignFiles(config, GLOBS));

export default [
	...configs,
	{
		ignores: ['**/dist/*', '**/tmp/*'],
	},
	{
		name: 'custom',
		plugins: {
			prettier: pluginPrettier,
		},
		files: GLOBS,
		rules: {
			'prettier/prettier': 'warn',
			'import/extensions': [
				'error',
				'ignorePackages',
				{ js: 'always', ts: 'always' },
			],
		},
	},
	{
		name: 'custom:overrides-node',
		files: ['scripts/**/*.ts'],
		rules: {
			'no-console': 0,
			'no-nested-ternary': 0,
			'no-param-reassign': 0,
			'typescript/no-use-before-define': 0,
			'import/no-extraneous-dependencies': 0,
		},
	},
];
