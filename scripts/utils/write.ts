import {
	existsSync, mkdirSync, writeFileSync,
} from 'node:fs';
import {
	dirname, isAbsolute, sep,
} from 'node:path';
import { fileURLToPath } from 'node:url';

import { Linter } from 'eslint';

// @ts-ignore tmp
import promisedConfig from '../../eslint.config.js';

const linter = new Linter({ configType: 'flat' });

const config = await promisedConfig;

export const NOTICE = '// FILE GENERATED WITH SCRIPT';

export function toCamelCase(input: string) {
	/* eslint-disable-next-line stylistic/max-len */
	const r = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
	const m = input.match(r);

	if (!m) return input;

	const s = Array.isArray(m)
		? m
			.map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
			.join('')
		: input;

	return s.slice(0, 1).toLowerCase() + s.slice(1);
}

export function ensureFolder(pathOrUrl: string, meta?: string) {
	if (!isAbsolute(pathOrUrl) && !meta) {
		throw new Error("param 'import.meta.url' is required");
	}

	const path = isAbsolute(pathOrUrl)
		? pathOrUrl
		: fileURLToPath(new URL(pathOrUrl, meta));

	const folder = path.endsWith(sep) ? path : dirname(path);
	if (!existsSync(folder)) mkdirSync(folder);
}

export function getPath(path: string, meta: string) {
	return fileURLToPath(new URL(path, meta));
}

export async function createFile(filePath: string, fileData: string) {
	const dirPath = dirname(filePath);

	if (!existsSync(dirPath)) mkdirSync(dirPath);

	console.log('\nwriting data to file:');
	console.log(`${filePath.replace(process.cwd(), '')}`);
	writeFileSync(filePath, fileData, { flag: 'w+' });

	const result = linter.verifyAndFix(fileData, config, filePath);

	console.log('fixed:', result.fixed);

	if (result.messages.length > 0) {
		console.log(
			result.messages.length,
			`issue${result.messages.length > 1 ? 's' : ''} remaining:`,
		);

		result.messages.forEach(
			(message) => console.log(`* ${message.message}`),
		);
	}

	if (result.fixed && result.output) {
		writeFileSync(filePath, result.output, { flag: 'w+' });
	}

	console.log('done');
}

// DEPRECATED LOG

// export function createLogFileData(rules: DeprecatedRule[]) {
// 	return JSON.stringify(
// 		rules.sort(sortRules).reduce(
// 			(all, rule) => {
// 				const { plugin } = rule;

// 				delete rule.plugin;

// 				if (plugin) {
// 					if (!all[plugin]) all[plugin] = [];
// 					all[plugin].push(rule);
// 				} else {
// 					if (!all.legacy) all.legacy = [];
// 					all.legacy.push(rule);
// 				}

// 				return all;
// 			},
// 			{} as {
// 				[x: string]: DeprecatedRule[];
// 			}
// 		)
// 	);
// }
