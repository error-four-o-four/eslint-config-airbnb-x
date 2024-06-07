import {
	relative,
	resolve,
	sep,
} from 'node:path';

import { ESLint } from 'eslint';

import type { Entries, UnknownRecord } from 'type-fest';

import { pluginPaths } from '../../../src/globalSetup.ts';

import {
	sortConfigByKeys,
	toCamelCase,
	toKebabCase,
} from './main.ts';

import {
	assertIsString,
	assertNotNull,
} from './assert.ts';

import {
	strTypeConfig,
	strTypePlugin,
	strTypeParser,
} from '../../../src/globalTypes.ts';

import type { FlatConfig, PluginPrefix } from '../../../src/globalTypes.ts';

const overrideConfigFile = resolve(process.cwd(), 'eslint.style.js');

const eslint = new ESLint({
	fix: true,
	overrideConfigFile,
});

function parseImports(
	folder: string,
	plugins?: (keyof PluginPrefix)[],
) {
	const importPath = relative(folder, './src').split(sep).join('/');
	const importFile = `${importPath}/globalTypes.ts`;

	const output: string[] = [];

	const imports = !plugins
		? [strTypeConfig]
		: plugins.includes('type')
			? [
				strTypeConfig,
				strTypePlugin,
				strTypeParser,
			]
			: [strTypeConfig, strTypePlugin];

	const requireLinebreak = imports.length > 2;
	const seperator = requireLinebreak ? ',\n' : ', ';

	output.push(`import type { ${imports.join(seperator)} } from '${importFile}';`);

	if (requireLinebreak) output.push('');

	if (plugins) {
		plugins.forEach((prefix) => {
			const plugin = toCamelCase(pluginPaths[prefix]);
			output.push(`import ${plugin} from '${pluginPaths[prefix]}';`);
		});
	}

	return output.join('\n') + '\n';
}

function getPluginsString(plugins: (keyof PluginPrefix)[]) {
	return `plugins: {\n${
		plugins.map((prefix) => {
			const pluginPath = pluginPaths[prefix];
			const pluginDeclaration = toCamelCase(pluginPath);
			const result = prefix === 'type'
				? `${prefix}: ${pluginDeclaration}.plugin as ${strTypePlugin},`
				: `${prefix}: ${pluginDeclaration} as unknown as ${strTypePlugin},`;
			return result + '\n';
		}).join('')
	}},`;
}

function insertPluginsString(output: string, plugins: string) {
	let regex = /"plugins.+,/;
	let match: RegExpMatchArray | null;

	if (regex.test(output)) {
		// indicates that this is a generated config (not compat)
		match = output.match(regex);
		assertNotNull(match);

		return output.replace(match[0], plugins);
	}

	regex = /default {/;
	match = output.match(regex);
	assertNotNull(match);

	return output.replace(match[0], `${match[0]}\n${plugins}`);
}

function getParserString() {
	return `parser: ${toCamelCase(pluginPaths.type)}.parser as ${strTypeParser},`;
}

function insertParserString(output: string, parser: string) {
	const match = '"parserOptions"';
	return output.replace(match, `${parser}\n${match}`);
}

function parseConfig(
	input: FlatConfig,
	plugins?: (keyof PluginPrefix)[],
) {
	let output = `export default ${JSON.stringify(input, null, 2)} satisfies ${strTypeConfig};`;

	if (!plugins) {
		return output;
	}

	const pluginsString = getPluginsString(plugins);
	output = insertPluginsString(output, pluginsString);

	if (plugins.includes('type')) {
		const parserString = getParserString();
		output = insertParserString(output, parserString);
	}

	return output;
}

export default {
	config(
		input: FlatConfig,
		folder: string,
		plugins?: (keyof PluginPrefix)[],
	) {
		const config = sortConfigByKeys(input);
		return `${parseImports(folder, plugins)}\n${parseConfig(config, plugins)}\n`;
	},
	index(
		input: UnknownRecord | Entries<UnknownRecord>,
	) {
		const entries: Entries<UnknownRecord> = (
			Array.isArray(input)
				? input
				: Object.entries(input)
		);

		const kebabCaseNames = entries.map(([name]) => {
			assertIsString(name);
			return toKebabCase(name);
		}).sort();

		const camelCaseNames = kebabCaseNames.map((name) => toCamelCase(name));

		const importStatement = `${camelCaseNames
			.map((camel, i) => `import ${camel} from './${kebabCaseNames[i]}.ts';`)
			.join('\n')}`;

		const declaration = 'configs';

		const declarationStatement = [
			`const ${declaration} = {`,
			`${camelCaseNames.map((camel) => `\t${camel},`).join('\n')}`,
			'};',
		].join('\n');

		const exportStatement = [
			'export {',
			`${camelCaseNames.map((camel) => `\t${camel},`).join('\n')}`,
			'};',
		].join('\n');

		return [
			importStatement,
			declarationStatement,
			exportStatement,
			`export default ${declaration}`,
		].join('\n\n');
	},
	async file(notice: string, input: string) {
		const output = `${notice}\n${input}`;
		const results = await eslint.lintText(output);

		if (results.length > 1) {
			console.log(`Received ${results.length} results`);
		}

		const result = results[0];

		if (!result.output) {
			console.log('\nfatal error count:', result.fatalErrorCount);
			console.log(...results, '\n');
			throw new Error('Unable to lint output');
		}

		return result.output;
	},
};
