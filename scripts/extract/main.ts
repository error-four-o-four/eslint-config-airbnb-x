import type {
	ConvertedConfigs,
	PluginPrefix,
	RawMetaData,
	MetaDataItem,
	MetaDataPluginProps,
} from '../shared/types/main.ts';

import { pluginPrefix } from '../../src/globalSetup.ts';

import rawMetaData from '../shared/raw.ts';

import { getUnprefixedRule } from '../shared/utils/main.ts';
import { assertNotNull } from '../shared/utils/assert.ts';

export function extractRules(configs: ConvertedConfigs) {
	const tmp: Record<string, keyof ConvertedConfigs> = {};

	(Object.keys(configs) as (keyof ConvertedConfigs)[])
		.forEach((config) => {
			const record = configs[config].rules;
			assertNotNull(record);
			Object.keys(record).forEach((rule) => {
				tmp[rule] = config;
			});
		});

	return Object.keys(tmp).sort().map((rule) => ({
		rule,
		source: tmp[rule],
	}));
}

export function extractMetaData(
	{ rule, source }: { rule: string, source: keyof ConvertedConfigs; },
) {
	const isImportRule = rule.startsWith(pluginPrefix.import);
	const unprefixed = isImportRule ? getUnprefixedRule(rule) : rule;

	type Picked = keyof Pick<RawMetaData, 'eslint' | 'import'>;
	const origin: Picked = isImportRule ? 'import' : 'eslint';

	const raw = rawMetaData[origin].get(unprefixed);
	assertNotNull(raw, `Could not get '${rule}' meta`);

	const plugins = findPlugins(unprefixed)
		.map((plugin) => extractPluginMetaData(plugin, unprefixed));

	const result: MetaDataItem = {
		rule,
		unprefixed: rule !== unprefixed ? unprefixed : undefined,
		source,
		deprecated: raw.deprecated ? true : undefined,
		replacedBy: raw.replacedBy && raw.replacedBy.length > 0
			? [...raw.replacedBy] : undefined,
		url: raw.docs?.url,
		plugins: plugins.length > 0 ? plugins : undefined,
	};

	return result;
}

function findPlugins(unprefixed: string) {
	const plugins: (keyof PluginPrefix)[] = [];

	(Object.keys(pluginPrefix) as (keyof PluginPrefix)[]).forEach(
		(key) => {
			if (!rawMetaData[key].has(unprefixed)) return;
			plugins.push(key);
		},
	);

	return plugins;
}

function extractPluginMetaData(origin: keyof PluginPrefix, unprefixed: string) {
	const raw = rawMetaData[origin].get(unprefixed);
	assertNotNull(raw, `Could not get '${unprefixed}' meta in '${origin}'`);

	const extracted: MetaDataPluginProps = {
		prefix: origin,
		deprecated: raw.deprecated ? true : undefined,
		replacedBy: renameReplacedByPrefix(raw.replacedBy),
		url: raw.docs?.url,
	};

	return extracted;
}

function renameReplacedByPrefix(source: readonly string[] | undefined) {
	if (!source) {
		return undefined;
	}

	const regexSlash = /\//;
	const regexEntries = Object.entries({
		node: /^n\//,
		style: /^@stylistic/,
		type: /^@typescript/,
	}) as [keyof Omit<PluginPrefix, 'import'>, RegExp][];

	const iterator = (str: string) => {
		if (!regexSlash.test(str)) {
			return str as string;
		}

		const replacedBy = regexEntries.reduce((
			result: string | undefined,
			[key, re],
		) => {
			if (result) return result;

			if (re.test(str)) return `${pluginPrefix[key]}/${str.split('/').at(-1)}`;

			return result;
		}, undefined);

		if (!replacedBy) {
			throw new Error('Missed \'replacedBy\' prefix');
		}

		return replacedBy;
	};

	return [...source].map(iterator);
}

// #####

export function extractLiterals() {
	return (Object.keys(rawMetaData) as (keyof RawMetaData)[])
		.sort()
		.reduce((all, key) => ({
			...all,
			[key]: [...rawMetaData[key].keys()],
		}), {} as Record<keyof RawMetaData, string[]>);
}

/** @todo */
// export function logEslint(data: MetaDataItem[]) {
// 	const eslintCount = data.filter((item) => item.origin === 'eslint').length;
// 	const eslintCountMax = rawMetaData.eslint.size;
// 	console.log(
// 		'\n\rExtracted',
// 		eslintCount,
// 		'rules of',
// 		eslintCountMax,
// 		'possible ESLint rules',
// 	);

// 	const importCount = data.filter((item) => item.origin === 'import').length;
// 	const importCountMax = rawMetaData.import.size;
// 	console.log(
// 		'Extracted',
// 		importCount,
// 		'rules of',
// 		importCountMax,
// 		'possible \'eslint-plugin-import-x\' rules',
// 	);

// 	const deprecatedCount = data.filter((item) => item.deprecated).length;
// 	console.log(deprecatedCount, 'rules are deprecated');
// }
