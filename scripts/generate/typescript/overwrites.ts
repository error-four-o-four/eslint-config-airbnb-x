import type { Linter } from 'eslint';
import type { Entries } from 'type-fest';

import type { RuleProps } from '../types.ts';

import {
	assertNotNull,
	assertRuleLevelAndOptions,
} from '../../shared/utils/assert.ts';

const overwrites: Partial<
	Record<
		RuleProps['rule'],
		(value: Linter.RuleEntry) => Linter.RuleEntry
	>
> = {
	'import/no-extraneous-dependencies': (value) => {
		const regex = /\bjs(x?)\b/g;

		assertNotNull(value);
		assertRuleLevelAndOptions(value);
		const [severity, options] = value;

		let { devDependencies } = <{ devDependencies: string[], }>options;

		devDependencies = [
			...devDependencies,
			...devDependencies
				.filter((dep) => dep.includes('js') && !dep.includes('eslintrc'))
				.map((dep) => dep.replace(regex, 'ts$1')),
		];

		return [
			severity,
			{
				...options,
				devDependencies,
			},
		];
	},

	'import/extensions': (value) => {
		assertRuleLevelAndOptions(value);

		const [
			severity,
			level,
			options,
		] = value;

		return [
			severity,
			level,
			{
				...options,
				ts: 'never',
				tsx: 'never',
			},
		];
	},
};

const overwritten = new Set(Object.keys(overwrites));

function assertRequiresOverwrite(
	rule: string,
): asserts rule is keyof typeof overwrites {
	if (overwritten.has(rule)) return;

	throw new Error(`Expected overwrite for '${rule}' to be required`);
}

export const overwrite = {
	isRequired(rule: string) {
		return overwritten.has(rule);
	},
	get(
		rule: string,
		value: Linter.RuleEntry,
	): Linter.RuleEntry {
		/** @todo */
		assertRequiresOverwrite(rule);

		const fn = overwrites[rule];

		assertNotNull(fn, `Expected overwrite for '${rule}' to be defined`);

		const result = fn(value);

		console.log(`Overwritten '${rule}' in 'typescript' config`);

		return result;
	},
} as const;

export const disabledRules: RuleProps['rule'][] = [
	'camelcase',

	// 'no-new-func' is handled by '@typescript-eslint/no-implied-eval'
	// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
	'no-new-func',

	// The following rules are enabled in Airbnb config, but are already checked (more thoroughly) by the TypeScript compiler
	// Some of the rules also fail in TypeScript files, for example: https://github.com/typescript-eslint/typescript-eslint/issues/662#issuecomment-507081586
	// Rules are inspired by: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts
	// Issue closed by https://github.com/typescript-eslint/typescript-eslint/issues/1856

	'constructor-super',
	'getter-return',
	'no-const-assign',
	'no-dupe-args',
	'no-dupe-keys',
	'no-func-assign',
	'no-import-assign',
	'no-new-symbol',
	'no-obj-calls',
	'no-setter-return',
	'no-this-before-super',
	'no-undef',
	'no-unreachable',
	'no-unsafe-negation',
	'valid-typeof',

	// The following rules are enabled in Airbnb config, but are recommended to be disabled within TypeScript projects
	// See: https://github.com/typescript-eslint/typescript-eslint/blob/13583e65f5973da2a7ae8384493c5e00014db51b/docs/linting/TROUBLESHOOTING.md#eslint-plugin-import
	'import/default',
	'import/named',
	'import/namespace',
	'import/no-named-as-default-member',
	'import/no-namespace',
	'import/no-unresolved',
];

// #####

const addedRulesRecord: Partial<
	Record<
		RuleProps['rule'],
		Linter.RuleEntry
	>
> = {
	'type/naming-convention': [
		'error',
		// Allow camelCase variables (23.2), PascalCase variables (23.8), and UPPER_CASE variables (23.10)
		{
			selector: 'variable',
			format: [
				'camelCase',
				'PascalCase',
				'UPPER_CASE',
			],
		},
		// Allow camelCase functions (23.2), and PascalCase functions (23.8)
		{
			selector: 'function',
			format: ['camelCase', 'PascalCase'],
		},
		// Airbnb recommends PascalCase for classes (23.3), and although Airbnb does not make TypeScript recommendations, we are assuming this rule would similarly apply to anything "type like", including interfaces, type aliases, and enums
		{
			selector: 'typeLike',
			format: ['PascalCase'],
		},
	],
};

export const addedRules = Object.entries(
	addedRulesRecord,
) as Entries<typeof addedRulesRecord>;

// #####

const replacements: Partial<
	Record<
		RuleProps['rule'],
		(value: Linter.RuleEntry) => RuleProps
	>
> = {
	// https://github.com/iamturns/eslint-config-airbnb-typescript/blob/766a2b975055bd827b72cbb538643e9103c1bdd4/lib/shared.js#L64
	// 'comma-dangle': (value) => {
	// 	assertNotNull(value);
	// 	assertRuleLevelAndOptions(value);

	// 	const [severity, options] = value;
	// 	const property = options.arrays;

	// 	return {
	// 		key: 'typescript',
	// 		rule: 'style/comma-dangle',
	// 		value: [
	// 			severity,
	// 			{
	// 				...options,
	// 				enum: property,
	// 				generics: property,
	// 				tuples: property,
	// 			},
	// 		],
	// 	};
	// },
};

const replaced = new Set(Object.keys(replacements));

export const replacement = {
	isRequired(rule: string) {
		return replaced.has(rule);
	},
	get(
		rule: string,
		value: Linter.RuleEntry,
	): RuleProps {
		/** @todo */
		const fn = replacements[rule as keyof typeof replacements];

		assertNotNull(fn);

		const result = fn(value);

		console.log(`Replaced '${rule}' by '${result.rule}' in '${result.key}'`);

		return result;
	},
} as const;
