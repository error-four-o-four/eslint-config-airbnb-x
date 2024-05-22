/**
 * @file
 * generates and writes 'custom' flat config files
 * to 'src/configs/custom'
 * depends on the scripts 'node:compat' and 'node:extract'
 * it's necessary to run these beforehand
 */

import { join } from 'path';

import type { Linter } from 'eslint';
import type { CustomConfigs } from './generate/types.ts';

/** @note created with 'node:compat' */
import convertedConfigs from '../src/configs/airbnb/index.ts';

import {
	createCustomConfigs,
	applyCustomMetaData,
	applyOptionsAndSettings,
} from './generate/main.ts';

import {
	NOTICE,
	ensureFolder,
	resolvePath,
	writeFile,
} from './shared/utils/write.ts';

import { toKebabCase } from './shared/utils/main.ts';

/**
 *  @note
 * create an object literal with
 * the exported configs of 'eslint-config-airbnb-base' as the property key and
 * an empty 'Linter.FlatConfig' object literal as the corresponding property value
 * @see CustomConfigs
 */
const customConfigs = createCustomConfigs();

/**
 * @todo solve overlapping rules in 'imports' and 'typescript' configs
 * @todo customize overwrites for 'typescript' config
 */

/**
 * @note
 * iterate over each entry of the extracted meta data
 * get the value of 'eslint-config-airbnb-base' rule
 * apply, replace or overwrite it depending on the meta data
 */
applyCustomMetaData(convertedConfigs, customConfigs);

/**
 * @note
 * apply and customize 'languageOptions' and 'settings'
 */
applyOptionsAndSettings(convertedConfigs, customConfigs);

// #####

const destination = resolvePath('../src/configs/custom/', import.meta.url);

ensureFolder(destination);
await writeCustomConfigs(destination, customConfigs);
await writeIndexFile(`${destination}index.ts`, Object.keys(customConfigs));

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

async function writeCustomConfigs(folder: string, configs: CustomConfigs) {
	await Object.entries(configs)
		.reduce(async (chain, entry) => {
			await chain;
			const [name, config] = entry;

			const path = join(folder, `${toKebabCase(name)}.ts`);
			const data = toData(config);

			return writeFile(path, data);
		}, Promise.resolve());
}

async function writeIndexFile(path: string, names: string[]) {
	const kebabCaseNames = names.map((name) => toKebabCase(name));

	const importStatements = kebabCaseNames
		.map((kebab, i) => `import ${names[i]} from './${kebab}.ts';`)
		.join('\n');

	const declaration = 'configs';

	const configsDeclaration = [
		`const ${declaration} = {`,
		names.map((name) => `\t${name},`).join('\n'),
		'};',
	].join('\n');

	const exportStatements = [
		'export {',
		`${names.map((name) => `\t${name},`).join('\n')}`,
		'};',
	].join('\n');

	const data = [
		NOTICE,
		importStatements,
		configsDeclaration,
		exportStatements,
		`export default ${declaration};`,
	].join('\n\n');

	await writeFile(path, data);
}
