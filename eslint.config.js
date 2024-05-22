import defineConfig from './tmp/index.js';

const message = 'linting ...';

/* eslint-disable no-console */
console.log(`\u001b[33m${message}\u001b[0m`);

export default defineConfig(
	{
		ignores: [
			'**/tmp/*',
			'**/dist/*',
			'**/node_modules/*',
		],
	},
	{
		name: 'custom',
		files: ['**/*.js', '**/*.ts'],
		rules: {
			'import/extensions': [
				'error',
				'ignorePackages',
				{
					js: 'always',
					ts: 'always',
				},
			],
			// "flatTernaryExpressions": true (false by default) requires no indentation for ternary expressions which are nested in other ternary expressions.
			// "offsetTernaryExpressions": true (false by default) requires indentation for values of ternary expressions.
			'stylistic/indent': ['warn', 'tab'],
			// https://eslint.style/rules/js/linebreak-style#using-this-rule-with-version-control-systems
			'stylistic/linebreak-style': ['warn', 'windows'],
			'stylistic/max-len': [
				'warn',
				{
					code: 80,
					tabWidth: 2,
					ignoreUrls: true,
					ignoreComments: true,
					ignoreRegExpLiterals: true,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
				},
			],
			'stylistic/no-tabs': 0,
			'stylistic/array-bracket-newline': [
				'warn',
				{
					multiline: true,
					minItems: 3,
				},
			],
			'stylistic/array-element-newline': [
				'warn',
				{
					multiline: true,
					minItems: 3,
				},
			],
			'stylistic/object-curly-newline': [
				'warn',
				{
					ObjectExpression: {
						consistent: true,
						multiline: true,
						minProperties: 3,
					},
					ObjectPattern: {
						consistent: true,
						multiline: true,
						minProperties: 3,
					},
					ImportDeclaration: {
						consistent: true,
						multiline: true,
						minProperties: 3,
					},
					ExportDeclaration: {
						consistent: true,
						multiline: true,
						minProperties: 2,
					},
				},
			],
			'stylistic/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: false }],
			// https://eslint.style/rules/ts/lines-between-class-members#options
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
