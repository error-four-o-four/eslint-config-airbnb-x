import {
	relative,
	resolve,
	sep,
} from 'node:path';

import { ESLint } from 'eslint';

import type { Entries, UnknownRecord } from 'type-fest';

import {
	pluginPaths,
	strTypeConfig,
	strTypePlugin,
	strTypeParser,
} from '../globalSetup.ts';

import type { FlatConfig, PluginPrefix } from '../globalTypes.ts';

import {
	assertIsString,
	assertNotNull,
} from './assert.ts';

import {
	toCamelCase,
	toKebabCase,
	sortConfigByKeys,
} from './helpers.ts';

const overrideConfigFile = resolve(process.cwd(), 'eslint.style.js');

const eslint = new ESLint({
	fix: true,
	overrideConfigFile,
});

function parseImports(
	folder: string,
	plugins: (keyof PluginPrefix)[],
) {
	const importPath = relative(folder, './src').split(sep).join('/');
	const importFile = `${importPath}/globalTypes.ts`;

	const output: string[] = [];

	const hasPlugins = plugins.length > 0;

	const imports = !hasPlugins
		? [strTypeConfig]
		: plugins.includes('type')
			? [
				strTypeConfig,
				strTypePlugin,
				strTypeParser,
			]
			: [strTypeConfig, strTypePlugin];

	if (hasPlugins) {
		plugins.forEach((prefix) => {
			const pluginImport = pluginPaths[prefix];
			const pluginDeclaration = toCamelCase(pluginImport);
			output.push(`import ${pluginDeclaration} from '${pluginImport}';`);
		});
	}

	const requireLinebreak = imports.length > 2;
	if (requireLinebreak) output.push('\n');

	const seperator = requireLinebreak ? ',\n' : ', ';
	output.push(`import type { ${imports.join(seperator)} } from '${importFile}';`);

	return output.join('\n') + '\n';
}

function getPluginsString(plugins: (keyof PluginPrefix)[]) {
	const output = ['plugins: {'];

	output.push(plugins.map((prefix) => {
		const pluginPath = pluginPaths[prefix];
		const pluginDeclaration = toCamelCase(pluginPath);
		return prefix === 'type'
			? `${prefix}: ${pluginDeclaration}.plugin as ${strTypePlugin},`
			: `${prefix}: ${pluginDeclaration} as unknown as ${strTypePlugin},`;
	}).join('\n'));

	output.push('},');

	return output.join('\n');
}

function insertPluginsString(output: string, plugins: string) {
	// set in 'parseExport'
	let regex = /"plugins".+,/;
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

function parseExports(
	input: FlatConfig,
	plugins: (keyof PluginPrefix)[],
) {
	if (plugins.length > 0) {
		input.plugins = {};
	}

	let output = `export default ${JSON.stringify(input, null, 2)} satisfies ${strTypeConfig};`;

	if (plugins.length === 0) {
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

export function parseSingleConfig(
	input: FlatConfig,
	folder: string,
	...plugins: (keyof PluginPrefix)[]
) {
	const config = sortConfigByKeys(input);
	return `${parseImports(folder, plugins)}\n${parseExports(config, plugins)}\n`;
}

export function parseConfigsIndex(
	input: UnknownRecord | Entries<UnknownRecord>,
) {
	const entries = (
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
}

export async function parseFile(notice: string, input: string) {
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
}

export default {
	config: parseSingleConfig,
	index: parseConfigsIndex,
	file: parseFile,
};
