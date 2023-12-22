import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

// @ts-expect-error missing types
import airbnb from 'eslint-config-airbnb-base';
import globals from 'globals';

import names from './names.ts';

import { configHasPlugin } from './plugins.ts';

import {
	getRules,
	getApprovedRules,
	getLegacyRules,
	getPluginRules,
	copyRules,
	copyPluginRules,
	copyLegacyRules,
	copyTypescriptRules,
} from './rules.ts';

import type { ProcessedRule } from './rules.ts';

import type {
	BaseConfig,
	BaseConfigEntry,
	FlatConfig,
	AirbnbConfigs,
	CustomConfigs,
	AirbnbNames,
	CustomNames,
} from '../types.ts';

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
	const convertedConfigs = getConverted(baseEntries);

	const processedRules = getRules(convertedConfigs);
	const processedConfigs = getProcessed(convertedConfigs, processedRules);

	return {
		convertedConfigs,
		processedConfigs,
	};
}

function getConverted(entries: BaseConfigEntry[]): AirbnbConfigs {
	const filename = fileURLToPath(import.meta.url);
	const root = path.dirname(path.resolve(filename, '../..'));

	const compat = new FlatCompat({
		baseDirectory: root,
	});

	const convertBase2Flat = (base: BaseConfig): FlatConfig =>
		compat.config(base).reduce((all, data) => Object.assign(all, data), {});

	return Object.fromEntries(
		entries.map(([name, base]) => [name, convertBase2Flat(base)])
	) as AirbnbConfigs;
}

function getProcessed(
	source: AirbnbConfigs,
	rules: ProcessedRule[]
): CustomConfigs {
	const approvedRules = getApprovedRules(rules);
	const pluginRules = getPluginRules(rules);
	const deprecatedRules = getLegacyRules(rules);
	// @todo filter replacedBy rules

	const temp = Object.values(names.config).reduce(
		(all, name) => Object.assign(all, { [name]: {} }),
		{} as TempConfigs
	);

	type TempConfigs = Omit<CustomConfigs, 'es2022'> & { es6: FlatConfig; };

	Object.keys(temp).forEach((name) => {
		if (isAirbnb(name)) {
			// es6, node, imports have languageOptions
			if (source[name].languageOptions) {
				customizeLanguageOptions(name, source[name], temp[name]);
			}

			// overwrite imports settings
			if (source[name].settings) {
				customizeSettings(source[name], temp[name]);
			}

			// just copy the rules
			if (!configHasPlugin(name)) {
				copyRules(name, approvedRules, temp[name]);
			}

			// add plugin scope
			// overwrite imports rules
			if (configHasPlugin(name)) {
				copyPluginRules(name, pluginRules, temp[name]);
			}
		}

		if (isCustom(name)) {
			// turn off all deprecated rules and
			// rules which are replaced by node or stylistic
			if (name === 'disable-legacy') {
				copyLegacyRules(deprecatedRules, temp[name]);
			}

			// use airbnb rules wih stylistic plugin
			if (name === 'stylistic') {
				copyPluginRules(name, deprecatedRules, temp[name]);
			}

			if (name === 'typescript') {
				copyTypescriptRules(approvedRules, temp[name]);
			}
		}
	});

	// rename
	return Object.fromEntries(
		Object.entries(temp).map(([name, value]) => [
			name === 'es6' ? 'es2022' : name,
			value,
		])
	) as CustomConfigs;
}

function isAirbnb(name: string): name is AirbnbNames {
	return Object.values(names.airbnb).includes(name as AirbnbNames);
}

function isCustom(name: string): name is CustomNames {
	return Object.values(names.custom).includes(name as CustomNames);
}

// applies to es6, node, imports
function customizeLanguageOptions(
	name: AirbnbNames,
	source: FlatConfig,
	target: FlatConfig
) {
	const globalsNode = {
		...globals.es2021,
		...globals.node,
		...globals.nodeBuiltin,
	};

	target.languageOptions = {
		...source.languageOptions,
		ecmaVersion: 2022,
		globals: name === 'node' ? globalsNode : undefined,
	};
}

// only applies to 'imports'
function customizeSettings(source: FlatConfig, target: FlatConfig) {
	const exts = ['.js', '.mjs'];
	const custom = {
		'import/extensions': exts,
		'import/parsers': {
			espree: exts,
		},
		'import/resolver': {
			node: {},
			typescript: { extensions: [...exts, '.json'] },
		},
	};

	target.settings = {
		...source.settings,
		...custom,
	};
}
