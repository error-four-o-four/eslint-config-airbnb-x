/**
 * @file
 * extracts and writes meta data to
 * 'scripts/extractedMetaData.ts'
 * 'scripts/extractedLiteralsData.ts'
 * 'data/*.json'
 *
 * @todo
 * https://github.com/eslint/rfcs/pull/116
 */

import { join } from 'path';

import type {
	RawMetaData,
	MetaDataItem,
	MetaDataProps,
} from './shared/types/main.ts';

import type {
	AnyRecord,
	ObjectEntry,
} from './shared/types/utils.ts';

import convertedConfigs from '../src/configs/airbnb/index.ts';

import { pluginPrefix } from './setupGlobal.ts';

import {
	NOTICE,
	resolvePath,
	ensureFolder,
	writeJson,
	writeFile,
} from './shared/utils.ts';

import {
	extractLiterals,
	extractMetaData,
	extractRules,
} from './extract/main.ts';

const { url } = import.meta;

/**
 * @note
 * an array of object literals
 * { rule: string, source: keyof ConvertedConfigs }
 * these are the rules which are use in 'eslint-config-airbnb-base'
 */
const rules = extractRules(convertedConfigs);

/**
 * @note
 * iterate over each of these rules
 * to get the corresponding MetaDataItem
 * @see MetaDataItem scripts/shared/types.ts
 */
const items = rules.map((item) => extractMetaData(item));

/**
 * @note
 * store the rules as string literals
 * to support autocomplete
 */
const literals = extractLiterals();

/**
 * @note
 * create a Record of all rules and their props
 * @see MetaDataProps scripts/shared/types.ts
 */
const rulesRecordUnsorted = items.reduce((result, item) => {
	const {
		rule,
		source,
		...vals
	} = item;

	const target = (source in result) ? result[source] : {};
	target[rule] = vals;

	return {
		...result,
		...{ [source]: target },
	};
}, {} as Record<
	string,
	Record<string, Partial<MetaDataProps>>
>);

const rulesRecord = Object.keys(rulesRecordUnsorted)
	.sort()
	.reduce((result, key) => ({
		...result,
		[key]: rulesRecordUnsorted[key],
	}), {});

/**
 * @note
 * create a Record of deprecated rules and their props
 */
const legacyRecord = items.reduce((all, item) => {
	if (!item.deprecated) return all;

	const { rule, ...vals } = item;

	return {
		...all,
		[rule]: vals,
	};
}, {} as Record<string, MetaDataProps>);

const jsonDestination = resolvePath('../data/', url);
ensureFolder(jsonDestination);

writeJson(
	join(jsonDestination, 'metadata.json'),
	rulesRecord,
);
writeJson(
	join(jsonDestination, 'legacy.json'),
	legacyRecord,
);

// ####

const destination = resolvePath('./', url);

writeFile(
	join(destination, 'extractedMetaData.ts'),
	createMetaData(items),
);
writeFile(
	join(destination, 'extractedLiteralsData.ts'),
	createLiteralsData(literals),
);

// #####

function createMetaData(input: MetaDataItem[]) {
	const data = input.reduce((all, item) => {
		const { rule, ...vals } = item;

		delete vals.url;
		vals.plugins?.forEach((plugin) => delete plugin.url);
		return {
			...all,
			[rule]: { ...vals },
		};
	}, {} as AnyRecord);

	const dataDeclaration = 'customMetaData';
	const typeDeclaration = 'MetaDataProps';
	const typeAssertion = `Record<string, ${typeDeclaration}>`;

	const output = [
		NOTICE,
		`import type { ${typeDeclaration} } from './shared/types/main.ts';`,
		`const data = ${JSON.stringify(data)} as ${typeAssertion};`,
		`const ${dataDeclaration} = new Map(Object.entries(data));`,
		`export default ${dataDeclaration}`,
	].join('\n\n');

	return output;
}

function createLiteralsData(input: Record<keyof RawMetaData, string[]>) {
	type Entry = ObjectEntry<typeof input>;

	const strRule = 'Rule';
	const strRulesArray = 'RulesArray';
	const strPluginRule = 'PluginRule';
	const strUnprefixed = 'Unprefixed';

	const map: Record<keyof RawMetaData, string> = {
		eslint: 'ESLint',
		import: 'ImportX',
		node: 'Node',
		style: 'Stylistic',
		type: 'TypeScript',
	} as const;

	const mapReducer = (
		all: Record<keyof RawMetaData, string[]>,
		key: keyof RawMetaData,
	) => {
		// e.g. ImportX
		const value = map[key];
		// e.g. importRulesArray
		const varDeclaration = `${key}${strRulesArray}`;
		// e.g. ImportXRule
		const typeDeclaration = `${value}${strRule}`;

		return {
			...all,
			[key]: [varDeclaration, typeDeclaration],
		};
	};

	const declarations = (
		Object.keys(map) as (keyof RawMetaData)[]
	).reduce(mapReducer, {} as Record<keyof RawMetaData, string[]>);

	const iterator = ([key, array]: Entry) => {
		const isEslint = key === 'eslint';
		const [varDeclaration, typeDeclaration] = declarations[key];

		const output = [
			'\n',
			// eslint-disable-next-line stylistic/max-len
			`export const ${varDeclaration} = ${JSON.stringify(array)} as const;\n`,
		];

		if (isEslint) {
			// eslint-disable-next-line stylistic/max-len
			output.push(`export type ${typeDeclaration} = (typeof ${varDeclaration})[number];`);
		} else {
			// eslint-disable-next-line stylistic/max-len
			const typeDeclarationWithUnprefixed = `${strUnprefixed}${typeDeclaration}`;
			// eslint-disable-next-line stylistic/max-len
			const typeLiteralValue = `${pluginPrefix[key]}/\${${typeDeclarationWithUnprefixed}}`;
			// eslint-disable-next-line stylistic/max-len
			output.push(`export type ${typeDeclarationWithUnprefixed} = (typeof ${varDeclaration})[number];`);
			// eslint-disable-next-line stylistic/max-len
			output.push(`export type ${typeDeclaration} = \`${typeLiteralValue}\`\n`);
		}

		return output.join('\n');
	};

	const entries = Object.entries(input) as Entry[];

	const unprefixedDeclarations = Object.keys(declarations)
		.filter((key): key is keyof Omit<RawMetaData, 'eslint'> => key !== 'eslint')
		.map((key) => {
			// e.g. ImportXRule
			const typeDeclaration = declarations[key][1];
			return `${strUnprefixed}${typeDeclaration}`;
		}).join('\n\t| ');

	const pluginRuleDeclarations = Object.keys(declarations)
		.filter((key): key is keyof Omit<RawMetaData, 'eslint'> => key !== 'eslint')
		.map((key) => declarations[key][1]).join('\n\t| ');

	const output = [
		NOTICE,
		entries.map(iterator).join('\n'),
		`export type ${strUnprefixed}${strPluginRule} = ${unprefixedDeclarations};\n`,
		`export type ${strPluginRule} = ${pluginRuleDeclarations};`,
	].join('\n');

	return output;
}
