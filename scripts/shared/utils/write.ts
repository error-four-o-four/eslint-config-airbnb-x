import {
	existsSync,
	mkdirSync,
	writeFileSync,
} from 'node:fs';

import {
	dirname,
	extname,
	isAbsolute,
} from 'node:path';

import { fileURLToPath } from 'node:url';

import { toKebabCase } from './main.ts';
import { assertIsString } from './assert.ts';

import parse from './parse.ts';

const NOTICE = '/** @file GENERATED WITH SCRIPT */';

// has trailing slash (!)
// const base = fileURLToPath(baseURL);
const baseURL = new URL('../../..', import.meta.url);

// resolve relative to root if meta is undefined
function resolvePath(filePath: string, url?: string) {
	return fileURLToPath(new URL(filePath, url || baseURL));
}

const ensuredFolders = new Set<string>();

function ensureFolder(fileOrFolder: string, meta?: string) {
	const path = isAbsolute(fileOrFolder)
		? fileOrFolder
		: resolvePath(fileOrFolder, meta);

	const folder = !extname(fileOrFolder) ? path : dirname(path);

	if (ensuredFolders.has(folder)) return;

	ensuredFolders.add(folder);

	if (!existsSync(folder)) {
		mkdirSync(folder, { recursive: true });
	}
}

type RequiredJsonString = `./${string}.json`;
type RequiredFileString = `./${string}.${'js' | 'ts'}`;

type GenericString<
	T extends string,
	U extends string,
> = T extends U ? T : never;

type BannedExtensionString = `${string}.${string}`;
type RequiredFolderString<
	T extends string> = `./${T extends BannedExtensionString ? never : T}`;

export default {
	json<T extends string>(
		file: GenericString<T, RequiredJsonString>,
		input: unknown,
	) {
		const path = resolvePath(file);
		ensureFolder(path);

		console.log(`Writing data to '${file}'`);
		const data = JSON.stringify(input, null, 2);
		writeFileSync(
			file,
			data,
			{ flag: 'w+' },
		);
	},
	async file<T extends string>(
		file: GenericString<T, RequiredFileString>,
		data: string,
	): Promise<void> {
		const path = resolvePath(file);
		ensureFolder(path);

		const parsed = await parse.file(NOTICE, data);

		console.log(`Writing data to '${file}'`);
		writeFileSync(
			path,
			parsed,
			{ flag: 'w+' },
		);
	},
	async files< T extends string >(
		folder: RequiredFolderString<T>,
		input: [string, string][],
	) {
		await input
			.reduce(async (chain, entry) => {
				await chain;
				const [name, config] = entry;

				assertIsString(name);
				assertIsString(config);

				const path: RequiredFileString = `${folder}/${toKebabCase(name)}.ts`;
				return this.file(path, config);
			}, Promise.resolve());
	},
};
