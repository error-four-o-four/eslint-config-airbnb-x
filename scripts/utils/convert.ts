import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';

// @ts-expect-error missing types
import airbnb from 'eslint-config-airbnb-base';
import globals from 'globals';

import { pluginPrefix } from '../../src/plugins.ts';

import type {
	BaseConfig,
	BaseConfigEntry,
	FlatConfig,
	AirbnbConfigs,
	CustomConfigs,
	AirbnbConfigKeys,
	CustomConfigKeys,
} from '../types/configs.ts';

import type { ProcessedRule } from '../types/rules.ts';

import {
	airbnbConfigKeyValues,
	customConfigKeyValues,
} from './constants.ts';

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

import { configHasPlugin } from './plugins.ts';

export async function importBaseConfigs(): Promise<BaseConfigEntry[]> {
	const promiseBaseConfig = (item: string): Promise<BaseConfigEntry> => {
		const name = path.basename(item, '.js');
		const file = pathToFileURL(item).href;

		return new Promise((resolve) => {
			import(file).then((module) => {
				const entry = [
					name, module.default,
				] as BaseConfigEntry;
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

	const compat = new FlatCompat({ baseDirectory: root });

	const convertBase2Flat = (
		base: BaseConfig,
	): FlatConfig => compat
		.config(base)
		.reduce(
			(all, data) => {
				if (data.plugins) delete data.plugins;
				return Object.assign(all, data);
			},
			{},
		);

	return Object.fromEntries(
		entries.map(([
			name, base,
		]) => [
			name, convertBase2Flat(base),
		]),
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

	const temp = customConfigKeyValues.reduce(
		(all, name) => Object.assign(all, { [name]: {} }),
		{} as TempConfigs,
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
				// @todo tests !!!
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
				customizeTypescriptLanguageOptions(temp[name]);
				copyTypescriptRules(approvedRules, temp[name]);

				customizeSettings(source.imports, temp[name], true);
			}
		}
	});

	// rename
	return Object.fromEntries(
		Object.entries(temp).map(([
			name, value,
		]) => [
			name === 'es6' ? 'es2022' : name, value,
		]),
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

const ECMA_VERSION = 2022;
const SOURCE_TYPE = 'module';

// applies to es6, node, imports
function customizeLanguageOptions(
	name: AirbnbConfigKeys,
	source: FlatConfig,
	target: FlatConfig,
) {
	const languageOptions = { ...source.languageOptions };

	delete languageOptions.ecmaVersion;
	delete languageOptions.sourceType;

	target.languageOptions = {
		ecmaVersion: ECMA_VERSION,
		sourceType: SOURCE_TYPE,
	};

	if (name === 'es6') {
		const ecmaFeatures = {
			...languageOptions.parserOptions?.ecmaFeatures,
			jsx: false,
		};

		target.languageOptions.parserOptions = {
			...languageOptions.parserOptions,
			ecmaFeatures,
		};
	}

	if (name === 'node') {
		target.languageOptions.parserOptions = languageOptions.parserOptions;
		target.languageOptions.globals = {
			...globals.es2021,
			...globals.node,
			...globals.nodeBuiltin,
		};
	}

	if (name === 'imports') {
		target.languageOptions.parserOptions = {
			...target.languageOptions.parserOptions,
			// required to satisfy 'import/no-named-as-default'
			ecmaVersion: ECMA_VERSION,
			sourceType: SOURCE_TYPE,
		};
	}
}

// applies to typescript config
function customizeTypescriptLanguageOptions(target: FlatConfig) {
	target.languageOptions = {
		ecmaVersion: ECMA_VERSION,
		sourceType: SOURCE_TYPE,
		parserOptions: {
			// required to satisfy 'import/no-named-as-default'
			ecmaVersion: ECMA_VERSION,
			sourceType: SOURCE_TYPE,
			project: true,
		},
	};
}

// @todo types
const importsKeys = {
	extensions: `${pluginPrefix.import}/extensions`,
	resolver: `${pluginPrefix.import}/resolver`,
	parsers: `${pluginPrefix.import}/parsers`,
};

// @todo tests !!!
function customizeSettings(
	source: FlatConfig,
	target: FlatConfig,
	ts = false,
) {
	const extsJs = [
		'.js', '.mjs',
	];
	const extsTs = [
		'.ts', '.mts',
	];
	const exts = ts ? [
		...extsJs, ...extsTs,
	] : extsJs;

	const resolver = {
		node: { extensions: ['.json'] },
		typescript: { extensions: exts },
	};

	const parser = ts
		? { '@typescript-eslint/parser': extsTs }
		: { espree: extsJs };

	const custom = {
		[importsKeys.extensions]: exts,
		[importsKeys.resolver]: resolver,
		[importsKeys.parsers]: parser,
	};

	target.settings = {
		...source.settings,
		...custom,
	};
}
