import { importBaseConfigs, processEntries } from './utils/convert.ts';
import {
	NOTICE, ensureFolder, toCamelCase, writeFile,
} from './utils/write.ts';

import type {
	FlatConfig,
	AirbnbConfigs,
	AirbnbNames,
	ConfigNames,
	CustomConfigs,
} from './types.ts';

run();

async function run() {
	const baseConfigEntries = await importBaseConfigs();

	const { convertedConfigs, processedConfigs } = processEntries(baseConfigEntries);

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
/** @type {import('eslint').Linter.FlatConfig} */
export default ${JSON.stringify(config)}
`;

	const names = Object.keys(configs) as AirbnbNames[];

	await names.reduce(async (chain, name) => {
		await chain;
		const config = configs[name];

		const file = `${folder}/${name}.js`;
		const data = toData(config);

		await writeFile(url, file, data);
	}, Promise.resolve());

	await writeIndexFile(url, `${folder}/index.js`, names);
}

async function writeProcessedConfigs(folder: string, configs: CustomConfigs) {
	const prefix = 'airbnb';

	const { url } = import.meta;
	ensureFolder(`${folder}/`, url);

	const toData = (config: FlatConfig) => `${NOTICE}
/** @type {{ name: string } & import('eslint').Linter.FlatConfig} */
export default ${JSON.stringify(config)}
`;

	const names = Object.keys(configs) as ConfigNames[];

	await names.reduce(async (chain, name) => {
		await chain;

		// create a config with a name
		const config = {
			name: `${prefix}:${name}`,
			...configs[name],
		};

		const file = `${folder}/${name}.js`;
		const data = toData(config);

		await writeFile(url, file, data);
	}, Promise.resolve());

	await writeIndexFile(url, `${folder}/index.js`, names);
}

async function writeIndexFile(url: string, file: string, names: string[]) {
	const camelCaseNames = names.map((name) => toCamelCase(name));
	let data = `${NOTICE}\n`;

	data += `${camelCaseNames
		.map((camel, i) => `import ${camel} from './${names[i]}.js';`)
		.join('\n')}\n\n`;

	data += 'const configs = {\n';
	data += `${camelCaseNames.map((camel) => `\t${camel},`).join('\n')}\n`;
	data += '};\n\n';

	data += 'export {\n';
	data += `${camelCaseNames.map((camel) => `\t${camel},`).join('\n')}\n`;
	data += '};\n\n';

	data += 'export default configs;';

	await writeFile(url, file, data);
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
