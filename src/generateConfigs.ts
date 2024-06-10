/**
 * @file
 * generates and writes 'custom' flat config files
 * to 'src/configs/custom'
 * depends on the scripts 'node:compat' and 'node:extract'
 * it's necessary to run these beforehand
 */

import type { Entries } from 'type-fest';

import type { FlatConfig } from './globalTypes.ts';

import {
	mergeFlatConfigs,
	sortConfigByKeys,
	sortConfigRules,
} from './utils/helpers.ts';

import parse from './utils/parse.ts';
import write from './utils/write.ts';

import type { TargetConfigs } from './generate/types.ts';

import { generateFlatConfigs } from './generate/index.ts';
import { generateTypescriptConfig } from './generate/typescript.ts';

import {
	getPrefixFromTargetKey,
	narrowTargetKeyWithPlugin,
} from './generate/utils.ts';

// #####

const configDestination = './lib/configs/base';
const mergedDestination = './lib/configs/merged';

console.log('Generating configs ...');

const flatConfigs = generateFlatConfigs();
const mergedConfigs = generateMergedConfigs(flatConfigs);

console.log('Parsing configs ...');

const parsedConfigs = parseFlatConfigs(flatConfigs, configDestination);
const parsedMergedConfigs = parseMergedConfigs(mergedConfigs, mergedDestination);

console.log('Writing files ...');

await write.files(configDestination, parsedConfigs);
await write.files(mergedDestination, parsedMergedConfigs);

// #####

function generateMergedConfigs(input: TargetConfigs) {
	const base = mergeFlatConfigs(Object.entries(input));
	base.name = 'airbnb:base';

	const baseTs = generateTypescriptConfig(base);
	baseTs.name = 'airbnb:base-ts';

	return [['base', base], ['base-ts', baseTs]] as [string, FlatConfig][];
}

function parseFlatConfigs(configs: TargetConfigs, folder: string) {
	const entries = Object.entries(configs) as Entries<TargetConfigs>;

	const parsed = entries.map((entry) => {
		const [name, config] = entry;

		sortConfigByKeys(config);
		sortConfigRules(config);

		const params: Parameters<typeof parse.config> = [config, folder];

		// manually add plugins
		if (narrowTargetKeyWithPlugin(name)) {
			params.push(getPrefixFromTargetKey(name));
		}

		const data = parse.config(...params);
		return [name, data] as [string, string];
	});

	parsed.push(['index', parse.index(entries)]);

	return parsed;
}

function parseMergedConfigs(entries: [string, FlatConfig][], folder: string) {
	const parsed = entries.map((entry) => {
		const [name, config] = entry;

		sortConfigByKeys(config);
		sortConfigRules(config);

		const params: Parameters<typeof parse.config> = [
			config,
			folder,
			'import',
			'node',
			'style',
		];

		/** @todo string literals */
		if (name === 'base-ts') {
			params.push('type');
		}

		const data = parse.config(...params);
		return [name, data] as [string, string];
	});

	return parsed;
}
