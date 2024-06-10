import type { FileExtension } from 'eslint-plugin-import-x/types.js';

import pkg from '../package.json' assert { type: 'json' };

/**
 * @note
 * keep in sync with type declarations in './globalTypes.ts'
 * these are used by parse.config in './utils/parse.ts'
 */

/** @internal */
export const strTypeConfig = 'FlatConfig';

/** @internal */
export const strTypePlugin = 'ESLintPlugin';

/** @internal */
export const strTypeParser = 'ESLintParser';

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

type PickedPkgDeps = Pick<
	typeof pkg.dependencies,
	'eslint-plugin-import-x'
	| 'eslint-plugin-n'
	| '@stylistic/eslint-plugin'
	| 'typescript-eslint'
>;

type PkgDeps = {
	[K in keyof PickedPkgDeps]: K
};

type PluginPaths = {
	[K in keyof typeof pluginPrefix]: K extends 'import'
		? PkgDeps['eslint-plugin-import-x']
		: K extends 'node'
			? PkgDeps['eslint-plugin-n']
			: K extends 'style'
				? PkgDeps['@stylistic/eslint-plugin']
				: K extends 'type'
					? PkgDeps['typescript-eslint']
					: never;
};

export const pluginPaths: PluginPaths = {
	import: 'eslint-plugin-import-x',
	node: 'eslint-plugin-n',
	style: '@stylistic/eslint-plugin',
	type: 'typescript-eslint',
} as const;
