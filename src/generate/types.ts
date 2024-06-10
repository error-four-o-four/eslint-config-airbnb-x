import type { Linter, Rule } from 'eslint';

/** @note created with 'node:compat' */
import airbnbConfig from '../../lib/configs/merged/compat.ts';
import sourceConfigs from '../../lib/configs/compat/index.ts';

import type { FlatConfigWithRules } from '../globalTypes.ts';

import { pluginNames } from '../globalSetup.ts';

import { targetConfigKeys } from './setup.ts';

// #####

export type SourceConfigs = typeof sourceConfigs;

export type TargetConfigs = Record<
	(typeof targetConfigKeys)[number],
	FlatConfigWithRules
>;

// #####

export type RawMetaData = Readonly<
	Record<
		keyof typeof pluginNames,
		Map<string, Rule.RuleMetaData>
	>
>;

export type AirbnbRule = keyof typeof airbnbConfig.rules;

// export type AirbnbBuiltInRule = AirbnbRule extends infer U
// 	? U extends `${string}/${string}` ? never : U : never;

// #####

export type RuleItem = [string, Linter.RuleEntry];

type BaseProps = {
	unprefixed?: string,
	value: Linter.RuleEntry,
	source: keyof SourceConfigs;
};

export type MaybeInvalidProps = BaseProps & {
	rule: string,
	meta: Rule.RuleMetaData | undefined,
};

export type RuleProps = BaseProps & {
	rule: AirbnbRule,
	meta: Rule.RuleMetaData,
};

export type ReplacedProps = RuleProps & {
	replacedBy: string,
	target: keyof TargetConfigs;
};
