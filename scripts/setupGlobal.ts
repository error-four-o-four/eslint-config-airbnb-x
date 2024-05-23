import type { FileExtension } from 'eslint-plugin-import-x/types.js';

export const ECMA_VERSION = 2022;
export const SOURCE_TYPE = 'module';

export const EXTS_JS: readonly FileExtension[] = ['.js', '.mjs'];
export const EXTS_TS: readonly FileExtension[] = ['.ts', '.mts'];
export const EXTS_MIXED = [...EXTS_JS, ...EXTS_TS];

export const pluginPrefix = {
	import: 'import',
	node: 'node',
	style: 'style',
	type: 'type',
} as const;
