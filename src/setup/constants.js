import { isPackageExists } from 'local-pkg';

export const ECMA_VERSION = 2022;
export const SOURCE_TYPE = 'module';

export const tsExists = isPackageExists('typescript');

const EXT_JS = ['.js', '.mjs'];
const EXT_TS = ['.ts', '.mts'];
const EXT_ALL = [...EXT_JS, ...EXT_TS];

export const EXTS = tsExists ? EXT_ALL : EXT_JS;
export const GLOBS = EXTS.map((ext) => `**/*${ext}`);

export const GLOB_TS = EXT_TS.map((ext) => `**/*${ext}`);

// console.log(tsExists, EXTS);

// @todo check if react exists

export const pluginNames = {
	import: 'import',
	node: 'node',
	stylistic: 'stylistic',
	typescript: 'typescript',
};
