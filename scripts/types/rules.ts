import type { Linter } from 'eslint';

import {
	Prefix,
	Unprefix,
	ImportRules as ImportRulesAntfu,
	NodeRules as NodeRulesAntfu,
	TypeScriptRules as TypeScriptRulesAntfu,
} from '@antfu/eslint-define-config';

import type { UnprefixedRuleOptions as StylisticRulesUnprefixed } from '@stylistic/eslint-plugin';

import type { AirbnbConfigKeys } from './configs.ts';

import type {
	PluginPrefixImport,
	PluginPrefixNotTS,
} from './plugins.ts';

export type ImportRulesUnprefixed = Unprefix<ImportRulesAntfu, 'import/'>;
export type ImportRules = Prefix<ImportRulesUnprefixed, 'import/'>;

export type NodeRulesUnprefixed = Unprefix<NodeRulesAntfu, 'node/'>;
export type NodeRules = Prefix<NodeRulesUnprefixed, 'node/'>;

export type TypescriptRulesUnprefixed = Unprefix<TypeScriptRulesAntfu, '@typescript-eslint/'>;
export type TypescriptRules = Prefix<TypescriptRulesUnprefixed, 'typescript/'>;

export { StylisticRulesUnprefixed };
export type StylisticRules = Prefix<StylisticRulesUnprefixed, 'stylistic/'>;

export type ApprovedMeta = {
	deprecated: false;
	config: AirbnbConfigKeys;
	plugin?: PluginPrefixImport;
};

export type DeprecatedMeta = {
	deprecated: true;
	config: AirbnbConfigKeys;
	plugin?: PluginPrefixNotTS;
	replacedBy?: string;
	url?: string;
};

// @todo union
export type ProcessedRule<T = ApprovedMeta | DeprecatedMeta> = {
	meta: T;
	name: string;
	value: Linter.RuleEntry;
};
