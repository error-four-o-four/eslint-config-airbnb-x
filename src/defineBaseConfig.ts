import { isPackageExists } from 'local-pkg';

import pluginImport from 'eslint-plugin-import-x';
import pluginNode from 'eslint-plugin-n';
import pluginStyle from '@stylistic/eslint-plugin';

import type { FlatConfig } from './globalTypes.ts';

import {
	GLOBS_JS,
	GLOBS_TS,
	GLOBS_MIXED,
	pluginPrefix,
} from './globalSetup.ts';

import base from './configs/merged/base.ts';
import baseJs from './configs/merged/base-js.ts';

const tsExists = isPackageExists('typescript');

// https://github.com/antfu/eslint-config/blob/main/src/utils.ts
const interopDefault = async <T>(
	m: Awaitable<T>,
): Promise<T extends { default: infer U; } ? U : T> => {
	const resolved = await m;
	return (resolved as any).default || resolved;
};

type Awaitable<T> = T | Promise<T>;

export default async (...overrides: FlatConfig[]) => {
	if (!tsExists) {
		base.files = GLOBS_JS;
		base.plugins = {
			// @ts-expect-error
			[pluginPrefix.import]: pluginImport,
			[pluginPrefix.node]: pluginNode,
			// @ts-expect-error
			[pluginPrefix.style]: pluginStyle,
		};

		baseJs.files = GLOBS_JS;

		return [
			base,
			baseJs,
			...overrides,
		];
	}

	base.files = GLOBS_MIXED;
	baseJs.files = GLOBS_JS;

	const [pluginTS, parserTS] = await Promise.all(
		['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'].map((src) => interopDefault(import(src))),
	);

	// https://esbuild.github.io/api/#glob !!!
	const baseTs = await interopDefault(import('./configs/merged/base-ts.ts'));
	const baseTsOnly = await interopDefault(import('./configs/merged/base-ts-only.ts'));

	base.plugins = {
		// @ts-expect-error
		[pluginPrefix.import]: pluginImport,
		[pluginPrefix.node]: pluginNode,
		// @ts-expect-error
		[pluginPrefix.style]: pluginStyle,
		[pluginPrefix.type]: pluginTS
	};

	baseTs.files = GLOBS_MIXED;
	// baseTs.plugins = { [pluginPrefix.type]: pluginTS };

	baseTs.languageOptions!.parser = parserTS;
	baseTs.languageOptions!.parserOptions!.tsconfigPath = process.cwd();

	baseTsOnly.files = GLOBS_TS;

	return [
		base,
		baseJs,
		baseTs,
		baseTsOnly,
		...overrides,
	];
};
