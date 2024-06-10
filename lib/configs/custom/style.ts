/** @file GENERATED WITH SCRIPT */
import stylisticEslintPlugin from '@stylistic/eslint-plugin';
import type { FlatConfig, ESLintPlugin } from '../../../src/globalTypes.ts';

export default {
	name: 'airbnb:style',
	plugins: {
		style: stylisticEslintPlugin as unknown as ESLintPlugin,
	},
	rules: {
		camelcase: [
			'error',
			{
				properties: 'never',
				ignoreDestructuring: false,
			},
		],
		'capitalized-comments': [
			'off',
			'never',
			{
				line: {
					ignorePattern: '.*',
					ignoreInlineComments: true,
					ignoreConsecutiveComments: true,
				},
				block: {
					ignorePattern: '.*',
					ignoreInlineComments: true,
					ignoreConsecutiveComments: true,
				},
			},
		],
		'consistent-this': 'off',
		'func-name-matching': [
			'off',
			'always',
			{
				includeCommonJSModuleExports: false,
				considerPropertyDescriptor: true,
			},
		],
		'func-names': 'warn',
		'func-style': ['off', 'expression'],
		'id-denylist': 'off',
		'id-length': 'off',
		'id-match': 'off',
		'max-depth': ['off', 4],
		'max-lines': [
			'off',
			{
				max: 300,
				skipBlankLines: true,
				skipComments: true,
			},
		],
		'max-lines-per-function': [
			'off',
			{
				max: 50,
				skipBlankLines: true,
				skipComments: true,
				IIFEs: true,
			},
		],
		'max-nested-callbacks': 'off',
		'max-params': ['off', 3],
		'max-statements': ['off', 10],
		'new-cap': [
			'error',
			{
				newIsCap: true,
				newIsCapExceptions: [],
				capIsNew: false,
				capIsNewExceptions: [
					'Immutable.Map',
					'Immutable.Set',
					'Immutable.List',
				],
			},
		],
		'no-array-constructor': 'error',
		'no-bitwise': 'error',
		'no-continue': 'error',
		'no-inline-comments': 'off',
		'no-lonely-if': 'error',
		'no-multi-assign': ['error'],
		'no-negated-condition': 'off',
		'no-nested-ternary': 'error',
		'no-object-constructor': 'error',
		'no-plusplus': 'error',
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
		'unicode-bom': ['error', 'never'],
		'style/array-bracket-newline': ['error', 'consistent'],
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
		'style/computed-property-spacing': ['error', 'never'],
		'style/dot-location': ['error', 'property'],
		'style/eol-last': ['error', 'always'],
		'style/function-call-argument-newline': ['error', 'consistent'],
		'style/function-call-spacing': ['error', 'never'],
		'style/function-paren-newline': ['error', 'multiline-arguments'],
		'style/generator-star-spacing': [
			'error',
			{
				before: false,
				after: true,
			},
		],
		'style/implicit-arrow-linebreak': ['error', 'beside'],
		'style/indent': [
			'error',
			2,
			{
				SwitchCase: 1,
				VariableDeclarator: 1,
				outerIIFEBody: 1,
				FunctionDeclaration: {
					parameters: 1,
					body: 1,
				},
				FunctionExpression: {
					parameters: 1,
					body: 1,
				},
				CallExpression: {
					arguments: 1,
				},
				ArrayExpression: 1,
				ObjectExpression: 1,
				ImportDeclaration: 1,
				flatTernaryExpressions: false,
				ignoredNodes: [
					'JSXElement',
					'JSXElement > *',
					'JSXAttribute',
					'JSXIdentifier',
					'JSXNamespacedName',
					'JSXMemberExpression',
					'JSXSpreadAttribute',
					'JSXExpressionContainer',
					'JSXOpeningElement',
					'JSXClosingElement',
					'JSXFragment',
					'JSXOpeningFragment',
					'JSXClosingFragment',
					'JSXText',
					'JSXEmptyExpression',
					'JSXSpreadChild',
				],
				ignoreComments: false,
			},
		],
		'style/jsx-quotes': ['off', 'prefer-double'],
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
		'style/line-comment-position': [
			'off',
			{
				position: 'above',
				ignorePattern: '',
				applyDefaultPatterns: true,
			},
		],
		'style/linebreak-style': ['error', 'unix'],
		'style/lines-around-comment': 'off',
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
				ignoreComments: false,
				ignoreRegExpLiterals: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
			},
		],
		'style/max-statements-per-line': [
			'off',
			{
				max: 1,
			},
		],
		'style/multiline-comment-style': ['off', 'starred-block'],
		'style/multiline-ternary': ['off', 'never'],
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
		'style/no-extra-parens': [
			'off',
			'all',
			{
				conditionalAssign: true,
				nestedBinaryExpressions: false,
				returnAssign: false,
				ignoreJSX: 'all',
				enforceForArrowConditionals: false,
			},
		],
		'style/no-extra-semi': 'error',
		'style/no-floating-decimal': 'error',
		'style/no-mixed-operators': [
			'error',
			{
				groups: [
					['%', '**'],
					['%', '+'],
					['%', '-'],
					['%', '*'],
					['%', '/'],
					['/', '*'],
					[
						'&',
						'|',
						'<<',
						'>>',
						'>>>',
					],
					[
						'==',
						'!=',
						'===',
						'!==',
					],
					['&&', '||'],
				],
				allowSamePrecedence: false,
			},
		],
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
		'style/no-tabs': 'error',
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
				overrides: {},
			},
		],
		'style/object-curly-newline': [
			'error',
			{
				ObjectExpression: {
					minProperties: 4,
					multiline: true,
					consistent: true,
				},
				ObjectPattern: {
					minProperties: 4,
					multiline: true,
					consistent: true,
				},
				ImportDeclaration: {
					minProperties: 4,
					multiline: true,
					consistent: true,
				},
				ExportDeclaration: {
					minProperties: 4,
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
		'style/padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: '*',
				next: 'directive',
			},
			{
				blankLine: 'always',
				prev: 'directive',
				next: '*',
			},
		],
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
		'style/space-infix-ops': 'error',
		'style/space-unary-ops': [
			'error',
			{
				words: true,
				nonwords: false,
				overrides: {},
			},
		],
		'style/spaced-comment': [
			'error',
			'always',
			{
				line: {
					exceptions: ['-', '+'],
					markers: [
						'=',
						'!',
						'/',
					],
				},
				block: {
					exceptions: ['-', '+'],
					markers: [
						'=',
						'!',
						':',
						'::',
					],
					balanced: true,
				},
			},
		],
		'style/switch-colon-spacing': [
			'error',
			{
				after: true,
				before: false,
			},
		],
		'style/template-curly-spacing': ['error', 'never'],
		'style/template-tag-spacing': ['error', 'never'],
		'style/wrap-iife': [
			'error',
			'outside',
			{
				functionPrototypeMethods: false,
			},
		],
		'style/wrap-regex': 'off',
		'style/yield-star-spacing': ['error', 'after'],
	},
} satisfies FlatConfig;
