import defineConfig from './dist/base/index.js';

const message = 'linting ...';

/* eslint-disable no-console */
console.log(`\u001b[33m${message}\u001b[0m`);

export default defineConfig(
	{
		ignores: [
			'**/dist/*',
			'**/tmp/*',
			'**/shared/*',
		],
	},
	{
		name: 'custom',
		files: [
			'**/*.js', '**/*.ts',
		],
		rules: {
			'import/extensions': [
				'error',
				'ignorePackages',
				{
					js: 'always',
					ts: 'always',
				},
			],
			'stylistic/indent': [
				'warn', 'tab',
			],
			'stylistic/linebreak-style': [
				'warn', 'windows',
			],
			'stylistic/max-len': [
				'warn', {
					ignoreStrings: true,
					ignoreComments: true,
				},
			],
			'stylistic/no-tabs': 0,
			'stylistic/array-bracket-newline': [
				'warn', { minItems: 2 },
			],
			'stylistic/array-element-newline': [
				'warn', { minItems: 3 },
			],
			'stylistic/object-curly-newline': [
				'warn', {
					ObjectExpression: {
						multiline: true,
						minProperties: 2,
					},
					ObjectPattern: {
						multiline: true,
						minProperties: 3,
					},
					ImportDeclaration: {
						multiline: true,
						minProperties: 3,
					},
					ExportDeclaration: {
						multiline: true,
						minProperties: 3,
					},
				},
			],
			'stylistic/object-property-newline': [
				'warn', { allowAllPropertiesOnSameLine: false },
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
);
