import pluginPrettier from 'eslint-plugin-prettier';
// import defineBaseConfig from './tmp/base.min.js';

// import { GLOB_ALL } from './src/setup/constants.js';
// import { assignFiles } from './src/setup/utils.js';
import { optionsMixed } from './src/setup/options.js';

import bestPractices from './src/configs/airbnb/best-practices.js';
import errors from './src/configs/airbnb/errors.js';
import style from './src/configs/airbnb/style.js';
import variables from './src/configs/airbnb/variables.js';
import es6 from './src/configs/airbnb/es6.js';
import strict from './src/configs/airbnb/strict.js';

import legacy from './src/configs/custom/disable-legacy.js';

import node from './src/configs/node.js';
import typescript from './src/configs/typescript.js';
import { importsMixed } from './src/configs/imports.js';

const message = 'linting ...';
console.log(`\u001b[33m${message}\u001b[0m`);

export default [
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
	typescript,
	optionsMixed,
	importsMixed,
	{
		ignores: ['**/dist/*', '**/tmp/*'],
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
		name: 'custom:overrides',
		linterOptions: {
			reportUnusedDisableDirectives: true,
		},
		rules: {
			'import/extensions': [
				'error',
				'ignorePackages',
				{ js: 'always', ts: 'always' },
			],
		},
	},
	{
		name: 'custom:overrides-node',
		files: ['scripts/**/*.ts', 'eslint.config.js'],
		rules: {
			'no-console': 0,
			'no-nested-ternary': 0,
			'no-param-reassign': 0,
			'typescript/no-use-before-define': 0,
			'import/no-extraneous-dependencies': 0,
		},
	},
];

// export default defineConfig(
// 	{
// 		ignores: ['**/dist/*', '**/tmp/*'],
// 	},
// 	{
// 		name: 'custom:prettier',
// 		plugins: {
// 			prettier: pluginPrettier,
// 		},
// 		rules: {
// 			'prettier/prettier': 'warn',
// 		},
// 	},
// 	{
// 		name: 'custom:overrides',
// 		linterOptions: {
// 			reportUnusedDisableDirectives: true,
// 		},
// 		rules: {
// 			'import/extensions': [
// 				'error',
// 				'ignorePackages',
// 				{ js: 'always', ts: 'always' },
// 			],
// 		},
// 	},
// 	{
// 		name: 'custom:overrides-node',
// 		files: ['scripts/**/*.ts', 'eslint.config.js'],
// 		rules: {
// 			'no-console': 0,
// 			'no-nested-ternary': 0,
// 			'no-param-reassign': 0,
// 			'typescript/no-use-before-define': 0,
// 			'import/no-extraneous-dependencies': 0,
// 		},
// 	}
// );
