import * as pluginImport from 'eslint-plugin-i';
import pluginNode from 'eslint-plugin-n';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginTypescript from '@typescript-eslint/eslint-plugin';

const keys = {
	import: 'import',
	node: 'node',
	stylistic: 'stylistic',
	typescript: 'typescript',
};

export { keys as pluginNames };

export const plugins = {
	[keys.import]: pluginImport,
	[keys.node]: pluginNode,
	[keys.stylistic]: pluginStylistic,
	[keys.typescript]: pluginTypescript,
};
