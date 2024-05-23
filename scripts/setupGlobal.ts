import type { FileExtension } from 'eslint-plugin-import-x/types.js';

export const ECMA_VERSION = 2022;
export const SOURCE_TYPE = 'module';

export const EXTS_JS: readonly FileExtension[] = [
	'.js',
	'.mjs',
	'.cjs',
];
export const EXTS_TS: readonly FileExtension[] = [
	'.ts',
	'.mts',
	'.cts',
];
export const EXTS_MIXED = [...EXTS_JS, ...EXTS_TS];

export const GLOBS_JS = EXTS_JS.map((ext) => `**/*${ext}`);
export const GLOBS_TS = EXTS_TS.map((ext) => `**/*${ext}`);
export const GLOBS_MIXED = [...GLOBS_JS, ...GLOBS_TS];

export const pluginPrefix = {
	import: 'import',
	node: 'node',
	style: 'style',
	type: 'type',
} as const;
