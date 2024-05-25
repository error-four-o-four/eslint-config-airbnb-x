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

import { assertNotNull } from './shared/utils/assert.ts';
import { write } from './shared/utils/write.ts';

// #####

type BaseConfigEntry = [string, Linter.BaseConfig];
type FlatConfigEntry = [string, Linter.FlatConfig];

const baseConfigs = await importBaseConfigs();
const flatConfigs = convertBaseConfigs(baseConfigs);

const destination = './src/configs/airbnb';

await write.configFiles(destination, flatConfigs);
write.indexFile(`${destination}/index.ts`, flatConfigs);

// #####

async function importBaseConfigs(): Promise<BaseConfigEntry[]> {
	const promiseBaseConfig = (item: string): Promise<BaseConfigEntry> => {
		const name = basename(item, '.js');
		const file = pathToFileURL(item).href;

		return new Promise((res) => {
			import(file).then((module) => {
				const entry = [name, module.default] as BaseConfigEntry;
				res(entry);
			});
		});
	};

	return Promise.all(airbnb.extends.map(promiseBaseConfig));
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
	delete config.plugins;

	const iterator = (
		[rule, value]: [string, unknown],
	) => [`${pluginPrefix.import}/${rule.split('/')[1]}`, value];

	assertNotNull(config.rules);
	config.rules = Object.fromEntries(
		Object.entries(config.rules).map(iterator),
	);

	assertNotNull(config.settings);
	config.settings = Object.fromEntries(
		Object.entries(config.settings).map(iterator),
	);
}
