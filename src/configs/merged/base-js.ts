// FILE GENERATED WITH SCRIPT
import type { FlatConfig } from '../../../scripts/types/configs.ts';

export default {
	rules: {
		'block-spacing': 0,
		'brace-style': 0,
		'class-methods-use-this': [
			'error', { exceptMethods: [] },
		],
		'comma-dangle': 0,
		'comma-spacing': 0,
		'default-param-last': 'error',
		'dot-notation': [
			'error', { allowKeywords: true },
		],
		'func-call-spacing': 0,
		indent: 0,
		'init-declarations': 'off',
		'key-spacing': 0,
		'keyword-spacing': 0,
		'lines-around-comment': 0,
		'lines-between-class-members': 0,
		'max-params': [
			'off', 3,
		],
		'no-array-constructor': 'error',
		'no-empty-function': [
			'error', {
				allow: [
					'arrowFunctions',
					'functions',
					'methods',
				],
			},
		],
		'no-extra-parens': 0,
		'no-extra-semi': 0,
		'no-implied-eval': 'error',
		'no-invalid-this': 'off',
		'no-loop-func': 'error',
		'no-loss-of-precision': 'error',
		'no-magic-numbers': [
			'off', {
				ignore: [],
				ignoreArrayIndexes: true,
				enforceConst: true,
				detectObjects: false,
			},
		],
		'no-redeclare': 'error',
		'no-shadow': 'error',
		'no-throw-literal': 'error',
		'no-unused-expressions': [
			'error', {
				allowShortCircuit: false,
				allowTernary: false,
				allowTaggedTemplates: false,
			},
		],
		'no-unused-vars': [
			'error', {
				vars: 'all',
				args: 'after-used',
				ignoreRestSiblings: true,
			},
		],
		'no-use-before-define': [
			'error', {
				functions: true,
				classes: true,
				variables: true,
			},
		],
		'object-curly-spacing': 0,
		'padding-line-between-statements': 0,
		quotes: 0,
		'require-await': 'off',
		semi: 0,
		'space-before-blocks': 0,
		'space-before-function-paren': 0,
		'space-infix-ops': 0,
	},
} as FlatConfig;
