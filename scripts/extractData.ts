/**
 * extracts and writes deprecated meta data to
 * 'scripts/metadata.ts'
 * 'data/*'
 *
 * @todo
 * https://github.com/eslint/rfcs/pull/116
 */

import { join } from 'path';

import type {
	RawMetaData,
	MetaDataItem,
	AnyRecord,
	ObjectEntry,
} from './shared/types.ts';

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

const rules = extractRules(convertedConfigs);
const items = rules.map((item) => extractMetaData(item));
const literals = extractLiterals();

const jsonData = createJsonData(items);
const jsonDestination = resolvePath('../data/', url);

ensureFolder(jsonDestination);
Object.keys(jsonData).forEach((key) => {
	writeJson(
		join(jsonDestination, `${key}.json`),
		jsonData[key as keyof typeof jsonData],
	);
});

const destination = resolvePath('./', url);
writeFile(join(destination, 'extractedMetaData.ts'), createMetaData(items));
writeFile(join(destination, 'extractedLiteralsData.ts'), createLiteralsData(literals));

// #####

function createJsonData(input: MetaDataItem[]) {
	const metadata = input.reduce((all, item) => {
		const { rule, ...vals } = item;
		return {
			...all,
			[rule]: vals,
		};
	}, {} as AnyRecord);

	const legacy = input.reduce((all, item) => {
		if (!item.deprecated) return all;

		const { rule, ...vals } = item;

		return {
			...all,
			[rule]: vals,
		};
	}, {} as AnyRecord);

	return {
		metadata,
		legacy,
	};
}

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

	const declaration = 'customMetaData';

	return `${NOTICE}\n
	import type { MetaDataProps } from './shared/types.ts';\n
	const data = ${JSON.stringify(data)} as Record<string, MetaDataProps>;\n
	const ${declaration} = new Map(Object.entries(data));\n
	export default ${declaration}\n`;
}

function createLiteralsData(input: Record<keyof RawMetaData, string[]>) {
	type Entry = ObjectEntry<typeof input>;

	const strRule = 'Rule';
	const strRulesArray = 'RulesArray';
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

		// eslint-disable-next-line stylistic/max-len
		let output = `export const ${varDeclaration} = ${JSON.stringify(array)} as const;\n\n`;

		if (isEslint) {
			// eslint-disable-next-line stylistic/max-len
			output += `export type ${typeDeclaration} = (typeof ${varDeclaration})[number];\n`;
		} else {
			// eslint-disable-next-line stylistic/max-len
			const typeDeclarationWithUnprefixed = `${strUnprefixed}${typeDeclaration}`;
			// eslint-disable-next-line stylistic/max-len
			const typeLiteralValue = `${pluginPrefix[key]}/\${${typeDeclarationWithUnprefixed}}`;
			// eslint-disable-next-line stylistic/max-len
			output += `export type ${typeDeclarationWithUnprefixed} = (typeof ${varDeclaration})[number];\n`;
			// eslint-disable-next-line stylistic/max-len
			output += `export type ${typeDeclaration} = \`${typeLiteralValue}\`\n`;
		}

		return output;
	};

	const unprefixedDeclarations = Object.keys(declarations)
		.filter((key): key is keyof Omit<RawMetaData, 'eslint'> => key !== 'eslint')
		.map((key) => {
			// e.g. ImportXRule
			const typeDeclaration = declarations[key][1];
			return `${strUnprefixed}${typeDeclaration}`;
		}).join('\n\t| ');

	const entries = Object.entries(input) as Entry[];

	return `${NOTICE}
	${entries.map(iterator).join('\n')}
	export type UnprefixedRule = ${unprefixedDeclarations};\n`;
}
