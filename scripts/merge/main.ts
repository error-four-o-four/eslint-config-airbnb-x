import type { Linter } from 'eslint';

import { merge } from 'ts-deepmerge';

import type { CustomConfigs } from '../generate/types.ts';
import type { MergedConfigs } from './types.ts';

/** @note created with 'node:generate' */
import customConfigs from '../../src/configs/custom/index.ts';

import { assertNotNull } from '../shared/utils/assert.ts';

import { customConfigKeys } from '../generate/setup.ts';
import { mergedConfigKeys, tsOnlyRules } from './setup.ts';

export function createMergedConfigs() {
	return mergedConfigKeys.reduce(
		(all, key) => {
			const tmp: Linter.FlatConfig = {};

			if (key === 'baseJs' || key === 'baseTs') {
				tmp.languageOptions = {};
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
	assertNotNull(customConfigs.node.languageOptions);
	assertNotNull(customConfigs.typescript.languageOptions);

	const { globals } = customConfigs.node.languageOptions;
	assertNotNull(globals);

	targetConfigs.base.languageOptions = {
		globals,
	};

	targetConfigs.baseJs.languageOptions = (
		Object.keys(customConfigs) as (keyof CustomConfigs)[]
	)
		/** @todo */
		// .filter((key) => key !== 'node' && key !== 'typescript')
		.filter((key) => key !== 'typescript')
		.reduce((result, key) => {
			const config = customConfigs[key];

			if (!config.languageOptions) return result;

			return merge(result, config.languageOptions);
		}, {});

	delete targetConfigs.baseJs.languageOptions.globals;

	targetConfigs.baseTs.languageOptions = merge(
		targetConfigs.baseJs.languageOptions,
		customConfigs.typescript.languageOptions,
	);
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
	assertNotNull(customConfigs.typescript.rules);

	const tsRules = new Set(Object.keys(customConfigs.typescript.rules));

	customConfigKeys.forEach((key) => {
		const config = customConfigs[key];
		assertNotNull(config.rules);

		Object.entries(config.rules)
			.forEach(([rule, value]) => {
				if (key !== 'typescript' && tsOnlyRules.has(rule)) {
					targetConfigs.baseJs.rules[rule] = value;
					return;
				}

				if (key === 'typescript' && tsOnlyRules.has(rule)) {
					targetConfigs.baseTsOnly.rules[rule] = value;
					return;
				}

				if (key === 'typescript') {
					targetConfigs.baseTs.rules[rule] = value;
					return;
				}

				if (tsRules.has(rule)) {
					targetConfigs.baseJs.rules[rule] = value;
					return;
				}

				targetConfigs.base.rules[rule] = value;
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
