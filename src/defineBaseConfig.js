import * as pluginImport from 'eslint-plugin-i';
import pluginNode from 'eslint-plugin-n';
import pluginStylistic from '@stylistic/eslint-plugin';

import baseMixed from './configs/merged/base-mixed.js';

import {
	GLOBS_JS, GLOBS_TS, pluginNames, tsExists,
} from './constants.js';

const interopDefault = async (m) => {
	const resolved = await m;
	return (resolved).default || resolved;
};

// add plugins
baseMixed.plugins = {
	[pluginNames.import]: pluginImport,
	[pluginNames.node]: pluginNode,
	[pluginNames.stylistic]: pluginStylistic,
};

/**
 * @param {import('eslint').Linter.FlatConfig[]} overrides
 * @returns {[import('../shared/types.d.ts').NamedFlatConfig | import('eslint').Linter.FlatConfig]}
 */
export default async (...overrides) => {
	if (!tsExists) {
		const baseJS = (await import('./configs/merged/base-js.js')).default;
		return [baseMixed, baseJS, ...overrides];
	}

	const [
		pluginTS,
		parserTS,
		baseTS,
	] = await Promise.all([
		'@typescript-eslint/eslint-plugin',
		'@typescript-eslint/parser',
		'./configs/merged/base-ts.js',
	].map((value) => interopDefault(import(value))));

	// apply files
	baseMixed.files = [...GLOBS_JS, ...GLOBS_TS];

	baseTS.files = GLOBS_TS;
	baseTS.plugins = {
		[pluginNames.typescript]: pluginTS,
	};

	baseTS.languageOptions.parser = parserTS;

	return [baseMixed, baseTS, ...overrides];
};
