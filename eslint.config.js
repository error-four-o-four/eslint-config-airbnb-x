// import pluginPrettier from 'eslint-plugin-prettier';

import defineBaseConfig from './src/base.js';

/* eslint-disable no-console */
console.log('linting ...');

// export default [
// 	{
// 		name: 'custom:prettier',
// 		plugins: {
// 			prettier: pluginPrettier,
// 		},
// 		rules: {
// 			'prettier/prettier': 'warn',
// 		},
// 	},
// ];

export default defineBaseConfig([
	{
		name: 'custom:overrides',
		rules: {
			'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
			'stylistic/no-tabs': 'off',
			'stylistic/indent': ['warn', 'tab'],
			'stylistic/linebreak-style': ['warn', 'windows'],
			'stylistic/implicit-arrow-linebreak': ['error', 'below'],
			'stylistic/max-len': [
				'warn',
				{
					code: 80,
					tabWidth: 2,
					ignoreComments: true,
					ignoreStrings: true,
				},
			],
		},
	},
	// {
	// 	name: 'custom:prettier',
	// 	plugins: {
	// 		prettier: pluginPrettier,
	// 	},
	// 	rules: {
	// 		'prettier/prettier': 'warn',
	// 	},
	// },
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
]);
