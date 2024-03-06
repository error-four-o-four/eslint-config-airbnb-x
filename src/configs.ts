import { Linter } from 'eslint';

import parser from '@typescript-eslint/parser';

import configs from './configs/custom/index.ts';

import plugins, { pluginPrefix } from './plugins.ts';

configs.imports.plugins = { [pluginPrefix.import]: plugins.import };
configs.node.plugins = { [pluginPrefix.node]: plugins.node };
configs.stylistic.plugins = { [pluginPrefix.stylistic]: plugins.stylistic };
configs.typescript.plugins = { [pluginPrefix.typescript]: plugins.typescript };
configs.typescript.languageOptions!.parser = parser as Linter.ParserModule;

const {
	bestPractices,
	errors,
	node,
	style,
	variables,
	es2022,
	imports,
	strict,
	disableLegacy,
	stylistic,
	typescript,
} = configs;

export {
	bestPractices,
	errors,
	node,
	style,
	variables,
	es2022,
	imports,
	strict,
	disableLegacy,
	stylistic,
	typescript,
};

export default configs;
