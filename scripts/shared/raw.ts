import type { ESLint, Rule } from 'eslint';

import { Linter } from 'eslint';

import pluginNode from 'eslint-plugin-n';
import pluginImport from 'eslint-plugin-import-x';
import pluginStylistic from '@stylistic/eslint-plugin';
import pluginTypescript from '@typescript-eslint/eslint-plugin';

import type { RawMetaData } from './types/main.ts';

import { assertNotNull } from './utils.ts';

const eslintRules = new Linter().getRules();

const createEslintMap = (source: Map<string, Rule.RuleModule>) => {
	const entries = Array.from(source).map(([rule, item]) => {
		const error = `'${rule}' - Expected 'Rule.RuleMetaData' to be not null`;
		const { meta } = item;
		assertNotNull(meta, error);

		return [rule, meta] as [string, Rule.RuleMetaData];
	});

	return new Map(entries);
};

const createPluginMap = ({ rules }: ESLint.Plugin) => {
	assertNotNull(rules);

	const data = Object.entries(rules).map(([rule, item]) => {
		let error: string;

		if (typeof item === 'function') {
			error = `'${rule}' - Expected 'Rule.RuleModule' - saw 'function'`;
			throw new Error(error);
		}

		const { meta } = item;

		if (meta === null || meta === undefined) {
			error = `'${rule}' Expected 'Rule.RuleMetaData' to be not null`;
			throw new Error(error);
		}

		return [rule, meta] as [string, Rule.RuleMetaData];
	});

	return new Map(data);
};

const rawMetaData = {
	eslint: createEslintMap(eslintRules),
	// @ts-expect-error
	import: createPluginMap(pluginImport),
	node: createPluginMap(pluginNode),
	// @ts-expect-error
	style: createPluginMap(pluginStylistic),
	// @ts-expect-error
	type: createPluginMap(pluginTypescript),
} as RawMetaData;

export default rawMetaData;
