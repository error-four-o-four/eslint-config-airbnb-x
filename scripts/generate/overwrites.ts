import type { Linter } from 'eslint';

import type { RuleProps } from './replacements.ts';

import {
	assertNotNull,
	assertRuleLevel,
	assertRuleLevelAndOptions,
} from '../shared/utils/assert.ts';

import { sourceConfig } from './setup.ts';

const overwrites: Partial<
	Record<
		keyof typeof sourceConfig.rules,
		(props: RuleProps) => Linter.RuleEntry
	>
> = {
	'import/no-extraneous-dependencies': ({ value }) => {
		assertRuleLevelAndOptions(value);

		const [severity, dependencies] = value;

		return [
			severity,
			{
				devDependencies: [
					// eslint-disable-next-line typed/no-unsafe-member-access
					...dependencies.devDependencies,
					'**/eslint.config.js',
					'**/vite.config.js',
					'**/vite.config.*.js',
				],
				// eslint-disable-next-line typed/no-unsafe-member-access
				optionalDependencies: dependencies.optionalDependencies,
			},
		];
	},

	// enforce line breaks after opening and before closing array brackets
	// https://eslint.org/docs/rules/array-bracket-newline
	// TODO: enable? semver-major
	// 'array-bracket-newline': ['off', 'consistent'],; // object option alternative: { multiline: true, minItems: 3 }
	// https://eslint.style/rules/js/array-bracket-newline
	'array-bracket-newline': () => ['error', 'consistent'],

	// enforce line breaks between array elements
	// https://eslint.org/docs/rules/array-element-newline
	// TODO: enable? semver-major
	// 'array-element-newline': ['off', { multiline: true, minItems: 3 }],
	// https://eslint.style/rules/js/array-element-newline
	'array-element-newline': ({ value }) => {
		assertRuleLevelAndOptions(value);

		const options = value[1];

		return ['error', options];
	},

	'comma-dangle': () => ['error', 'always-multiline'],

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
	'max-len': ({ value }) => {
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
	'padding-line-between-statements': () => [
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

const overwrittenMap = new Set(Object.keys(overwrites));

export function requiresOverwrite(item: RuleProps) {
	return overwrittenMap.has(item.rule);
}

export function getOverwrite(item: RuleProps) {
	const fn = overwrites[item.rule];

	assertNotNull(fn);

	return fn(item);
}

// function assertRequiresOverwrite(
// 	rule: string,
// ): asserts rule is keyof typeof overwrites {
// 	if (overwritten.has(rule)) return;

// 	throw new Error(`Expected overwrite for '${rule}' to be required`);
// }

// export const overwrite = {
// 	isRequired(rule: string) {
// 		return overwrittenMap.has(rule);
// 	},
// 	get(
// 		rule: string,
// 		value: RuleProps['value'],
// 		meta: MetaDataProps,
// 		plugin?: MetaDataPluginProps,
// 	): Linter.RuleEntry {
// 		const isEslintRule = verify.isESLintRule(rule);
// 		const isPluginRule = verify.isPluginRule(rule);

// 		if (!isEslintRule && !isPluginRule) {
// 			throw new Error(`Expected valid rule - '${rule}' is invalid`);
// 		}

// 		const fn = overwrites[rule];

// 		if (!fn) {
// 			throw new Error(`Expected overwrite for '${rule}' to be defined`);
// 		}

// 		const result = fn({
// 			value,
// 			meta,
// 			plugin,
// 		});

// 		console.log(`Overwritten '${rule}' in '${meta.source}'`);

// 		return result;
// 	},
// };

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
