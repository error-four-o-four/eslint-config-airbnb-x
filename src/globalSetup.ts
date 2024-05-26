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

export const EXTS_DTS: readonly FileExtension[] = ['.d.ts'];

export const EXTS_MIXED = [
	...EXTS_JS,
	...EXTS_TS,
	...EXTS_DTS,
];

export const GLOBS_JS = EXTS_JS.map((ext) => `**/*${ext}`);
export const GLOBS_TS = EXTS_TS.map((ext) => `**/*${ext}`);
export const GLOBS_MIXED = [...GLOBS_JS, ...GLOBS_TS];

export const pluginPrefix = {
	import: 'import',
	node: 'node',
	style: 'style',
	type: 'type',
} as const;

export const pluginNames: Record<
	'eslint' | keyof typeof pluginPrefix,
	string
> = {
	eslint: 'ESLint',
	import: 'ImportX',
	node: 'Node',
	style: 'Stylistic',
	type: 'TypeScript',
} as const;

export const pluginPaths: Record<
	keyof typeof pluginPrefix,
	string
> = {
	import: 'eslint-plugin-import-x',
	node: 'eslint-plugin-n',
	style: '@stylistic/eslint-plugin',
	type: '@typescript-eslint/eslint-plugin',
} as const;
