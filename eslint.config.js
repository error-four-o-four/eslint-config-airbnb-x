// @ts-check
import tslint from 'typescript-eslint';

import pluginImports from 'eslint-plugin-import-x';
import pluginNode from 'eslint-plugin-n';
import pluginStyle from '@stylistic/eslint-plugin';

import { fixupPluginRules } from '@eslint/compat';

import style from './eslint.style.js';

/**
 *
 * @param {import('type-fest').UnknownRecord} source
 * @param {string} prefix
 */
const renamePrefix = (source, prefix) => {
	return Object.entries(source).reduce((all, [key, value]) => {
		const rule = key.includes('/')
			? prefix + '/' + key.split('/').at(-1)
			: key;

		return {
			...all,
			[rule]: value,
		};
	}, {});
};

/** @type {import('eslint').Linter.FlatConfigParserModule} */
// Type '{ meta?: { name?: string | undefined; version?: string | undefined; } | undefined; parseForESLint(text: string, options?: unknown): { ast: unknown; services?: unknown; scopeManager?: unknown; visitorKeys?: unknown; }; }' is not assignable to type 'FlatConfigParserModule | undefined'.
// 	... Type 'unknown' is not assignable to type 'VisitorKeys | undefined'.ts(2322)
// @ts-expect-error incompatible types
const tsParser = tslint.parser;

/** @type {import('eslint').Linter.FlatConfig['rules']} */
const tsRules = tslint.configs.recommendedTypeCheckedOnly
	.map((config) => config.rules)
	.reduce((all, rules) => {
		all = {
			...all,
			...renamePrefix(rules || {}, 'typed'),
		};

		return all;
	}, {});

/** @type {import('eslint').Linter.FlatConfig['rules']} */
const importRules = {
	...renamePrefix(pluginImports.configs.recommended.rules, 'import'),
	// moduleResolution 'node16' enforces to include extensions
	'import/extensions': 0,
	// https://typescript-eslint.io/troubleshooting/performance-troubleshooting/#eslint-plugin-import
	// We recommend you do not use the following rules, as TypeScript provides the same checks as part of standard type checking:
	'import/named': 0,
	'import/namespace': 0,
	'import/default': 0,
	'import/no-named-as-default': 0,
	'import/no-named-as-default-member': 0,
	'import/no-unresolved': 0,
	/** @todo */
	// [Error - 3:10:43 PM] Request textDocument/formatting failed.
	// Message: Request textDocument/formatting failed with message: No ESLint configuration found in .\eslint-config-airbnb-x.
	// Occurred while linting .\eslint-config-airbnb-x\eslint.config.js:91
	// Rule: "import/no-unused-modules"
	// 	Code: -32603
	// 'import/no-unused-modules': [
	// 	1,
	// 	{
	// 		unusedExports: true,
	// 	},
	// ],
};

const message = 'linting (mvp) ...';

console.log(`\u001b[33m${message}\u001b[0m`);

/**  @type {import('eslint').Linter.FlatConfig['plugins']} */
const plugins = {
	// Type '({ plugins: { import: { configs: { recommended: { plugins: ["import-x"]; rules: { 'import-x/no-unresolved': "error"; 'import-x/named': "error"; 'import-x/namespace': "error"; 'import-x/default': "error"; 'import-x/export': "error"; 'import-x/no-named-as-default': "warn"; 'import-x/no-named-as-default-member': "warn"...' is not assignable to type 'FlatConfig<RulesRecord>[]'.
	//  ... Type 'null' is not assignable to type 'string | undefined'.ts(2322)
	// @ts-expect-error incompatible types
	import: fixupPluginRules(pluginImports),
	node: fixupPluginRules(pluginNode),
	// Type '{ rules: Rules; configs: { 'disable-legacy': FlatConfig<RulesRecord>; customize: { (options: StylisticCustomizeOptions<false>): BaseConfig<...>; (options?: StylisticCustomizeOptions<...> | undefined): FlatConfig<...>; }; ... 4 more ...; 'recommended-legacy': BaseConfig<...>; }; }' is not assignable to type 'Plugin'.
	//  ... Type '{ (options: StylisticCustomizeOptions<false>): BaseConfig<RulesRecord, RulesRecord>; (options?: StylisticCustomizeOptions<true> | undefined): FlatConfig<...>; }' is not assignable to type 'FlatConfig<RulesRecord> | ConfigData<RulesRecord> | FlatConfig<RulesRecord>[]'.ts(2322)
	// @ts-expect-error incompatible types
	style: fixupPluginRules(pluginStyle),
	// Type 'import("./node_modules/@typescript-eslint/utils/dist/ts-eslint/Config").FlatConfig.Plugin' is not assignable to type 'import("./node_modules/@types/eslint/index").ESLint.Plugin'.
	//  ... Type 'unknown' is not assignable to type 'VisitorKeys | undefined'.ts(2322)
	// @ts-expect-error incompatible types
	typed: fixupPluginRules(tslint.plugin),
};

/**  @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		ignores: [
			'**/tmp/*',
			'**/dist/*',
			'**/node_modules/*',
		],
	},
	{
		name: 'common',
		files: ['**/*.js', '**/*.ts'],
		plugins,
		settings: {
			'import/core-modules': [],
			'import/extensions': ['.js', '.ts'],
			'import/external-module-folders': ['node_modules', 'node_modules/@types'],
			'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
			'import/parsers': {
				/**
				 * @todo this is not enough (!)
				 * Parse errors in imported module 'eslint-plugin-n': parserPath or languageOptions.parser is required! (undefined:undefined)eslint import/no-named-as-default
				 * @see https://github.com/un-ts/eslint-plugin-import-x/pull/85
				 */
				// espree: [
				// 	'.js',
				// 	'.cjs',
				// 	'.mjs',
				// ],
				'@typescript-eslint/parser': [
					// '.js',
					'.ts',
					'.cts',
					'.mts',
				],
			},
			'import/resolver': {
				typescript: {
					extensions: [
						'.js',
						'.mjs',
						'.cjs',
						'.ts',
						'.mts',
						'.cts',
					],
					project: './tsconfig.json',
				},
			},
		},
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: false,
				},
				ecmaVersion: 2022,
				sourceType: 'module',
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			...importRules,
			...style.rules,
		},
	},
	{
		name: 'custom-ts',
		files: ['**/*.ts'],
		rules: {
			...tsRules,
			'typed/no-unsafe-assignment': 0,
		},
	},
	{
		name: 'custom-node',
		files: ['src/**/*.ts'],
		rules: {
			'no-console': 0,
			'no-nested-ternary': 0,
			'no-param-reassign': 0,
			'typed/no-use-before-define': 0,
			'import/no-extraneous-dependencies': 0,
		},
	},
];
