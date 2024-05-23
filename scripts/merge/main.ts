import type { Linter } from 'eslint';

import { merge } from 'ts-deepmerge';

import type { CustomConfigs } from '../generate/types.ts';
import type { MergedConfigs } from './types.ts';

/** @note created with 'node:generate' */
import customConfigs from '../../src/configs/custom/index.ts';

import { toKebabCase } from '../shared/utils/main.ts';
import { assertNotNull } from '../shared/utils/assert.ts';

import { customConfigKeys } from '../generate/setup.ts';
import { mergedConfigKeys } from './setup.ts';
import {
	GLOBS_JS, GLOBS_MIXED, GLOBS_TS,
} from '../setupGlobal.ts';

export function createMergedConfigs() {
	return mergedConfigKeys.reduce(
		(all, key) => {
			const tmp: Linter.FlatConfig = {};

			tmp.name = `airbnb:${toKebabCase(key)}`;

			tmp.files = key === 'baseMixed'
				? GLOBS_MIXED : key === 'baseJs'
					? GLOBS_JS : GLOBS_TS;

			if (key === 'baseMixed' || key === 'baseTs') {
				tmp.languageOptions = {};
			}

			if (key === 'baseJs' || key === 'baseTs') {
				tmp.settings = {};
			}

			tmp.rules = {};

			return {
				...all,
				[key]: tmp,
			};
		},
		{} as MergedConfigs,
	);
}

export function mergeLanguageOptions(
	targetConfigs: MergedConfigs,
) {
	targetConfigs.baseMixed.languageOptions = (
		Object.keys(customConfigs) as (keyof CustomConfigs)[]
	)
		// .filter((key) => key !== 'node' && key !== 'typescript')
		.filter((key) => key !== 'typescript')
		.reduce((result, key) => {
			const config = customConfigs[key];

			if (!config.languageOptions) return result;

			return merge(result, config.languageOptions);
		}, {});

	targetConfigs.baseTs.languageOptions = {
		...customConfigs.typescript.languageOptions,
	};
}

export function mergeSettings(
	targetConfigs: MergedConfigs,
) {
	assertNotNull(customConfigs.imports.settings);
	assertNotNull(customConfigs.typescript.settings);

	targetConfigs.baseJs.settings = {
		...customConfigs.imports.settings,
	};

	targetConfigs.baseTs.settings = {
		...customConfigs.typescript.settings,
	};
}

export function mergeRules(
	targetConfigs: MergedConfigs,
) {
	const tsRules = customConfigs.typescript.rules;
	assertNotNull(tsRules);

	customConfigKeys.forEach((key) => {
		const config = customConfigs[key];
		assertNotNull(config.rules);

		Object.entries(config.rules)
			.forEach(([rule, value]) => {
				if (key === 'typescript') {
					targetConfigs.baseTs.rules[rule] = value;
					return;
				}

				if (rule in tsRules) {
					targetConfigs.baseJs.rules[rule] = value;
					return;
				}

				/**
				 * @todo
				 * handle exceptions
				 * especially 'import' config rules overwrite for ts files
				 */

				// import/extensions
				// import/no-extraneous-dependencies
				// import/named: 'error'
				// ...

				targetConfigs.baseMixed.rules[rule] = value;
			});
	});
}

export function sortRules(
	targetConfigs: MergedConfigs,
) {
	(Object.keys(targetConfigs) as (keyof MergedConfigs)[])
		.forEach((key) => {
			const config = targetConfigs[key];
			assertNotNull(config.rules);

			const unprefixed = Object.keys(config.rules).filter((rule) => !rule.includes('/'));
			const prefixed = Object.keys(config.rules).filter((rule) => rule.includes('/'));
			const sorted = [...unprefixed.sort(), ...prefixed.sort()];

			config.rules = sorted.reduce((all, rule) => ({
				...all,
				[rule]: config.rules[rule],
			}), {});
		});
}
