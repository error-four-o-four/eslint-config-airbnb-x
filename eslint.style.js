import stylistic from '@stylistic/eslint-plugin';
import tslint from 'typescript-eslint';

import { fixupPluginRules } from '@eslint/compat';

const legacyStylistic = stylistic.configs['disable-legacy'].rules;

const legacyRules = Object.keys(legacyStylistic)
	.filter((key) => !key.includes('/'))
	.sort()
	.reduce((all, key) => ({
		...all,
		[key]: legacyStylistic[key],
	}), {});

/** @type {import('eslint').Linter.FlatConfig} */
export default {
	files: ['**/*.js', '**/*.ts'],
	plugins: {
		style: fixupPluginRules(stylistic),
	},
	languageOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		parser: tslint.parser,
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
		...legacyRules,
		'no-restricted-syntax': [
			'error',
			{
				selector: 'ForInStatement',
				message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
			},
			{
				selector: 'ForOfStatement',
				message: 'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
			},
			{
				selector: 'LabeledStatement',
				message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
			},
			{
				selector: 'WithStatement',
				message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
			},
		],
		'no-ternary': 'off',
		'no-underscore-dangle': [
			'error',
			{
				allow: [],
				allowAfterThis: false,
				allowAfterSuper: false,
				enforceInMethodNames: true,
			},
		],
		'no-unneeded-ternary': [
			'error',
			{
				defaultAssignment: false,
			},
		],
		'one-var': ['error', 'never'],
		'operator-assignment': ['error', 'always'],
		'prefer-exponentiation-operator': 'error',
		'prefer-object-spread': 'error',
		'sort-keys': [
			'off',
			'asc',
			{
				caseSensitive: false,
				natural: true,
			},
		],
		'sort-vars': 'off',
		'style/array-bracket-newline': [
			'error',
			{
				multiline: true,
				minItems: 3,
			},
		],
		'style/array-bracket-spacing': ['error', 'never'],
		'style/array-element-newline': [
			'error',
			{
				multiline: true,
				minItems: 3,
			},
		],
		'style/arrow-parens': ['error', 'always'],
		'style/arrow-spacing': [
			'error',
			{
				before: true,
				after: true,
			},
		],
		'style/block-spacing': ['error', 'always'],
		'style/brace-style': [
			'error',
			'1tbs',
			{
				allowSingleLine: true,
			},
		],
		'style/comma-dangle': ['error', 'always-multiline'],
		'style/comma-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'style/comma-style': [
			'error',
			'last',
			{
				exceptions: {
					ArrayExpression: false,
					ArrayPattern: false,
					ArrowFunctionExpression: false,
					CallExpression: false,
					FunctionDeclaration: false,
					FunctionExpression: false,
					ImportDeclaration: false,
					ObjectExpression: false,
					ObjectPattern: false,
					VariableDeclaration: false,
					NewExpression: false,
				},
			},
		],
		'style/dot-location': ['error', 'property'],
		'style/eol-last': ['error', 'always'],
		'style/function-call-argument-newline': ['error', 'consistent'],
		'style/function-call-spacing': ['error', 'never'],
		'style/function-paren-newline': ['error', 'multiline-arguments'],
		'style/implicit-arrow-linebreak': ['error', 'beside'],
		'style/indent': ['error', 'tab'],
		'style/key-spacing': [
			'error',
			{
				beforeColon: false,
				afterColon: true,
			},
		],
		'style/keyword-spacing': [
			'error',
			{
				before: true,
				after: true,
				overrides: {
					return: {
						after: true,
					},
					throw: {
						after: true,
					},
					case: {
						after: true,
					},
				},
			},
		],
		'style/linebreak-style': ['error', 'windows'],
		'style/lines-between-class-members': [
			'error',
			'always',
			{
				exceptAfterSingleLine: false,
			},
		],
		'style/max-len': [
			'error',
			{
				code: 100,
				tabWidth: 2,
				ignoreUrls: true,
				ignoreComments: true,
				ignoreRegExpLiterals: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
			},
		],
		'style/new-parens': 'error',
		'style/newline-per-chained-call': [
			'error',
			{
				ignoreChainWithDepth: 4,
			},
		],
		'style/no-confusing-arrow': [
			'error',
			{
				allowParens: true,
			},
		],
		'style/no-extra-semi': 'error',
		'style/no-floating-decimal': 'error',
		'style/no-mixed-spaces-and-tabs': 'error',
		'style/no-multi-spaces': [
			'error',
			{
				ignoreEOLComments: false,
			},
		],
		'style/no-multiple-empty-lines': [
			'error',
			{
				max: 1,
				maxBOF: 0,
				maxEOF: 0,
			},
		],
		'style/no-tabs': 0,
		'style/no-trailing-spaces': [
			'error',
			{
				skipBlankLines: false,
				ignoreComments: false,
			},
		],
		'style/no-whitespace-before-property': 'error',
		'style/nonblock-statement-body-position': [
			'error',
			'beside',
			{
				overrides: {
				},
			},
		],
		'style/object-curly-newline': [
			'error',
			{
				ObjectExpression: {
					minProperties: 3,
					multiline: true,
					consistent: true,
				},
				ObjectPattern: {
					minProperties: 3,
					multiline: true,
					consistent: true,
				},
				ImportDeclaration: {
					minProperties: 3,
					multiline: true,
					consistent: true,
				},
				ExportDeclaration: {
					minProperties: 3,
					multiline: true,
					consistent: true,
				},
			},
		],
		'style/object-curly-spacing': ['error', 'always'],
		'style/object-property-newline': [
			'error',
			{
				allowAllPropertiesOnSameLine: true,
			},
		],
		'style/one-var-declaration-per-line': ['error', 'always'],
		'style/operator-linebreak': [
			'error',
			'before',
			{
				overrides: {
					'=': 'none',
				},
			},
		],
		'style/padded-blocks': [
			'error',
			{
				blocks: 'never',
				classes: 'never',
				switches: 'never',
			},
			{
				allowSingleLineBlocks: true,
			},
		],
		'style/padding-line-between-statements': 'off',
		'style/quote-props': [
			'error',
			'as-needed',
			{
				keywords: false,
				unnecessary: true,
				numbers: false,
			},
		],
		'style/quotes': [
			'error',
			'single',
			{
				avoidEscape: true,
			},
		],
		'style/rest-spread-spacing': ['error', 'never'],
		'style/semi': ['error', 'always'],
		'style/semi-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'style/semi-style': ['error', 'last'],
		'style/space-before-blocks': 'error',
		'style/space-before-function-paren': [
			'error',
			{
				anonymous: 'always',
				named: 'never',
				asyncArrow: 'always',
			},
		],
		'style/space-in-parens': ['error', 'never'],
		'style/switch-colon-spacing': [
			'error',
			{
				after: true,
				before: false,
			},
		],
		'style/template-curly-spacing': 'error',
		'style/template-tag-spacing': ['error', 'never'],
	},
};
