import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

// @ts-expect-error missing types
import airbnb from 'eslint-config-airbnb-base';

import type {
	BaseConfig,
	BaseConfigEntry,
	FlatConfig,
	AirbnbConfigs,
	CustomConfigs,
	AirbnbConfigKeys,
	CustomConfigKeys,
} from '../types/configs.ts';

import type {
	ApprovedMeta, DeprecatedMeta, ProcessedRule,
} from '../types/rules.ts';

import {
	airbnbConfigKeyValues,
	customConfigKeyValues,
} from './constants.ts';

import { getLanguageOptions, getSettings } from './options.ts';

import {
	getRules,
	getApprovedRules,
	getLegacyRules,
	getPluginRules,
	copyPluginRules,
	// copyRules,
	// copyLegacyRules,
	// copyTypescriptRules,
	copyRulesBy,
	isTypescriptRule,
} from './rules.ts';

import { configHasPlugin } from './plugins.ts';
import { pluginPrefix } from '../../src/plugins.ts';

export async function importBaseConfigs(): Promise<BaseConfigEntry[]> {
	const promiseBaseConfig = (item: string): Promise<BaseConfigEntry> => {
		const name = path.basename(item, '.js');
		const file = pathToFileURL(item).href;

		return new Promise((resolve) => {
			import(file).then((module) => {
				const entry = [name, module.default] as BaseConfigEntry;
				resolve(entry);
			});
		});
	};

	return Promise.all(airbnb.extends.map(promiseBaseConfig));
}

export function processEntries(baseEntries: BaseConfigEntry[]) {
	const convertedEntries = getConverted(baseEntries);

	// extract, classify and sort all rules from eslint-config-airbnb-base
	// type ProcessedRule<ApprovedMeta | DeprecatedMeta>
	const processedRules = getRules(convertedEntries);

	// create FlatConfigItems with filtered and updated rules
	const processedEntries = getProcessed(convertedEntries, processedRules);

	return {
		convertedEntries,
		processedEntries,
	};
}

function getConverted(entries: BaseConfigEntry[]): AirbnbConfigs {
	const filename = fileURLToPath(import.meta.url);
	const root = path.dirname(path.resolve(filename, '../..')); // @todo use process.cwd()

	const compat = new FlatCompat({ baseDirectory: root });

	const convertBase2Flat = (
		base: BaseConfig,
	): FlatConfig => compat
		.config(base)
		.reduce(
			(all, data) => {
				// remove plugins. they're attached later
				if (data.plugins) delete data.plugins;
				return Object.assign(all, data);
			},
			{},
		);

	return Object.fromEntries(
		entries.map(([name, base]) => [name, convertBase2Flat(base)]),
	) as AirbnbConfigs;
}

function getProcessed(
	source: AirbnbConfigs,
	rules: ProcessedRule[],
): CustomConfigs {
	const approvedRules = getApprovedRules(rules);
	const pluginRules = getPluginRules(rules);
	const deprecatedRules = getLegacyRules(rules);
	// @todo filter replacedBy rules

	// use a temporary object
	// to convert es6 to es2022
	const temp = customConfigKeyValues.reduce(
		(all, name) => Object.assign(all, { [name]: {} }),
		{} as TempConfigs,
	);

	type TempConfigs = Omit<CustomConfigs, 'es2022'> & { es6: FlatConfig; };

	Object.keys(temp).forEach((name) => {
		if (isAirbnb(name)) {
			// es6/es2022, node, imports have languageOptions
			if ((name === 'es6' || name === 'node' || name === 'imports')
				&& typeof getLanguageOptions[name] === 'function') {
				temp[name].languageOptions = getLanguageOptions[name]();
			}

			// generate imports settings
			if (name === 'imports'
				&& source[name].settings
				&& typeof getSettings[name] === 'function') {
				temp[name].settings = getSettings[name](source[name]);
			}

			// just copy the rules
			if (!configHasPlugin(name)) {
				const filter: (
					(rule: ProcessedRule<ApprovedMeta>) => boolean
				) = (rule) => rule.meta.config === name;

				temp[name].rules = copyRulesBy(approvedRules, filter);
			}

			// add plugin scope
			// overwrite imports rules
			if (configHasPlugin(name)) {
				temp[name].rules = copyPluginRules(name, pluginRules);
			}
		}

		if (isCustom(name)) {
			// turn off all deprecated rules and
			// rules which are replaced by node or stylistic
			if (name === 'disable-legacy') {
				const filter: (
					(rule: ProcessedRule<DeprecatedMeta>) => boolean
				) = (rule) => rule.meta.plugin !== 'import';

				temp[name].rules = copyRulesBy(deprecatedRules, filter, false);
				// temp[name].rules = copyLegacyRules(deprecatedRules);
			}

			// use airbnb rules wih stylistic plugin
			if (name === 'stylistic') {
				temp[name].rules = copyPluginRules(name, deprecatedRules);
			}

			if (name === 'typescript') {
				temp[name].languageOptions = getLanguageOptions[name]();

				const filter: (
					(rule: ProcessedRule<ApprovedMeta>) => boolean
				) = ((rule) => isTypescriptRule(rule.name));

				const entries = Object.entries(
					copyRulesBy(approvedRules, filter),
				);

				const disabledEntries = Object.fromEntries(
					[...entries].map(([rule]) => [rule, 0]),
				) as FlatConfig['rules'];

				const prefixedEntries = Object.fromEntries(
					[...entries].map(([rule, value]) => {
						const prefixed = `${pluginPrefix.typescript}/${rule}`;
						return [prefixed, value];
					}),
				) as FlatConfig['rules'];

				// temp[name].rules = copyTypescriptRules(approvedRules);
				temp[name].rules = {
					...disabledEntries,
					...prefixedEntries,
				};

				temp[name].settings = getSettings[name](temp.imports);
			}
		}
	});

	// rename
	return Object.fromEntries(
		Object.entries(temp).map(([name, value]) => [name === 'es6' ? 'es2022' : name, value]),
	) as CustomConfigs;
}

function isAirbnb(name: string): name is AirbnbConfigKeys {
	return Object
		.values(airbnbConfigKeyValues)
		.includes(name as AirbnbConfigKeys);
}

function isCustom(name: string): name is CustomConfigKeys {
	return Object
		.values(customConfigKeyValues)
		.includes(name as CustomConfigKeys);
}
