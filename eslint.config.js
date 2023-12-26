// import pluginPrettier from 'eslint-plugin-prettier';

import defineConfig from './src/defineBaseConfig.js';

const message = 'linting ...';
/* eslint-disable no-console */
console.log(`\u001b[33m${message}\u001b[0m`);

export default defineConfig(
	{
		ignores: ['**/dist/*', '**/tmp/*', '**/shared/*'],
	},
	{
		name: 'custom',
		// plugins: {
		// 	prettier: pluginPrettier,
		// },
		files: ['**/*.js', '**/*.ts'],
		rules: {
			// 'prettier/prettier': 'warn',
			'import/extensions': [
				'error',
				'ignorePackages',
				{ js: 'always', ts: 'always' },
			],
			'stylistic/indent': ['warn', 'tab'],
			'stylistic/linebreak-style': ['warn', 'windows'],
			'stylistic/no-tabs': 0,
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
);
