import { Linter } from 'eslint';

import parserTypescript from '@typescript-eslint/parser';

import plugins, { pluginPrefix } from './plugins.ts';
import configs from './configs/custom/index.ts';

configs.imports.plugins = { [pluginPrefix.import]: plugins.import };

configs.node.plugins = { [pluginPrefix.node]: plugins.node };

configs.stylistic.plugins = { [pluginPrefix.stylistic]: plugins.stylistic };

configs.typescript.plugins = { [pluginPrefix.typescript]: plugins.typescript };

if (!configs.typescript.languageOptions) throw new Error('languageOptions does not exist on typescript.');

configs.typescript.languageOptions.parser = parserTypescript as Linter.ParserModule;

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
