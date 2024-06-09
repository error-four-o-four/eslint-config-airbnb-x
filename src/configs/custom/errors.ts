/** @file GENERATED WITH SCRIPT */
import type { FlatConfig } from '../../globalTypes.ts';

export default {
	name: 'airbnb:errors',
	rules: {
		'for-direction': 'error',
		'getter-return': [
			'error',
			{
				allowImplicit: true,
			},
		],
		'no-async-promise-executor': 'error',
		'no-await-in-loop': 'error',
		'no-compare-neg-zero': 'error',
		'no-cond-assign': ['error', 'always'],
		'no-console': 'warn',
		'no-constant-condition': 'warn',
		'no-control-regex': 'error',
		'no-debugger': 'error',
		'no-dupe-args': 'error',
		'no-dupe-else-if': 'error',
		'no-dupe-keys': 'error',
		'no-duplicate-case': 'error',
		'no-empty': 'error',
		'no-empty-character-class': 'error',
		'no-ex-assign': 'error',
		'no-extra-boolean-cast': 'error',
		'no-func-assign': 'error',
		'no-import-assign': 'error',
		'no-inner-declarations': 'error',
		'no-invalid-regexp': 'error',
		'no-irregular-whitespace': 'error',
		'no-loss-of-precision': 'error',
		'no-misleading-character-class': 'error',
		'no-obj-calls': 'error',
		'no-promise-executor-return': 'error',
		'no-prototype-builtins': 'error',
		'no-regex-spaces': 'error',
		'no-setter-return': 'error',
		'no-sparse-arrays': 'error',
		'no-template-curly-in-string': 'error',
		'no-unexpected-multiline': 'error',
		'no-unreachable': 'error',
		'no-unreachable-loop': [
			'error',
			{
				ignore: [],
			},
		],
		'no-unsafe-finally': 'error',
		'no-unsafe-negation': 'error',
		'no-unsafe-optional-chaining': [
			'error',
			{
				disallowArithmeticOperators: true,
			},
		],
		'no-unused-private-class-members': 'off',
		'no-useless-backreference': 'error',
		'require-atomic-updates': 'off',
		'use-isnan': 'error',
		'valid-typeof': [
			'error',
			{
				requireStringLiterals: true,
			},
		],
	},
} satisfies FlatConfig;
