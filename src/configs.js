import * as pluginImport from 'eslint-plugin-i';
import pluginNode from 'eslint-plugin-n';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginTypescript from '@typescript-eslint/eslint-plugin';

import parserTypescript from '@typescript-eslint/parser';

import bestPractices from './configs/custom/best-practices.js';
import errors from './configs/custom/errors.js';
import node from './configs/custom/node.js';
import style from './configs/custom/style.js';
import variables from './configs/custom/variables.js';
import es2022 from './configs/custom/es2022.js';
import imports from './configs/custom/imports.js';
import strict from './configs/custom/strict.js';
import disableLegacy from './configs/custom/disable-legacy.js';
import stylistic from './configs/custom/stylistic.js';
import typescript from './configs/custom/typescript.js';

import { pluginNames } from './constants.js';

imports.plugins = {
	[pluginNames.import]: pluginImport,
};

node.plugins = {
	[pluginNames.node]: pluginNode,
};

stylistic.plugins = {
	[pluginNames.stylistic]: pluginStylistic,
};

typescript.plugins = {
	[pluginNames.typescript]: pluginTypescript,
};

typescript.languageOptions.parser = parserTypescript;

const configs = {
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
