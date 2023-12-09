import * as pluginImport from 'eslint-plugin-i';
import compatImport from './_imports.js';

/** @type {import('eslint').Linter.FlatConfig} */
export default {
	name: 'airbnb:imports',
	plugins: {
		import: pluginImport,
	},
	languageOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
	},
	settings: compatImport.settings,
	rules: {
		// https://github.com/import-js/eslint-plugin-import/blob/main/README.md#helpful-warnings
		'import/export': 'error',
		'import/no-deprecated': 'off',
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
					// added
					'**/vite.config.ts',
					'**/vite.config.js',
					'**/gulpfile.js',
					'**/gulpfile.*.js',
					'**/Gruntfile{,.js}',
					'**/protractor.conf.js',
					'**/protractor.conf.*.js',
					'**/karma.conf.js',
					'**/.eslintrc.js',
				],
				optionalDependencies: false,
			},
		],
		'import/no-mutable-exports': 'error',
		'import/no-named-as-default': 'error',
		'import/no-named-as-default-member': 'error',
		'import/no-unused-modules': [
			'off',
			{ ignoreExports: [], missingExports: true, unusedExports: true },
		],

		// https://github.com/import-js/eslint-plugin-import/blob/main/README.md#module-systems
		'import/no-amd': 'error',
		'import/no-commonjs': 'error', // modified
		'import/no-import-module-exports': ['error', { exceptions: [] }],
		'import/no-nodejs-modules': 'off',
		'import/unambiguous': 'off',

		// https://github.com/import-js/eslint-plugin-import/blob/main/README.md#static-analysis
		'import/default': 'error', // modified: 0 => 2
		'import/named': 'error', // modified: 0 => 2
		'import/namespace': 'error',
		'import/no-absolute-path': 'error',
		'import/no-cycle': ['error', { maxDepth: '∞' }],
		'import/no-dynamic-require': 'error',
		'import/no-internal-modules': ['off', { allow: [] }],
		'import/no-relative-packages': 'error',
		'import/no-relative-parent-imports': 'off',
		'import/no-restricted-paths': 'off',
		'import/no-self-import': 'error',
		'import/no-unresolved': [
			'error',
			{ commonjs: false, amd: false, caseSensitive: true },
		],
		'import/no-useless-path-segments': 'error', // modified: removed commonjs
		'import/no-webpack-loader-syntax': 'error',

		// https://github.com/import-js/eslint-plugin-import/blob/main/README.md#style-guide
		// added
		'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
		'import/dynamic-import-chunkname': [
			'off',
			{ importFunctions: [], webpackChunknameFormat: '[0-9a-zA-Z-_/.]+' },
		],
		'import/exports-last': 'off',
		// => override ??
		'import/extensions': [
			'error',
			'ignorePackages',
			{ js: 'never', mjs: 'never', jsx: 'never' },
		],
		'import/first': 'error',
		'import/group-exports': 'off',
		// deprecated
		// 'import/imports-first': 'off',
		'import/max-dependencies': ['off', { max: 10 }],
		'import/newline-after-import': 'error',
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
		'import/no-default-export': 'off',
		'import/no-duplicates': 'error',
		'import/no-named-default': 'error',
		'import/no-named-export': 'off',
		'import/no-namespace': 'off',
		'import/no-unassigned-import': 'off',
		'import/order': [
			'error',
			{ groups: [['builtin', 'external', 'internal']] },
		],
		'import/prefer-default-export': 'error',
	},
};
