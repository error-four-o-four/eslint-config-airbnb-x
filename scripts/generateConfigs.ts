import { fileURLToPath } from 'node:url';

import { importBaseConfigs, processConfigEntries } from './utils/convert.ts';

import { airbnbNames, configNames } from './utils/names.ts';

import {
	createLogFileData,
	ensureFolder,
	toCamelCase,
	writeFile,
} from './utils/write.ts';

import type {
	AirbnbNames,
	ConfigNames,
	NamedConfigEntry,
	NamedFlatConfig,
} from './types.ts';

// EXECUTE

const NOTICE = '// FILE GENERATED WITH SCRIPT';

const metaUrl = import.meta.url;

run();

async function run() {
	const baseConfigEntries = await importBaseConfigs();

	// add prefixed property 'name' to FlatConfig
	const prefix = 'airbnb';

	// remove and collect deprecated rules
	// replace deprecated rules
	// convert base to flat config
	const [processedEntries, deprecatedRules] = processConfigEntries(
		prefix,
		baseConfigEntries
	);

	// best-practices
	// errors
	// ...
	const configEntriesAirbnb = processedEntries.filter((entry) =>
		Object.values(airbnbNames).includes(entry[0] as AirbnbNames)
	);

	const configEntryLegacy = findConfig(
		processedEntries,
		configNames.disableLegacy
	);
	const configEntryStylistic = findConfig(
		processedEntries,
		configNames.stylistic
	);
	const configEntryTypescript = findConfig(
		processedEntries,
		configNames.typescript
	);

	const baseDir = '../src/configs';
	ensureFolder(fileURLToPath(new URL(`${baseDir}/`, import.meta.url)));

	const airbnbDir = `${baseDir}/airbnb`;
	await writeConfigs(airbnbDir, configEntriesAirbnb);
	await writeConfigsEntryFile(`${baseDir}/compat.js`, configEntriesAirbnb);

	const legacyFile = `${baseDir}/custom/${configEntryLegacy[0]}.js`;
	await writeConfigToFile(legacyFile, configEntryLegacy[1]);

	const typescriptFile = `${baseDir}/custom/${configEntryTypescript[0]}.js`;
	await writeConfigToFile(typescriptFile, configEntryTypescript[1]);

	const stylisticFile = `${baseDir}/custom/${configEntryStylistic[0]}.js`;
	await writeConfigToFile(stylisticFile, configEntryStylistic[1]);

	const logFile = `../legacy.json`;
	const logData = createLogFileData(deprecatedRules);

	writeFile(metaUrl, logFile, logData, 'json');
}

function findConfig(entries: NamedConfigEntry[], name: ConfigNames) {
	const config = entries.find((entry) => entry[0] === name);

	if (!config) {
		throw new Error(`Oops. Something went wrong. Could not find '${name}'`);
	}

	return config;
}

async function writeConfigs(folder: string, entries: NamedConfigEntry[]) {
	await entries.reduce(async (chain, entry) => {
		await chain;
		const [name, data] = entry;
		const file = `${folder}/${name}.js`;
		return writeConfigToFile(file, data);
	}, Promise.resolve());
}

// @todo jsdoc path is hardcoded
const pathToShared = '../../../shared/types.d.ts';

const getJSDocType = (type: string) =>
	`/** @type {import('${pathToShared}').${type}} */`;

async function writeConfigToFile(file: string, config: NamedFlatConfig) {
	let data = `${NOTICE}\n`;
	data += `${getJSDocType('NamedFlatConfig')}\n`;
	data += `export default ${JSON.stringify(config)}`;

	await writeFile(metaUrl, file, data);
}

async function writeConfigsEntryFile(
	file: string,
	entries: NamedConfigEntry[]
) {
	const names = entries.map(([name]) => [toCamelCase(name), name]);

	let data = `${NOTICE}\n`;

	data += names
		.map(([camel, kebap]) => `import ${camel} from './airbnb/${kebap}.js';`)
		.join('\n');

	data += `\n\n/** @type {{ [x: import('${pathToShared}').AirbnbNames]: import('${pathToShared}').NamedFlatConfig}} */\n`;
	data += 'export const configs = {\n';
	data += names.map(([pascal]) => `${pascal},`).join('\n');
	data += '\n};\n\n';

	data += `${getJSDocType('NamedFlatConfig[]')}\n`;
	data += 'export default Object.values(configs);';

	writeFile(metaUrl, file, data);
}
