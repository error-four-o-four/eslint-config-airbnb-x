import { Linter } from 'eslint';

import type {
	FlatConfig,
	MergedConfigKeys,
	MergedConfigs,
} from './types/configs.ts';

import customConfigs from '../src/configs/custom/index.ts';

import { pluginPrefix } from '../src/plugins.ts';

import { mergedConfigKeys } from './utils/constants.ts';
import { configHasPlugin } from './utils/plugins.ts';

import {
	isTypescriptRule,
	isImportOverwriteRule,
	getImportOverwrites,
} from './utils/rules.ts';

import { createMergedConfigs } from './utils/merge.ts';

import {
	NOTICE,
	ensureFolder,
	createFile,
	getPath,
} from './utils/write.ts';

mergeConfigs();

//
// ###
//

function mergeConfigs() {
	// generate multiple configs
	// * mixed => applies to both .js & .ts
	// * js-specific
	// * ts-override (which turns off js-specific)
	const result = createMergedConfigs();

	// sort and add all rules
	// which are not a part of a plugin (node, imports, stylistic, typescript)
	getSortedRulesEntries().forEach(([rule, value]) => {
		// @todo
		if (value === undefined) {
			console.log(`${rule} - value is undefined`);
			return;
		}

		if (!isTypescriptRule(rule)) {
			// this rule won't be overwritten by typescript plugin
			// it applies to .js and .ts files
			addRule(result[mergedConfigKeys.baseMixed], rule, value);
		} else {
			// this rule applies only to .js files
			addRule(result[mergedConfigKeys.baseJs], rule, value);

			// disable eslint/js rule for .ts files
			addRule(result[mergedConfigKeys.baseTs], rule, 0);
		}
	});

	// add imports rules for .js and .ts files
	Object.entries(customConfigs.imports.rules!).forEach(([rule, value]) => {
		// @todo
		if (!value) return;

		if (!isImportOverwriteRule(rule)) {
			addRule(result[mergedConfigKeys.baseMixed], rule, value);
			return;
		}

		addRule(result[mergedConfigKeys.baseJs], rule, value);

		const overwrite = getImportOverwrites[rule](value);
		addRule(result[mergedConfigKeys.baseTs], rule, overwrite);
	});

	// add node rules
	Object.entries(customConfigs.node.rules!).forEach(([rule, value]) => {
		// @todo
		if (!value) return;

		addRule(result[mergedConfigKeys.baseMixed], rule, value);
	});

	// add stylistic
	Object.entries(customConfigs.stylistic.rules!).forEach(([rule, value]) => {
		// @todo
		if (!value) return;

		addRule(result[mergedConfigKeys.baseMixed], rule, value);
	});

	// add typescript overwrites
	Object.entries(result[mergedConfigKeys.baseJs].rules).forEach(

		([rule, value]) => {
			// @todo
			if (!value) return;

			if (!rule.startsWith(pluginPrefix.import)) {
				addRule(
					result[mergedConfigKeys.baseTs],
					`${pluginPrefix.typescript}/${rule}`,
					value,
				);
			}
		},
	);

	// console.log(typeof writeConfigs);
	// console.log(result['base-js']);
	writeConfigs(result);
}

function getSortedRulesEntries() {
	return Object.values(customConfigs)
		.filter((config) => {
			if (!config.name) {
				throw new Error('name does not exist on config');
			}

			const name = config.name.split(':')[1];
			return !configHasPlugin(name);
		})
		.map((config) => Object.entries(config.rules || {}))
		.reduce(
			(all, entries) => [...all, ...entries],
			[] as [string, Linter.RuleEntry][],
		)
		.sort((a, b) => {
			const nameA = a[0].toUpperCase();
			const nameB = b[0].toUpperCase();

			return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
		});
}

function addRule(
	config: FlatConfig,
	rule: string,
	value: Linter.RuleEntry<any[]> | 0,
) {
	if (!config.rules) config.rules = {}!;
	config.rules[rule] = value;
}

function writeConfigs(source: MergedConfigs) {
	const { url } = import.meta;
	const folder = '../src/configs/merged';
	ensureFolder(`${folder}/`, url);

	const toData = (config: Linter.FlatConfig) => `${NOTICE}
import type { FlatConfig } from '../../../scripts/types/configs.ts';
export default ${JSON.stringify(config)} as FlatConfig;
`;

	const names = Object.keys(source);

	names.reduce(async (chain, name) => {
		await chain;
		const config = source[name as MergedConfigKeys];

		const file = `${folder}/${name}.ts`;
		const path = getPath(file, url);
		const data = toData(config);

		return createFile(path, data);
	}, Promise.resolve());
}
