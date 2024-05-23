import type { Linter } from 'eslint';

import pluginImport from 'eslint-plugin-import-x';
import pluginNode from 'eslint-plugin-n';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginTypescript from '@typescript-eslint/eslint-plugin';

import parser from '@typescript-eslint/parser';

import { pluginPrefix } from '../scripts/setupGlobal.ts';

import configs from './configs/custom/index.ts';

// @ts-expect-error
configs.imports.plugins = { [pluginPrefix.import]: pluginImport };
configs.node.plugins = { [pluginPrefix.node]: pluginNode };
// @ts-expect-error
configs.style.plugins = { [pluginPrefix.style]: pluginStylistic };
// @ts-expect-error
configs.typescript.plugins = { [pluginPrefix.type]: pluginTypescript };
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
	typescript,
};

export default configs;
