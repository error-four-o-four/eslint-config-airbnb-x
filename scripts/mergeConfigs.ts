import type { Linter } from 'eslint';

import { join } from 'node:path';

import type { MergedConfigs } from './merge/types.ts';

import { toKebabCase } from './shared/utils/main.ts';

import {
	NOTICE,
	ensureFolder,
	resolvePath,
	writeFile,
} from './shared/utils/write.ts';

import {
	createMergedConfigs,
	mergeLanguageOptions,
	mergeSettings,
	mergeRules,
	sortRules,
} from './merge/main.ts';

/** @note */
// * mixed => applies to both .js & .ts
// * js-specific
// * ts-override (which turns off js-specific)

const mergedConfigs = createMergedConfigs();

/**
 * @note
 * merge languageOptions
 * except from 'node' and 'typescript'
 *
 * @todo
 * consider to add a config to differentiate environments node/browser
 */

mergeLanguageOptions(mergedConfigs);
mergeSettings(mergedConfigs);
mergeRules(mergedConfigs);
sortRules(mergedConfigs);

// #####

const destination = resolvePath('../src/configs/merged/', import.meta.url);

ensureFolder(destination);
await writeMergedConfigs(destination, mergedConfigs);
// #####

function toData(config: Linter.FlatConfig) {
	return [
		NOTICE,
		/** @todo */
		// `import type { FlatConfig } from '../../../scripts/types/configs.ts';`,
		'import type { Linter } from \'eslint\';',
		`export default ${JSON.stringify(config)} as Linter.FlatConfig;`,
	].join('\n\n');
}

async function writeMergedConfigs(
	folder: string,
	configs: MergedConfigs,
) {
	await Object.entries(configs)
		.reduce(async (chain, entry) => {
			await chain;
			const [name, config] = entry;

			const path = join(folder, `${toKebabCase(name)}.ts`);
			const data = toData(config);

			return writeFile(path, data);
		}, Promise.resolve());
}
