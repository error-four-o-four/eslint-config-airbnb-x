import type { Linter } from 'eslint';

import type {
	MetaDataProps,
	MetaDataPluginProps,
} from '../shared/types.ts';

import type {
	RuleProps,
	OverwriteOptions,
} from './types.ts';

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
	/**
	 * @todo
	 * rule exists in import and typescript plugin
	 */
	// 'import/no-namespace': () => {
	// 	return 0
	// },

	/**
	 * @todo special case 'import/named'
	 * should be disabled for typescript files
	 */
	// 'import/named': (value, meta) => {
	// 	assertNotNull(value, '\'RuleEntry\' are required');
	// 	assertNotNull(meta, '\'MetaData\' is required');

	// 	if (Array.isArray(value)) {
	// 		throw new Error('Expected \'RuleLevel\' param');
	// 	}

	// 	if (assertMetaDataProps(meta)) {
	// 		throw new Error('Expected \'MetaDataPluginProps\' param');
	// 	}

	// 	if (meta.prefix === 'type') {
	// 		return 0;
	// 	}

	// 	return value;
	// },
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
			options
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

function assertRuleLevel(
	value: Linter.RuleEntry,
): asserts value is Linter.RuleLevel {
	if (Array.isArray(value)) {
		throw new Error('Expected \'RuleLevelAndOptions\' Array');
	}
}

function assertRuleLevelAndOptions(
	value: Linter.RuleEntry,
): asserts value is Linter.RuleLevelAndOptions {
	if (!Array.isArray(value)) {
		throw new Error('Expected \'RuleLevelAndOptions\' Array');
	}
}

const keys = Object.keys(overwrites);
//  as (RuleProps['rule'])[];

export function requiresOverwrite(rule: string) {
	return keys.includes(rule as RuleProps['rule']);
}

export function getOverwrite(
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
}
