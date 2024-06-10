import { fileURLToPath } from 'node:url';

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

import { assertIsString } from './assert.ts';
import { toKebabCase } from './helpers.ts';

import parse from './parse.ts';

import type {
	GenericString,
	RequiredFileString,
	RequiredFolderString,
	RequiredJsonString,
} from './types.ts';

// #####

const NOTICE = '/** @file GENERATED WITH SCRIPT */';

// has trailing slash (!)
// const base = fileURLToPath(baseURL);
const baseURL = new URL('../..', import.meta.url);

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

export function writeJsonFile<T extends string>(
	file: GenericString<T, RequiredJsonString>,
	input: unknown,
) {
	const path = resolvePath(file);
	ensureFolder(path);

	const data = JSON.stringify(input, null, 2);
	writeFileSync(
		file,
		data,
		{ flag: 'w+' },
	);

	console.log(`Written data to '${file}'`);
}

export async function writeFile<T extends string>(
	file: GenericString<T, RequiredFileString>,
	data: string,
): Promise<void> {
	const path = resolvePath(file);
	ensureFolder(path);

	const parsed = await parse.file(NOTICE, data);

	writeFileSync(
		path,
		parsed,
		{ flag: 'w+' },
	);

	console.log(`Written data to '${file}'`);
}

export async function writeFiles<T extends string>(
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
			return writeFile(path, config);
		}, Promise.resolve());
}

export default {
	json: writeJsonFile,
	file: writeFile,
	files: writeFiles,
};
