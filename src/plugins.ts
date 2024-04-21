import eslintPluginImport from 'eslint-plugin-import-x';
import eslintPluginNode from 'eslint-plugin-n';
import eslintPluginStylistic from '@stylistic/eslint-plugin';
import eslintPluginTypescript from '@typescript-eslint/eslint-plugin';

import type {
	PluginImport,
	PluginNode,
	PluginStylistic,
	PluginTypescript,
} from '../scripts/types/plugins.ts';

const pluginPrefix = {
	import: 'import',
	node: 'node',
	stylistic: 'stylistic',
	typescript: 'typescript',
} as const;

const pluginPrefixValues = Object.values(pluginPrefix);

const pluginImport = eslintPluginImport as PluginImport;
const pluginNode = eslintPluginNode as PluginNode;
const pluginStylistic = eslintPluginStylistic as unknown as PluginStylistic;
const pluginTypescript = eslintPluginTypescript as PluginTypescript;

export {
	pluginPrefix,
	pluginPrefixValues,
	pluginImport,
	pluginNode,
	pluginStylistic,
	pluginTypescript,
};

export default {
	import: pluginImport,
	node: pluginNode,
	stylistic: pluginStylistic,
	typescript: pluginTypescript,
} as const;

// Object.keys(plugins).forEach((key) => {
// 	const p = plugins[key as keyof typeof plugins];
// 	console.log(Object.keys(p));
// });

// export default plugins;
