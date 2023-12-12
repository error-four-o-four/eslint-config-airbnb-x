import pluginPrettier from 'eslint-plugin-prettier';
import defineBaseConfig from './src/base.js';

const message = 'linting ...';
console.log(`\u001b[33m${message}\u001b[0m`);

export default defineBaseConfig([
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
		rules: {
			'import/extensions': ['error', 'ignorePackages', { js: 'always' }],
		},
	},
	{
		files: ['scripts/**/*.js', 'eslint.config.js'],
		rules: {
			'no-console': 'off',
			'import/no-extraneous-dependencies': 'off',
		},
	},
]);
