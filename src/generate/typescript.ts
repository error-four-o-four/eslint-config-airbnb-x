import type { Linter } from 'eslint';

import { GLOBS_TS, pluginPrefix } from '../globalSetup.ts';
import type { FlatConfig, PluginPrefix } from '../globalTypes.ts';

import {
	assertNotNull,
	assertIsRecord,
	assertRuleLevelAndOptions,
} from '../utils/assert.ts';

import { isPrefixedRule, getPrefixedRule } from '../utils/helpers.ts';

import rawMetaData from './metadata.ts';

import type { AirbnbRule } from './types.ts';

import { getTypescriptSettings } from './settings.ts';
import { getTypescriptOptions } from './options.ts';

export const disabledRulesArray: AirbnbRule[] = [
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

const overwrites: Partial<
	Record<
		AirbnbRule,
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

// #####

const addedRules: Partial<
	Record<
		`${PluginPrefix['type']}/${string}`,
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

export function generateTypescriptConfig(source: FlatConfig): FlatConfig {
	assertIsRecord(source.rules);
	const sourceRules = source.rules;

	const typescriptRules = Object.keys(source.rules).filter((rule) => {
		if (isPrefixedRule(rule)) {
			return false;
		}

		return rawMetaData.type.has(rule);
	});

	const disabledRules: FlatConfig['rules'] = disabledRulesArray
		.reduce((all, rule) => ({
			...all,
			[rule]: 0,
		}), {});

	const overwrittenRules: FlatConfig['rules'] = typescriptRules
		.reduce((all, rule) => ({
			...all,
			[rule]: 0,
		}), {});

	Object.keys(overwrites).forEach((rule) => {
		const value = sourceRules[rule];
		const overwrite = overwrites[rule as AirbnbRule];
		assertNotNull(value);
		assertNotNull(overwrite);
		overwrittenRules[rule] = overwrite(value);
	});

	const enabledRules = typescriptRules.reduce((all, rule) => {
		const key = getPrefixedRule(pluginPrefix.type, rule);
		const value = sourceRules[rule];
		return {
			...all,
			[key]: value,
		};
	}, {});

	assertIsRecord(source.languageOptions);
	assertIsRecord(source.settings);

	return {
		files: GLOBS_TS,
		rules: {
			...sourceRules,
			...disabledRules,
			...overwrittenRules,
			...enabledRules,
			...addedRules,
		},
		languageOptions: getTypescriptOptions(source.languageOptions),
		settings: getTypescriptSettings(source.settings),
	};
}
