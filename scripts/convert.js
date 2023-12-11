import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import airbnb from 'eslint-config-airbnb-base';

import { NOTICE, promiseBaseConfig, prettify } from './utils.js';

import createConfigs from './create.js';

const writeFile = async (url, input) => {
	const file = fileURLToPath(new URL(url, import.meta.url));
	const output = await prettify(input);
	writeFileSync(file, output);
	console.log('Written data to', file);
};

const configsDir = '../src/configs';
const deprecatedDir = '../src/deprecated';

const writeConfigFile = async ([name, config]) => {
	const url = `${configsDir}/${name}.js`;
	const data = `${NOTICE}
/** @type {import('eslint').Linter.FlatConfig} */
export default ${JSON.stringify(config)}`;

	await writeFile(url, data);
};

const writeDeprecatedFile = async (deprecated) => {
	const url = `${deprecatedDir}/deprecated.js`;
	const data = `${NOTICE}
export default ${JSON.stringify(deprecated)}`;

	await writeFile(url, data);
};

const writeConfigsEntryFile = async () => {
	const data = `${NOTICE}
import disableLegacy from './disable-legacy.js';
import disableLegacyStylistic from './disable-legacy-stylistic.js';
import bestPractice from './best-practices.js';
import errors from './errors.js';
import es6 from './es6.js';
import imports from './imports.js';
import node from './node.js';
import strict from './strict.js';
import style from './style.js';
import stylistic from './stylistic.js';
import variables from './variables.js';

export const configs = {
	'disable-legacy': disableLegacy,
	'disable-legacy-stylistic': disableLegacyStylistic,
	bestPractice,
	errors,
	es6,
	imports,
	node,
	strict,
	style,
	stylistic,
	variables,
};

/** @type {import('eslint').Linter.FlatConfig[]} */
export default Object.values(configs);`;

	const url = `${configsDir}/index.js`;
	writeFile(url, data);
};

// run

const run = async (entries) => {
	const [configs, deprecated] = createConfigs(entries);

	await Object.entries(configs).reduce(async (chain, entry) => {
		await chain;
		return writeConfigFile(entry);
	}, Promise.resolve());

	await writeConfigsEntryFile();

	await writeDeprecatedFile(deprecated);
};

const resolvedConfigEntries = await Promise.all(
	airbnb.extends.map(promiseBaseConfig),
);

run(resolvedConfigEntries);
