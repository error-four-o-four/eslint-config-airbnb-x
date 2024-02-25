import type { ESLint } from 'eslint';

import {
	pluginPrefix,
	pluginPrefixValues,
} from '../../src/plugins.ts';

import {
	ImportRulesUnprefixed,
	NodeRulesUnprefixed,
	StylisticRulesUnprefixed,
	TypescriptRulesUnprefixed,
} from './rules.ts';

export type PluginPrefix = (typeof pluginPrefixValues)[number];

export type PluginPrefixImport = keyof Pick<typeof pluginPrefix, 'import'>;

export type PluginPrefixNotTS = keyof Omit<typeof pluginPrefix, 'typescript'>;

export interface PluginImport extends ESLint.Plugin {
	configs: Record<string, any>
	rules: Record<keyof ImportRulesUnprefixed, any>
}

export interface PluginNode extends ESLint.Plugin {
	meta: Record<string, any>
	configs: Record<string, any>
	rules: Record<keyof NodeRulesUnprefixed, any>
}

export interface PluginStylistic extends ESLint.Plugin {
	configs: Record<string, any>
	rules: Record<keyof StylisticRulesUnprefixed, any>
}

export interface PluginTypescript extends ESLint.Plugin {
	configs: Record<string, any>
	rules: Record<keyof TypescriptRulesUnprefixed, any>
}
