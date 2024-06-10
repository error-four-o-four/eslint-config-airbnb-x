/**
 * @file initial script
 * writes compat 'airbnb' flat config files
 * to 'src/configs/airbnb'
 *
 * this script should run independently
 * all subsequent scripts depend on the written config files
 * e.g. type ConvertedConfigs
 */

import { basename } from 'node:path';
import { pathToFileURL } from 'node:url';

import { Linter } from 'eslint';
import { FlatCompat } from '@eslint/eslintrc';

// @ts-expect-error missing types
import airbnb from 'eslint-config-airbnb-base';

import { pluginPrefix } from '../src/globalSetup.ts';

import {
	assertNotNull,
	assertIsArray,
	assertIsRecord,
} from './utils/assert.ts';

import {
	mergeFlatConfigs,
	sortConfigByKeys,
	sortConfigRules,
} from './utils/helpers.ts';

import parse from './utils/parse.ts';
import write from './utils/write.ts';

// #####

type BaseConfigEntry = [string, Linter.BaseConfig];
type FlatConfigEntry = [string, Linter.FlatConfig];

const configsDestination = './lib/configs/compat';
const mergedDestination = './lib/configs/merged';

console.log('Converting configs ...');

const baseConfigs = await importBaseConfigs();
const flatConfigs = convertBaseConfigs(baseConfigs);
const mergedConfig = mergeFlatConfigs(flatConfigs);

console.log('Parsing configs ...');

const parsedConfigs = parseFlatConfigs(flatConfigs, configsDestination);
const parsedMergedConfig = parse.config(mergedConfig, mergedDestination, 'import');

console.log('Writing files ...');

await write.files(configsDestination, parsedConfigs);
await write.file(`${mergedDestination}/compat.ts`, parsedMergedConfig);

// #####

async function importBaseConfigs(): Promise<BaseConfigEntry[]> {
	const getPromisedBaseConfig = async (item: string): Promise<BaseConfigEntry> => {
		const name = basename(item, '.js');
		const file = pathToFileURL(item).href;

		const module = await import(file);

		assertIsRecord(module);

		const value = ('default' in module ? module.default : module);
		return [name, value] as BaseConfigEntry;
	};

	const source: Linter.BaseConfig = airbnb;
	assertIsArray(source.extends);

	return Promise.all(source.extends.map(getPromisedBaseConfig));
}

function convertBaseConfigs(
	entries: BaseConfigEntry[],
): FlatConfigEntry[] {
	const compat = new FlatCompat({ baseDirectory: process.cwd() });

	const convertBase2Flat = (
		base: Linter.BaseConfig,
	): Linter.FlatConfig => compat
		.config(base)
		.reduce(
			(all, config) => {
				/**
				 * @note
				 * 'imports' config has 'eslint-plugin-import'
				 * remove the property 'plugins'
				 * use the custom plugin prefix
				 * for rules and settings
				 */
				if (config.plugins) {
					handleExceptions(config);
				}

				return Object.assign(all, config);
			},
			{},
		);

	return entries.map(
		([name, base]) => ([name, convertBase2Flat(base)]),
	);
}

function handleExceptions(config: Linter.FlatConfig) {
	const {
		languageOptions,
		settings,
		rules,
	} = config;

	(Object.keys(config) as (keyof Linter.FlatConfig)[])
		.forEach((key) => delete config[key]);

	const iterator = (
		[rule, value]: [string, unknown],
	) => [`${pluginPrefix.import}/${rule.split('/')[1]}`, value];

	assertNotNull(languageOptions);
	config.languageOptions = languageOptions;

	assertNotNull(settings);
	config.settings = Object.fromEntries(
		Object.entries(settings).map(iterator),
	);

	assertNotNull(rules);
	config.rules = Object.fromEntries(
		Object.entries(rules).map(iterator),
	);
}

function parseFlatConfigs(entries: FlatConfigEntry[], folder: string) {
	const parsed = entries.map((entry) => {
		const [name, config] = entry;

		sortConfigByKeys(config);
		sortConfigRules(config);

		const params: Parameters<typeof parse.config> = [config, folder];

		// manually add plugins
		/** @note hardcoded */
		if (name === 'imports') {
			params.push(pluginPrefix.import);
		}

		const data = parse.config(...params);
		return [name, data] as [string, string];
	});

	parsed.push(['index', parse.index(entries)]);

	return parsed;
}
