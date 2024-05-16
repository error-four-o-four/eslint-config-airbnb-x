/**
 * initial script
 * converts and writes 'airbnb' flat config files
 * to 'src/configs/airbnb'
 */

import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { Linter } from 'eslint';
import { FlatCompat } from '@eslint/eslintrc';

// @ts-expect-error missing types
import airbnb from 'eslint-config-airbnb-base';

import { pluginPrefix } from './setupGlobal.ts';

import {
	NOTICE,
	resolvePath,
	ensureFolder,
	writeFile,
	toCamelCase,
	assertNotNull,
} from './shared/utils.ts';

// #####

type BaseConfigEntry = [string, Linter.BaseConfig];
type FlatConfigEntry = [string, Linter.FlatConfig];

const baseConfigs = await importBaseConfigs();
const flatConfigs = convertBaseConfigs(baseConfigs);

const configKeys = baseConfigs.map(([key]) => key);
const destination = resolvePath('../src/configs/airbnb/', import.meta.url);

ensureFolder(destination);
writeCompatConfigs(destination, flatConfigs);
writeIndexFile(`${destination}index.ts`, configKeys);

// #####

async function importBaseConfigs(): Promise<BaseConfigEntry[]> {
	const promiseBaseConfig = (item: string): Promise<BaseConfigEntry> => {
		const name = basename(item, '.js');
		const file = pathToFileURL(item).href;

		return new Promise((res) => {
			import(file).then((module) => {
				const entry = [name, module.default] as BaseConfigEntry;
				res(entry);
			});
		});
	};

	return Promise.all(airbnb.extends.map(promiseBaseConfig));
}

function convertBaseConfigs(entries: BaseConfigEntry[]) {
	const compat = new FlatCompat({ baseDirectory: process.cwd() });

	const convertBase2Flat = (
		base: Linter.BaseConfig,
	): Linter.FlatConfig => compat
		.config(base)
		.reduce(
			(all, data) => {
				// this apllies to 'imports' config only
				if (data.plugins) {
					// remove plugins. they're attached later
					delete data.plugins;

					// rename prefix
					assertNotNull(data.rules);

					const prefixRule = (
						[rule, value]: [string, Linter.RuleEntry | undefined],
					) => [`${pluginPrefix.import}/${rule.split('/')[1]}`, value];

					data.rules = Object.fromEntries(
						Object.entries(data.rules).map(prefixRule),
					);
				}

				return Object.assign(all, data);
			},
			{},
		);

	return entries.map(
		([name, base]) => [name, convertBase2Flat(base)] as FlatConfigEntry,
	);
}

// @todo ? => shared utils ?
function createConfigData(config: Linter.FlatConfig) {
	return `${NOTICE}
import { Linter } from 'eslint';
export default ${JSON.stringify(config)} as Linter.FlatConfig;
`;
}

async function writeCompatConfigs(
	folder: string,
	entries: FlatConfigEntry[],
) {
	await entries.reduce(async (chain, entry) => {
		await chain;
		const [name, config] = entry;

		const path = join(folder, `${name}.ts`);
		const data = createConfigData(config);

		return writeFile(path, data);
	}, Promise.resolve());
}

async function writeIndexFile(path: string, names: string[]) {
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

	await writeFile(path, data);
}
