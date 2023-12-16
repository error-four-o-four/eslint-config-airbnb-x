export const ECMA_VERSION = 2022;

export const SOURCE_TYPE = 'module';

// @todo get extensions based on installed package typescript
export const EXT_JS = ['.js', '.mjs'];
export const GLOB_JS = EXT_JS.map((ext) => `**/*${ext}`);

export const EXT_TS = ['.ts', '.mts'];
export const GLOB_TS = EXT_TS.map((ext) => `**/*${ext}`);

export const EXT_ALL = [...EXT_JS, ...EXT_TS];
export const GLOB_ALL = [...GLOB_JS, ...GLOB_TS];

export const pluginNames = {
	import: 'import',
	node: 'node',
	stylistic: 'stylistic',
	typescript: 'typescript',
};
