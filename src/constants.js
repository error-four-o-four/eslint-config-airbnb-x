import { isPackageExists } from 'local-pkg';

export const ECMA_VERSION = 2022;
export const SOURCE_TYPE = 'module';

export const tsExists = isPackageExists('typescript');

const EXT_JS = ['.js', '.mjs'];
const EXT_TS = ['.ts', '.mts'];

export const GLOBS_JS = EXT_JS.map((ext) => `**/*${ext}`);
export const GLOBS_TS = EXT_TS.map((ext) => `**/*${ext}`);

// @todo check if react exists

/** @type {import('../shared/types.d.ts').PluginNames} */
export const pluginNames = {
	import: 'import',
	node: 'node',
	stylistic: 'stylistic',
	typescript: 'typescript',
};
