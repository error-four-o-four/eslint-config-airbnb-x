import type { Rule } from 'eslint';
import type { Entries } from 'type-fest';

import { assertNotNull } from '../utils/assert.ts';
import { regExPrefixed, getUnprefixedRule } from '../utils/helpers.ts';

import type { BasePluginPrefix, PluginPrefix } from '../globalTypes.ts';

import type {
	AirbnbRule,
	// AirbnbBuiltInRule,
	RuleItem,
	RuleProps,
	MaybeInvalidProps,
	SourceConfigs,
	TargetConfigs,
} from './types.ts';

import {
	airbnbConfig,
	sourceConfigs,
	sourceConfigKeys,
} from './setup.ts';

import rawMetaData from './metadata.ts';

export function narrowAirbnbRule(rule: string): rule is AirbnbRule {
	return (rule in airbnbConfig.rules);
}

// export function narrowBuiltInAirbnbRule(rule: string): rule is AirbnbBuiltInRule {
// 	return !regExPrefixed.test(rule);
// }

export function narrowRuleProps(item: MaybeInvalidProps): item is RuleProps {
	return narrowAirbnbRule(item.rule) && !!item.meta;
}

export function isBuiltInAirbnbRule(rule: string) {
	return !regExPrefixed.test(rule);
}

// #####

function getRuleMetaData(rule: string) {
	let ruleMetaData: Rule.RuleMetaData | undefined;

	if (isBuiltInAirbnbRule(rule)) {
		ruleMetaData = rawMetaData.eslint.get(rule);
	} else {
		const unprefixedRule = getUnprefixedRule(rule);
		ruleMetaData = rawMetaData.import.get(unprefixedRule);
	}

	return ruleMetaData;
}

function createRuleSourceConfigMap() {
	const result: Record<string, keyof SourceConfigs> = {};

	sourceConfigKeys
		.forEach((key) => {
			const config = sourceConfigs[key];

			if (!config.rules) return;

			Object.keys(config.rules)
				.forEach((rule) => result[rule] = key);
		});

	return new Map(Object.entries(result));
}

const ruleSourceConfigMap = createRuleSourceConfigMap();

function getSourceConfigsKey(rule: string) {
	const config = ruleSourceConfigMap.get(rule);

	if (config) return config;

	throw new Error(`Could not find corresponding 'keyof ConvertedConfigs' of '${rule}'`);
}

export function getRuleProps([rule, value]: RuleItem): MaybeInvalidProps {
	const meta = getRuleMetaData(rule);
	const source = getSourceConfigsKey(rule);

	const result: MaybeInvalidProps = {
		rule,
		meta,
		value,
		source,
	};

	if (!isBuiltInAirbnbRule(rule)) {
		result.unprefixed = getUnprefixedRule(rule);
	}

	return result;
}

// #####

export function getTargetFromSourceKey(
	key: keyof SourceConfigs,
): keyof TargetConfigs {
	return (key === 'es6' ? 'es2022' : key);
}

type TargetConfigsWithPlugin = Pick<
	TargetConfigs,
	'imports' | 'node' | 'style'
>;

type TargetConfigsWithPluginEnum = {
	[K in keyof TargetConfigsWithPlugin]: K
};

type PrefixTargetConfigMap = {
	[K in keyof BasePluginPrefix]: K extends 'import'
		? TargetConfigsWithPluginEnum['imports']
		: K extends 'node'
			? TargetConfigsWithPluginEnum['node']
			: K extends 'style'
				? TargetConfigsWithPluginEnum['style']
				: never
};

const prefixTargetConfigMap: PrefixTargetConfigMap = {
	import: 'imports',
	node: 'node',
	style: 'style',
} as const;

export function getTargetKeyFromPrefix(
	prefix: keyof BasePluginPrefix,
) {
	return prefixTargetConfigMap[prefix];
}

const targetKeysWithPluginSet = new Set(Object.values(prefixTargetConfigMap));

export function narrowTargetKeyWithPlugin<
	K extends keyof TargetConfigsWithPlugin,
>(
	key: keyof TargetConfigs,
): key is K {
	return targetKeysWithPluginSet.has(key as K);
}

export function getPrefixFromTargetKey(
	key: keyof TargetConfigsWithPlugin,
): keyof PluginPrefix {
	const entry = (
		Object.entries(prefixTargetConfigMap) as Entries<PrefixTargetConfigMap>
	)
		.find((entry) => entry[1] === key);

	assertNotNull(entry);

	return entry[0];
}
