import { Rule } from 'eslint';

// @ts-expect-error missing types
import * as pluginImport from 'eslint-plugin-i';

// @ts-expect-error missing types
import pluginNode from 'eslint-plugin-n';

import pluginStylistic from '@stylistic/eslint-plugin';
import pluginTypescript from '@typescript-eslint/eslint-plugin';

import names from './names.ts';

import type {
	PluginNames, ConfigWithPlugin,
} from './types.ts';

const map = {
	import: 'import',
	node: 'node',
	stylistic: 'stylistic',
	typescript: 'typescript',
} as const;

const keys = Object.values(map);

const plugins = {
	[map.import]: pluginImport,
	[map.node]: pluginNode,
	[map.stylistic]: pluginStylistic,
	[map.typescript]: pluginTypescript,
} as const;

const rules = keys.reduce(
	(all, plugin) => Object.assign(all, {
		[plugin]: plugins[plugin].rules,
	}),
	{} as { [K in keyof typeof plugins]: Record<string, Rule.RuleModule> },
);

export { map as pluginNames, rules as pluginRules };

// 'imports' vs 'import' !!!
const configPluginMap: {
	[K in ConfigWithPlugin]: string;
} = {
	[names.config.node]: map.node,
	[names.config.imports]: map.import,
	[names.config.stylistic]: map.stylistic,
	[names.config.typescript]: map.typescript,
};

export function configHasPlugin(name: string): name is ConfigWithPlugin {
	return Object.keys(configPluginMap).includes(name);
}

export function getPlugin(name: ConfigWithPlugin) {
	return configPluginMap[name] as PluginNames;
}
