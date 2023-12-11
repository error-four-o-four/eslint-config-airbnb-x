import * as pluginImport from 'eslint-plugin-i';
import pluginNode from 'eslint-plugin-n';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginTypescript from '@typescript-eslint/eslint-plugin';

const keys = {
	i: 'import',
	n: 'node',
	s: 'stylistic',
	ts: 'typescript',
};

export { keys as pluginNames };

export const plugins = {
	[keys.i]: pluginImport,
	[keys.n]: pluginNode,
	[keys.s]: pluginStylistic,
	[keys.ts]: pluginTypescript,
};
