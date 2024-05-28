import type { Linter } from 'eslint';

import type {
	MetaDataProps,
	MetaDataPluginProps,
} from '../shared/types/main.ts';

import type {
	RuleProps,
	OverwriteOptions,
} from './types.ts';

import {
	assertRuleLevel,
	assertRuleLevelAndOptions,
} from '../shared/utils/assert.ts';

import { verify } from './utils.ts';

const overwrites: Partial<
	Record<
		RuleProps['rule'],
		({
			value,
			meta,
			plugin,
		}: OverwriteOptions) => Linter.RuleEntry
	>
> = {
	'import/no-extraneous-dependencies': ({ value }) => {
		assertRuleLevelAndOptions(value);

		const [severity, dependants] = value;

		return [
			severity,
			{
				devDependencies: [
					...dependants.devDependencies,
					'**/eslint.config.js',
					'**/vite.config.js',
					'**/vite.config.*.js',
				],
				optionalDependencies: dependants.optionalDependencies,
			},
		];
	},

	// enforce line breaks after opening and before closing array brackets
	// https://eslint.org/docs/rules/array-bracket-newline
	// TODO: enable? semver-major
	// 'array-bracket-newline': ['off', 'consistent'],; // object option alternative: { multiline: true, minItems: 3 }
	// https://eslint.style/rules/js/array-bracket-newline
	'style/array-bracket-newline': () => ['error', 'consistent'],

	// enforce line breaks between array elements
	// https://eslint.org/docs/rules/array-element-newline
	// TODO: enable? semver-major
	// 'array-element-newline': ['off', { multiline: true, minItems: 3 }],
	// https://eslint.style/rules/js/array-element-newline
	'style/array-element-newline': ({ value }) => {
		assertRuleLevelAndOptions(value);

		const options = value[1];

		return ['error', options];
	},

	'style/comma-dangle': () => ['error', 'always-multiline'],

	// specify the maximum length of a line in your program
	// https://eslint.org/docs/rules/max-len
	// 'max-len': ['error', 100, 2, {
	// 	ignoreUrls: true,
	// 	ignoreComments: false,
	// 	ignoreRegExpLiterals: true,
	// 	ignoreStrings: true,
	// 	ignoreTemplateLiterals: true,
	// }],
	// https://eslint.style/rules/js/max-len
	'style/max-len': ({ value }) => {
		assertRuleLevelAndOptions(value);

		const [
			severity,
			code,
			tabWidth,
			options,
		] = value;

		return [
			severity,
			{
				code,
				tabWidth,
				...options,
			},
		];
	},

	// Require or disallow padding lines between statements
	// https://eslint.org/docs/rules/padding-line-between-statements
	// 'padding-line-between-statements': 'off',
	// https://eslint.style/rules/ts/padding-line-between-statements
	'style/padding-line-between-statements': () => [
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

	// https://eslint.org/docs/latest/rules/no-template-curly-in-string
	'template-curly-spacing': ({ value }) => {
		assertRuleLevel(value);

		return [value, 'never'];
	},
};

const overwritten = new Set(Object.keys(overwrites));

// function assertRequiresOverwrite(
// 	rule: string,
// ): asserts rule is keyof typeof overwrites {
// 	if (overwritten.has(rule)) return;

// 	throw new Error(`Expected overwrite for '${rule}' to be required`);
// }

// eslint-disable-next-line import/prefer-default-export
export const overwrite = {
	isRequired(rule: string) {
		return overwritten.has(rule);
	},
	get(
		rule: string,
		value: RuleProps['value'],
		meta: MetaDataProps,
		plugin?: MetaDataPluginProps,
	): Linter.RuleEntry {
		const isEslintRule = verify.isESLintRule(rule);
		const isPluginRule = verify.isPluginRule(rule);

		if (!isEslintRule && !isPluginRule) {
			throw new Error(`Expected valid rule - '${rule}' is invalid`);
		}

		const fn = overwrites[rule];

		if (!fn) {
			throw new Error(`Expected overwrite for '${rule}' to be defined`);
		}

		const result = fn({
			value,
			meta,
			plugin,
		});

		console.log(`Overwritten '${rule}' in '${meta.source}'`);

		return result;
	},
};

// export function requiresOverwrite(rule: string) {
// 	return overwritten.has(rule as RuleProps['rule']);
// }

// export function getOverwrite(
// 	rule: string,
// 	value: RuleProps['value'],
// 	meta: MetaDataProps,
// 	plugin?: MetaDataPluginProps,
// ): Linter.RuleEntry {
// 	const isEslintRule = verify.isESLintRule(rule);
// 	const isPluginRule = verify.isPluginRule(rule);

// 	if (!isEslintRule && !isPluginRule) {
// 		throw new Error(`Expected valid rule - '${rule}' is invalid`);
// 	}

// 	const fn = overwrites[rule];

// 	if (!fn) {
// 		throw new Error(`Expected overwrite for '${rule}' to be defined`);
// 	}

// 	const result = fn({
// 		value,
// 		meta,
// 		plugin,
// 	});

// 	console.log(`Overwritten '${rule}' in '${meta.source}'`);

// 	return result;
// }
