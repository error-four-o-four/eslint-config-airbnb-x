import { Linter } from 'eslint';

import type {
	AirbnbConfigs,
	CustomConfigs,
	FlatConfig,
} from './types/configs.ts';

import {
	airbnbConfigKeyValues,
	customConfigKeyValues,
} from './utils/constants.ts';

import {
	importBaseConfigs,
	processEntries,
} from './utils/convert.ts';

import {
	NOTICE,
	createFile,
	ensureFolder,
	getPath,
	toCamelCase,
} from './utils/write.ts';

generateConfigs();

//
// ###
//

async function generateConfigs() {
	const baseConfigEntries = await importBaseConfigs();

	const {
		convertedConfigs,
		processedConfigs,
	} = processEntries(baseConfigEntries);

	const baseDir = '../src/configs';
	ensureFolder(`${baseDir}/`, import.meta.url);

	await writeConvertedConfigs(`${baseDir}/airbnb`, convertedConfigs);
	await writeProcessedConfigs(`${baseDir}/custom`, processedConfigs);

	// const rulesDir = `${baseDir}/rules`;
	// await writeRules(`${rulesDir}/approved.json`, approvedRules);
	// await writeRules(`${rulesDir}/deprecated.json`, deprecatedRules);
}

async function writeConvertedConfigs(folder: string, configs: AirbnbConfigs) {
	const { url } = import.meta;
	ensureFolder(`${folder}/`, url);

	const toData = (config: FlatConfig) => `${NOTICE}
import { Linter } from 'eslint';
export default ${JSON.stringify(config)} as Linter.FlatConfig;
`;

	await airbnbConfigKeyValues.reduce(async (chain, name) => {
		await chain;
		const config = configs[name];

		const file = `${folder}/${name}.ts`;
		const path = getPath(file, url);
		const data = toData(config);

		await createFile(path, data);
	}, Promise.resolve());

	const path = getPath(`${folder}/index.ts`, url);

	await writeIndexFile(path, airbnbConfigKeyValues);
}

async function writeProcessedConfigs(folder: string, configs: CustomConfigs) {
	const prefix = 'airbnb';

	const { url } = import.meta;
	ensureFolder(`${folder}/`, url);

	const toData = (config: Linter.FlatConfig) => `${NOTICE}
import type { FlatConfig } from '../../../scripts/types/configs.ts';
export default ${JSON.stringify(config)} as FlatConfig;
`;

	await customConfigKeyValues.reduce(async (chain, name) => {
		await chain;

		// create a config with a name
		const config = {
			name: `${prefix}:${name}`,
			...configs[name],
		};

		const file = `${folder}/${name}.ts`;
		const path = getPath(file, url);
		const data = toData(config);

		await createFile(path, data);
	}, Promise.resolve());

	const path = getPath(`${folder}/index.ts`, url);

	await writeIndexFile(path, customConfigKeyValues);
}

async function writeIndexFile(file: string, names: string[]) {
	const camelCaseNames = names.map((name) => toCamelCase(name));
	let data = `${NOTICE}\n`;

	data += `${camelCaseNames
		.map((camel, i) => `import ${camel} from './${names[i]}.ts';`)
		.join('\n')}\n\n`;

	data += 'const configs = {\n';
	data += `${camelCaseNames.map((camel) => `\t${camel},`).join('\n')}\n`;
	data += '};\n\n';

	data += 'export {\n';
	data += `${camelCaseNames.map((camel) => `\t${camel},`).join('\n')}\n`;
	data += '};\n\n';

	data += 'export default configs;';

	await createFile(file, data);
}

// async function writeRules(file: string, rules: ProcessedRule[]) {
// 	const { url } = import.meta;
// 	ensureFolder(file, url);

// 	const modified = rules.map(({ name, value, meta }) =>
// 		meta.deprecated
// 			? {
// 				name,
// 				foundIn: meta.config,
// 				replacedIn: meta.plugin || null,
// 				replacedBy: meta.replacedBy || null,
// 				url: meta.url,
// 				value,
// 			}
// 			: {
// 				name,
// 				foundIn: meta.config,
// 				value,
// 			}
// 	);

// 	await writeFile(url, file, JSON.stringify(modified), 'json');
// }
