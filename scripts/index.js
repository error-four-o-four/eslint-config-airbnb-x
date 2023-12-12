import { dirname, sep } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import airbnb from 'eslint-config-airbnb-base';

import { pluginNames } from '../src/setup/plugins.js';
import { NOTICE, promiseBaseConfig, prettify } from './utils.js';

import createConfigs from './create.js';

const ensureFolder = (url) => {
	const folder = url.endsWith(sep) ? url : dirname(url);
	if (!existsSync(folder)) mkdirSync(folder);
};

const writeFile = async (url, input, parser = 'espree') => {
	const file = fileURLToPath(new URL(url, import.meta.url));
	const output = await prettify(input, parser);
	ensureFolder(file);
	writeFileSync(file, output, { flag: 'w+' });
	console.log('Written data to', file);
};

const writeConfigToFile = async (file, config) => {
	const data = `${NOTICE}
/** @type {import('eslint').Linter.FlatConfig} */
export default ${JSON.stringify(config)}`;

	await writeFile(file, data);
};

const writeConfigs = async (folder, entries) => {
	await entries.reduce(async (chain, entry) => {
		await chain;
		const [name, data] = entry;
		const file = `${folder}/${name}.js`;
		return writeConfigToFile(file, data);
	}, Promise.resolve());
};

const writeConfigsEntryFile = async (file, entries) => {
	const toCamelCase = (str) => {
		const s =
			str &&
			str
				.match(
					/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
				)
				.map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
				.join('');
		return s.slice(0, 1).toLowerCase() + s.slice(1);
	};

	const names = entries.map(([name]) => [toCamelCase(name), name]);

	let data = `${NOTICE}\n`;

	data += names
		.map(([camel, kebap]) => `import ${camel} from './${kebap}.js';`)
		.join('\n');

	data += '\n\nexport const all = {\n';
	data += names.map(([pascal]) => `${pascal},`).join('\n');
	data += '\n};\n\n';

	data += "/** @type {import('eslint').Linter.FlatConfig[]} */\n";
	data += 'export default Object.values(all);';

	// 	const data = `${NOTICE}
	// import bestPractice from './best-practices.js';
	// import errors from './errors.js';
	// import es6 from './es6.js';
	// import imports from './imports.js';
	// import node from './node.js';
	// import strict from './strict.js';
	// import style from './style.js';
	// import variables from './variables.js';

	// export const all = {
	// 	bestPractice,
	// 	errors,
	// 	es6,
	// 	imports,
	// 	node,
	// 	strict,
	// 	style,
	// 	variables,
	// };

	// /** @type {import('eslint').Linter.FlatConfig[]} */
	// export default Object.values(all);`;

	writeFile(file, data);
};

// run

const run = async (entries) => {
	const [configs, legacy] = createConfigs(entries);

	const configEntriesAirbnb = Object.entries(configs).filter(
		(entry) =>
			entry[0] !== 'disable-legacy' && entry[0] !== pluginNames.stylistic
	);

	const configStylistic = Object.entries(configs).find(
		(entry) => entry[0] === pluginNames.stylistic
	)[1];

	const configLegacy = Object.entries(configs).find(
		(entry) => entry[0] === 'disable-legacy'
	)[1];

	const baseDir = '../src/configs';
	ensureFolder(fileURLToPath(new URL(`${baseDir}/`, import.meta.url)));

	const airbnbDir = `${baseDir}/airbnb`;
	await writeConfigs(`${airbnbDir}`, configEntriesAirbnb);
	await writeConfigsEntryFile(`${airbnbDir}/index.js`, configEntriesAirbnb);

	const stylisticFile = `${baseDir}/${pluginNames.stylistic}/index.js`;
	await writeConfigToFile(stylisticFile, configStylistic);

	const legacyFile = `${baseDir}/legacy/index.js`;
	await writeConfigToFile(legacyFile, configLegacy);

	const logFile = `../legacy.json`;
	const logData = JSON.stringify(
		legacy.reduce((all, rule) => {
			const { plugin } = rule;

			// eslint-disable-next-line no-param-reassign
			delete rule.plugin;

			if (plugin) {
				// eslint-disable-next-line no-param-reassign
				if (!all[plugin]) all[plugin] = [];
				all[plugin].push(rule);
			} else {
				// eslint-disable-next-line no-param-reassign
				if (!all.legacy) all.legacy = [];
				all.legacy.push(rule);
			}

			return all;
		}, {})
	);

	writeFile(logFile, logData, 'json');

	// const output = await prettify(JSON.stringify(logData), 'json');
	// writeFileSync(logFile, output);
	// console.log('Written data to', logFile, { flag: 'w+' });
};

const resolvedConfigEntries = await Promise.all(
	airbnb.extends.map(promiseBaseConfig)
);

run(resolvedConfigEntries);
