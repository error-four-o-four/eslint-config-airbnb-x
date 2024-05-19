import {
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from 'node:fs';

import {
	dirname,
	isAbsolute,
	sep,
} from 'node:path';

import { fileURLToPath } from 'node:url';

import { Linter } from 'eslint';

import type { PluginPrefix } from './types.ts';

// @ts-ignore tmp
import promisedConfig from '../../eslint.config.js';

export function assertNotNull(
	value: unknown,
	message: string = 'Nope',
): asserts value is NonNullable<typeof value> {
	if (value === null || value === undefined) throw new Error(message);
}

// function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
// 	return obj.hasOwnProperty(prop);
// }

export function toUpperCase(input: string) {
	return input.slice(0, 1).toUpperCase() + input.slice(1).toLowerCase();
}

export function toCamelCase(input: string) {
	/* eslint-disable-next-line stylistic/max-len */
	const r = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
	const m = input.match(r);

	if (!m) return input;

	const s = Array.isArray(m)
		? m
			.map(toUpperCase)
			.join('')
		: input;

	return s.slice(0, 1).toLowerCase() + s.slice(1);
}

export function toKebabCase(input: string) {
	/* eslint-disable-next-line stylistic/max-len */
	const r = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
	const m = input.match(r);

	if (!m) return input;

	return m
		.join('-')
		.toLowerCase();
}

export function getPrefixedRule<T extends string>(
	prefix: keyof PluginPrefix,
	rule: T,
) {
	return `${prefix}/${rule}`;
}

const regExPrefixed = /\//;

export function getUnprefixedRule<T extends string>(rule: T) {
	return (regExPrefixed.test(rule)) ? rule.split('/')[1] : rule;
}

// #####

const sortString = (a: string, b: string) => (a.toUpperCase() < b.toUpperCase()
	? -1
	: a > b
		? 1
		: 0);

export function sortArrOfObjsByProp<
	T extends {} & Record<string, any>
>(key: keyof T) {
	return (a: T, b: T) => {
		const u = a[key];
		const v = b[key];

		return sortString(u, v);
	};
}

// ##### write file functions

const linter = new Linter({ configType: 'flat' });
const config = await promisedConfig;

export const NOTICE = '// FILE GENERATED WITH SCRIPT';

const root = fileURLToPath(new URL('../..', import.meta.url));

// resolve relative to root if meta is undefined
export function resolvePath(filePath: string, url?: string) {
	return fileURLToPath(new URL(filePath, url || root));
}

export function ensureFolder(fileOrFolder: string, meta?: string) {
	const path = isAbsolute(fileOrFolder)
		? fileOrFolder
		: resolvePath(fileOrFolder, meta);

	const folder = path.endsWith(sep) ? path : dirname(path);
	if (!existsSync(folder)) mkdirSync(folder);
}

export function writeJson(filePath: string, data: any) {
	writeFileSync(
		filePath,
		JSON.stringify(data, null, 2),
		{ flag: 'w+' },
	);
}

export function readJson(path: string, url: string) {
	return JSON.parse(readFileSync(resolvePath(path, url), 'utf-8'));
}

export async function writeFile(filePath: string, fileData: string) {
	const dirPath = dirname(filePath);
	const strPath = filePath.replace(process.cwd(), '');
	const msgInit = `Writing data to '${strPath}'`;

	if (!existsSync(dirPath)) mkdirSync(dirPath);

	console.log(msgInit);
	writeFileSync(filePath, fileData, { flag: 'w+' });

	const result = linter.verifyAndFix(fileData, config, filePath);

	// console.log('fixed:', result.fixed);

	if (result.messages.length > 0) {
		console.log(
			result.messages.length,
			`issue${result.messages.length > 1 ? 's' : ''} remaining:`,
		);

		result.messages.forEach(
			(msgLint) => console.log(`* ${msgLint.message}`),
		);
	}

	if (result.fixed && result.output) {
		writeFileSync(filePath, result.output, { flag: 'w+' });
	}

	// console.log('done');
}
