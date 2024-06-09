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
} from './shared/utils/assert.ts';

import parse from './shared/utils/parse.ts';
import write from './shared/utils/write.ts';
import { merge } from 'ts-deepmerge';
import { sortConfigRules } from './shared/utils/main.ts';

// #####

type BaseConfigEntry = [string, Linter.BaseConfig];
type FlatConfigEntry = [string, Linter.FlatConfig];

const destination = './src/configs/airbnb';

const baseConfigs = await importBaseConfigs();
const flatConfigs = convertBaseConfigs(baseConfigs);
const parsedConfigs = parseFlatConfigs(flatConfigs, destination);

await write.files(destination, parsedConfigs);

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

function mergeFlatConfigs(entries: FlatConfigEntry[]) {
	const result = entries.map((entry) => entry[1]).reduce((result, config) => {
		return merge(result, config);
	}, {});

	sortConfigRules(result);

	return result;
}

function parseFlatConfigs(entries: FlatConfigEntry[], folder: string) {
	const parsed = entries.map((entry) => {
		const [name, config] = entry;
		const data = (name === 'imports')
			? parse.config(config, folder, ['import'])
			: parse.config(config, folder);
		return [name, data] as [string, string];
	});

	parsed.push(['index', parse.index(entries)]);

	const merged = mergeFlatConfigs(entries);
	parsed.push(['all', parse.config(merged, folder, ['import'])]);

	return parsed;
}
