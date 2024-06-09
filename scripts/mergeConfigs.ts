import type { Linter } from 'eslint';

import { merge } from 'ts-deepmerge';

import type { PluginPrefix } from '../src/globalTypes.ts';
import type { CustomConfigs } from './generate/types.ts';

import customConfigs from '../src/configs/custom/index.ts';

import {
	GLOBS_JS,
	GLOBS_MIXED,
	GLOBS_TS,
	pluginPrefix,
} from '../src/globalSetup.ts';

import { tsOnlyRules } from './merge/setup.ts';

import { assertNotNull } from './shared/utils/assert.ts';
import { write } from './shared/utils/write.ts';

const filterTsConfig = (key: keyof CustomConfigs) => key !== 'typescript';
const filterTsPrefix = (key: keyof PluginPrefix) => key !== 'type';
const filterTsOnlyRule = (rule: string) => !tsOnlyRules.has(rule);

const sortRules = (rules: Linter.FlatConfig['rules']) => {
	assertNotNull(rules);
	const unprefixed = Object.keys(rules).filter((rule) => !rule.includes('/'));
	const prefixed = Object.keys(rules).filter((rule) => rule.includes('/'));
	const sorted = [...unprefixed.sort(), ...prefixed.sort()];

	return sorted.reduce((all, key) => ({
		...all,
		[key]: rules[key],
	}), {});
};

assertNotNull(customConfigs.typescript.languageOptions);
assertNotNull(customConfigs.typescript.rules);

const customConfigKeys = Object.keys(customConfigs) as (keyof CustomConfigs)[];

const baseRules: Linter.FlatConfig['rules'] = customConfigKeys
	.filter(filterTsConfig)
	.reduce((all, key) => {
		const { rules } = customConfigs[key];
		assertNotNull(rules);
		return {
			...all,
			...rules,
		};
	}, {});

const baseTsRules: Linter.FlatConfig['rules'] = {
	...baseRules,
	...customConfigs.typescript.rules,
};

const baseTsOnlyRules: Linter.FlatConfig['rules'] = Object.keys(
	customConfigs.typescript.rules,
)
	.filter(filterTsOnlyRule)
	.reduce((all, key) => ({
		...all,
		[key]: 0,
	}), {});

const baseLanguageOptions: Linter.FlatConfig['languageOptions'] = customConfigKeys
	.filter(filterTsConfig)
	.reduce((all, key) => {
		const { languageOptions } = customConfigs[key];
		return languageOptions
			? merge(all, languageOptions) : all;
	}, {});

const baseTsLanguageOptions = merge(baseLanguageOptions, {
	parserOptions: {
		project: true,
	},
});

assertNotNull(customConfigs.imports.settings);
assertNotNull(customConfigs.typescript.settings);
const baseSettings = customConfigs.imports.settings;
const baseTsSettings = customConfigs.typescript.settings;

const basePlugins: Partial<PluginPrefix> = (
	Object.keys(pluginPrefix) as (keyof PluginPrefix)[]
).filter(filterTsPrefix)
	.reduce((all, key) => ({
		...all,
		[key]: pluginPrefix[key],
	}), {});

const mergedConfigs: Record<string, Linter.FlatConfig> = {
	base: {
		name: 'airbnb:base',
		files: GLOBS_JS,
		// @ts-ignore keys are parsed/transformed to import statements
		plugins: basePlugins,
		languageOptions: baseLanguageOptions,
		settings: baseSettings,
		rules: sortRules(baseRules),
	},
	baseTs: {
		name: 'airbnb:base-typed',
		files: GLOBS_MIXED,
		// @ts-ignore keys are parsed/transformed to import statements
		plugins: pluginPrefix,
		languageOptions: baseTsLanguageOptions,
		settings: baseTsSettings,
		rules: sortRules(baseTsRules),
	},
	baseTsOnly: {
		name: 'airbnb:base-typed-overwrite',
		files: GLOBS_TS,
		rules: sortRules(baseTsOnlyRules),
	},
};

write.configFiles('./src/configs/test', mergedConfigs);

// import {
// 	createMergedConfigs,
// 	mergeLanguageOptions,
// 	mergeSettings,
// 	mergeRules,
// 	sortRules,
// } from './merge/main.ts';

// /**
//  * @todo
//  * create configs, which apply to different code bases, like
//  * js-only, js-mixed, ts-mixed, ts-only
//  *
//  */

// /**
//  * @note
//  * mixed => applies to both .js & .ts
//  * js-specific
//  * ts-override (which turns off js-specific)
//  */

// const mergedConfigs = createMergedConfigs();

// /**
//  * @note
//  * merge languageOptions
//  * except from ('node' and) 'typescript'
//  *
//  * @todo
//  * consider to add a config to differentiate environments node/browser
//  */

// mergeLanguageOptions(mergedConfigs);
// mergeSettings(mergedConfigs);
// mergeRules(mergedConfigs);
// sortRules(mergedConfigs);

// // #####

// const destination = './src/configs/merged';
// await write.configFiles(destination, mergedConfigs);
