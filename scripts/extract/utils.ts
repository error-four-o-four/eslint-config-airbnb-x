import type { PluginPrefix } from '../shared/types.ts';

import rawMetaData from '../shared/raw.ts';

import { pluginPrefix } from '../setupGlobal.ts';

export function findPlugins(unprefixed: string) {
	const plugins: (keyof PluginPrefix)[] = [];

	(Object.keys(pluginPrefix) as (keyof PluginPrefix)[]).forEach(
		(key) => {
			if (!rawMetaData[key].has(unprefixed)) return;
			plugins.push(key);
		},
	);

	return plugins;
}

export function renameReplacedByPrefix(source: readonly string[] | undefined) {
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

// /** @todo */
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

// #####

// #####

// export function createReducer<T>(...keys: (keyof MetaDataItem)[]) {
// 	return (all: T, meta: MetaDataItem) => {
// 		const { key: name } = meta;

// 		if (keys.length === 1) {
// 			return {
// 				...all,
// 				[name]: meta[keys[0]],
// 			};
// 		}

// 		const vals = keys.reduce(
// 			(tmp, key) => ({
// 				...tmp,
// 				[key]: meta[key],
// 			}),
// 			{},
// 		);

// 		return {
// 			...all,
// 			[name]: vals,
// 		};
// 	};
// }

// #####

// export function createPluginsLegacy() {
// 	const keys: (keyof RawMetaData)[] = [
// 		'import',
// 		'node',
// 		'style',
// 	];

// 	return keys.reduce(
// 		(all: string[], key: keyof RawMetaData) => {
// 			rawMetaData[key].forEach((meta, rule) => {
// 				if (meta.deprecated) all.push(rule);
// 			});
// 			return all;
// 		},
// 		[],
// 	);
// }
