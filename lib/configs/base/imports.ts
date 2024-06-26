/** @file GENERATED WITH SCRIPT */
import eslintPluginImportX from 'eslint-plugin-import-x';
import type { FlatConfig, ESLintPlugin } from '../../../src/globalTypes.ts';

export default {
	name: 'airbnb:imports',
	plugins: {
		import: eslintPluginImportX as unknown as ESLintPlugin,
	},
	languageOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		parserOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
		},
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.json'],
			},
			typescript: {
				extensions: [
					'.js',
					'.mjs',
					'.cjs',
				],
			},
		},
		'import/extensions': [
			'.js',
			'.mjs',
			'.cjs',
		],
		'import/core-modules': [],
		'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
		'import/parsers': {
			espree: [
				'.js',
				'.mjs',
				'.cjs',
			],
		},
	},
	rules: {
		'import/default': 'off',
		'import/dynamic-import-chunkname': [
			'off',
			{
				importFunctions: [],
				webpackChunknameFormat: '[0-9a-zA-Z-_/.]+',
			},
		],
		'import/export': 'error',
		'import/exports-last': 'off',
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				mjs: 'never',
				jsx: 'never',
			},
		],
		'import/first': 'error',
		'import/group-exports': 'off',
		'import/imports-first': 0,
		'import/max-dependencies': [
			'off',
			{
				max: 10,
			},
		],
		'import/named': 'error',
		'import/namespace': 'off',
		'import/newline-after-import': 'error',
		'import/no-absolute-path': 'error',
		'import/no-amd': 'error',
		'import/no-anonymous-default-export': [
			'off',
			{
				allowArray: false,
				allowArrowFunction: false,
				allowAnonymousClass: false,
				allowAnonymousFunction: false,
				allowLiteral: false,
				allowObject: false,
			},
		],
		'import/no-commonjs': 'off',
		'import/no-cycle': [
			'error',
			{
				maxDepth: '∞',
			},
		],
		'import/no-default-export': 'off',
		'import/no-deprecated': 'off',
		'import/no-duplicates': 'error',
		'import/no-dynamic-require': 'error',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: [
					'test/**',
					'tests/**',
					'spec/**',
					'**/__tests__/**',
					'**/__mocks__/**',
					'test.{js,jsx}',
					'test-*.{js,jsx}',
					'**/*{.,_}{test,spec}.{js,jsx}',
					'**/jest.config.js',
					'**/jest.setup.js',
					'**/vue.config.js',
					'**/webpack.config.js',
					'**/webpack.config.*.js',
					'**/rollup.config.js',
					'**/rollup.config.*.js',
					'**/gulpfile.js',
					'**/gulpfile.*.js',
					'**/Gruntfile{,.js}',
					'**/protractor.conf.js',
					'**/protractor.conf.*.js',
					'**/karma.conf.js',
					'**/.eslintrc.js',
					'**/eslint.config.js',
					'**/vite.config.js',
					'**/vite.config.*.js',
				],
				optionalDependencies: false,
			},
		],
		'import/no-import-module-exports': [
			'error',
			{
				exceptions: [],
			},
		],
		'import/no-internal-modules': [
			'off',
			{
				allow: [],
			},
		],
		'import/no-mutable-exports': 'error',
		'import/no-named-as-default': 'error',
		'import/no-named-as-default-member': 'error',
		'import/no-named-default': 'error',
		'import/no-named-export': 'off',
		'import/no-namespace': 'off',
		'import/no-nodejs-modules': 'off',
		'import/no-relative-packages': 'error',
		'import/no-relative-parent-imports': 'off',
		'import/no-restricted-paths': 'off',
		'import/no-self-import': 'error',
		'import/no-unassigned-import': 'off',
		'import/no-unresolved': [
			'error',
			{
				commonjs: true,
				caseSensitive: true,
			},
		],
		'import/no-unused-modules': [
			'off',
			{
				ignoreExports: [],
				missingExports: true,
				unusedExports: true,
			},
		],
		'import/no-useless-path-segments': [
			'error',
			{
				commonjs: true,
			},
		],
		'import/no-webpack-loader-syntax': 'error',
		'import/order': [
			'error',
			{
				groups: [
					[
						'builtin',
						'external',
						'internal',
					],
				],
			},
		],
		'import/prefer-default-export': 'error',
		'import/unambiguous': 'off',
	},
} satisfies FlatConfig;
