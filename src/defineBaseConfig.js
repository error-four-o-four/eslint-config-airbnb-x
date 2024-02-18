import * as pluginImport from 'eslint-plugin-i';
import pluginNode from 'eslint-plugin-n';
import pluginStylistic from '@stylistic/eslint-plugin';

import baseMixed from './configs/merged/base-mixed.js';
import baseJS from './configs/merged/base-js.js';

import {
	GLOBS_JS, GLOBS_TS, pluginNames, tsExists,
} from './constants.js';

const interopDefault = async (m) => {
	const resolved = await m;
	return resolved.default || resolved;
};

// add plugins
baseMixed.plugins = {
	[pluginNames.import]: pluginImport,
	[pluginNames.node]: pluginNode,
	[pluginNames.stylistic]: pluginStylistic,
};

/** @typedef {import('../shared/types.d.ts').FlatConfig} FlatConfig */
/** @typedef {import('../shared/types.d.ts').NamedFlatConfig} NamedFlatConfig */

/**
 * @param {FlatConfig[]} overrides
 * @returns {[NamedFlatConfig | FlatConfig]}
 */
export default async (...overrides) => {
	if (!tsExists) {
		return [baseMixed, baseJS, ...overrides];
	}

	const [pluginTS, parserTS] = await Promise.all(
		['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'].map(
			(src) => interopDefault(import(src)),
		),
	);

	// https://esbuild.github.io/api/#glob !!!
	const baseTS = await interopDefault(import('./configs/merged/base-ts.js'));

	// apply files
	baseMixed.files = [...GLOBS_JS, ...GLOBS_TS];

	baseJS.files = GLOBS_JS;
	baseTS.files = GLOBS_TS;

	baseTS.plugins = {
		[pluginNames.typescript]: pluginTS,
	};

	baseTS.languageOptions.parser = parserTS;

	return [baseMixed, baseJS, baseTS, ...overrides];
};
