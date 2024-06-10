import type { ESLint, Rule } from 'eslint';

import { builtinRules } from 'eslint/use-at-your-own-risk';
import pluginNode from 'eslint-plugin-n';
import pluginImport from 'eslint-plugin-import-x';
import pluginStylistic from '@stylistic/eslint-plugin';
import { plugin as pluginTypescript } from 'typescript-eslint';

import { assertIsRecord, assertNotNull } from '../utils/assert.ts';

import type { RawMetaData } from './types.ts';

// @ts-expect-error incompatible type
const importRules: ESLint.Plugin['rules'] = pluginImport.rules;
const nodeRules: ESLint.Plugin['rules'] = pluginNode.rules;

// @ts-expect-error Property 'rules' does not exist on type
const stylisticRules: ESLint.Plugin['rules'] = pluginStylistic.rules;
// @ts-expect-error incompatible type - Record<string, LooseRuleDefinition> | undefined
const typescriptRules: ESLint.Plugin['rules'] = pluginTypescript.rules;

// #####

const createEslintMap = (source: Map<string, Rule.RuleModule>) => {
	const entries = Array.from(source).map(([rule, item]) => {
		const error = `'${rule}' - Expected 'Rule.RuleMetaData' to be not null`;
		const { meta } = item;
		assertNotNull(meta, error);

		return [rule, meta] as [string, Rule.RuleMetaData];
	});

	return new Map(entries);
};

const createPluginMap = (rules: ESLint.Plugin['rules']) => {
	assertNotNull(rules);

	const data = Object.entries(rules).map(([rule, item]) => {
		assertIsRecord(item, `'${rule}' - Expected 'Rule.RuleModule' - saw 'function'`);
		assertNotNull(item.meta, `'${rule}' Expected 'Rule.RuleMetaData' to be not null`);

		return [rule, item.meta] as [string, Rule.RuleMetaData];
	});

	return new Map(data);
};

const rawMetaData = {
	eslint: createEslintMap(builtinRules),
	import: createPluginMap(importRules),
	node: createPluginMap(nodeRules),
	style: createPluginMap(stylisticRules),
	type: createPluginMap(typescriptRules),
} as RawMetaData;

export default rawMetaData;
