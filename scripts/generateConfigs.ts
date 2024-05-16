/**
 * generates and writes 'custom' flat config files
 * to 'src/configs/custom'
 * depends on 'convertConfigs.ts' and 'extractRules.ts'
 */

import { join } from 'path';

import type { Linter } from 'eslint';
import type { CustomConfigs } from './generate/types.ts';

import convertedConfigs from '../src/configs/airbnb/index.ts';

import {
	createCustomConfigs,
	applyCustomMetaData,
	// applyTypescriptMetaData,
	applyOptionsAndSettings,
} from './generate/main.ts';

import {
	NOTICE,
	ensureFolder,
	resolvePath,
	toKebabCase,
	writeFile,
} from './shared/utils.ts';

// #####

const customConfigs = createCustomConfigs();

applyCustomMetaData(convertedConfigs, customConfigs);
// applyTypescriptMetaData(convertedConfigs, customConfigs);

applyOptionsAndSettings(convertedConfigs, customConfigs);

// #####

const destination = resolvePath('../src/configs/custom/', import.meta.url);

ensureFolder(destination);
writeCustomConfigs(destination, customConfigs);
writeIndexFile(`${destination}index.ts`, Object.keys(customConfigs));

// #####

// import type { FlatConfig } from '../../../scripts/types/configs.ts';
const parseConfig = (config: Linter.FlatConfig) => `${NOTICE}\n
import type { Linter } from 'eslint';\n
export default ${JSON.stringify(config)} as Linter.FlatConfig;
`;

async function writeCustomConfigs(folder: string, configs: CustomConfigs) {
	await Object.entries(configs).reduce(async (chain, entry) => {
		await chain;
		const [name, config] = entry;

		const path = join(folder, `${toKebabCase(name)}.ts`);
		const data = parseConfig(config);

		return writeFile(path, data);
	}, Promise.resolve());
}

async function writeIndexFile(path: string, names: string[]) {
	const kebabCaseNames = names.map((name) => toKebabCase(name));
	let data = `${NOTICE}\n`;

	data += `${kebabCaseNames
		.map((kebab, i) => `import ${names[i]} from './${kebab}.ts';`)
		.join('\n')}\n\n`;

	data += 'const configs = {\n';
	data += `${names.map((name) => `\t${name},`).join('\n')}\n`;
	data += '};\n\n';

	data += 'export {\n';
	data += `${names.map((name) => `\t${name},`).join('\n')}\n`;
	data += '};\n\n';

	data += 'export default configs;';

	await writeFile(path, data);
}
