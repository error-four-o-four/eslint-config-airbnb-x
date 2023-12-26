import pluginImport from 'eslint-plugin-i';
import pluginNode from 'eslint-plugin-n';
import pluginStylistic from '@stylistic/eslint-plugin';

import baseMixed from './configs/merged/base-mixed.js';

import {
	GLOBS_JS, GLOBS_TS, pluginNames, tsExists,
} from './constants.js';

// add plugins
baseMixed.plugins = {
	[pluginNames.import]: pluginImport,
	[pluginNames.node]: pluginNode,
	[pluginNames.stylistic]: pluginStylistic,
};

export default async (...overrides) => {
	if (!tsExists) {
		const baseJS = (await import('./configs/merged/base-js.js')).default;
		return [baseMixed, baseJS, ...overrides];
	}

	const pluginTS = (await import('@typescript-eslint/eslint-plugin')).default;
	const parserTS = (await import('@typescript-eslint/parser')).default;
	const baseTS = (await import('./configs/merged/base-ts.js')).default;

	// apply files
	baseMixed.files = [...GLOBS_JS, ...GLOBS_TS];

	baseTS.files = GLOBS_TS;
	baseTS.plugins = {
		[pluginNames.typescript]: pluginTS,
	};

	baseTS.languageOptions.parser = parserTS;

	return [baseMixed, baseTS, ...overrides];
};
