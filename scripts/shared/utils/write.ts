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

// @ts-ignore tmp
import promisedConfig from '../../../eslint.config.js';


const linter = new Linter({ configType: 'flat' });
const config = await promisedConfig;

export const NOTICE = '/** @file GENERATED WITH SCRIPT */';

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
