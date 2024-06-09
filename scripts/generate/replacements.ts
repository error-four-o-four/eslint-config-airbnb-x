import type { Linter, Rule } from 'eslint';

import type { PluginPrefix } from '../../src/globalTypes.ts';
import type { ConvertedConfigs } from '../shared/types/main.ts';

import { pluginPrefix } from '../../src/globalSetup.ts';

import rawMetaData from '../shared/raw.ts';

import { assertCondition } from '../shared/utils/assert.ts';
import { getPrefixedRule } from '../shared/utils/main.ts';

import { sourceConfig } from './setup.ts';
import { CustomConfigs } from './types.ts';
import { mapConfigKeys, mapPrefixToConfigKey } from './utils.ts';
import { getOverwrite, requiresOverwrite } from './overwrites.ts';

/** @todo */

/**
 * @NODE
 *
 * 'no-buffer-constructor': 'error', ❓ missing corresponding url/rule
 * 'no-restricted-modules': 'off', ❓ missing corresponding url/rule
 *
 * 'no-mixed-requires': ['off', false], @consider
 * Configuring this rule with one boolean option true is deprecated. ❗
 */

/**
 * @STYLE
 *
 * upgrade @stylistic/eslint and enable ❗
 * 'line-comment-position'
 * 'multiline-comment-style'
 */

// ❗ upgrade @stylistic/eslint and enable
// 'line-comment-position': ['off', {
// 	position: 'above',
// 	ignorePattern: '',
// 	applyDefaultPatterns: true,
// }],

// ❗ upgrade @stylistic
// 'multiline-comment-style': ['off', 'starred-block'],

// const replacements: Partial<
// 	Record<
// 		RuleProps['rule'],
// 		({ meta, value }: ReplacementOptions) => RuleProps
// 	>
// > = {
// 	'no-new-object': ({ meta }) => ({
// 		key: mapConfigKeys(meta.source),
// 		rule: 'no-object-constructor',
// 		value: 'error',
// 	}),

// 	/**
// 	 * also replaces
// 	 * 'no-spaced-func': 'error',
// 	 */
// 	'style/func-call-spacing': ({ value }) => ({
// 		key: 'style',
// 		rule: 'style/function-call-spacing',
// 		value,
// 	}),
// };

export type RuleItem = [string, Linter.RuleEntry];

type BaseProps = {
	unprefixed?: string,
	value: Linter.RuleEntry,
	source: keyof ConvertedConfigs
};

export type MaybeInvalidProps = BaseProps & {
	rule: string,
	meta: Rule.RuleMetaData | undefined,
};

export type RuleProps = BaseProps & {
	rule: keyof typeof sourceConfig.rules,
	meta: Rule.RuleMetaData,
};

export type ReplacedProps = RuleProps & {
	replacedBy: string,
	target: keyof CustomConfigs
};

function isValidSourceRule(rule: string): rule is keyof typeof sourceConfig.rules {
	return (rule in sourceConfig.rules);
}

function hasBeenReplaced(item: RuleProps): string | false {
	/**
	 * @note
	 * there's no need to replace the rule, when
	 * it's already included in 'eslint-config-airbnb-base'
	 * and its value is defined
	 *
	 * applies to
	 * 'no-native-reassign' => 'no-global-assign'
	 * 'no-negated-in-lhs' => 'no-unsafe-negation'
	 * 'no-catch-shadow' => 'no-shadow'
	 * 'lines-around-directive' \
	 * 'newline-after-var'			 \
	 * 'newline-before-return'		\ => 'padding-line-between-statements'
	 */

	if (!item.meta.replacedBy || item.meta.replacedBy.length === 0) {
		return false;
	}

	assertCondition(item.meta.replacedBy.length === 1);
	const replacedBy = item.meta.replacedBy[0];

	if (!isValidSourceRule(replacedBy)) {
		return false;
	}

	if (sourceConfig.rules[replacedBy]) {
		return replacedBy;
	}

	return false;
}

const aliases = {
	'no-new-object': 'no-object-constructor',
	'func-call-spacing': pluginPrefix.style + '/function-call-spacing',
};

const aliasedMap = new Map(Object.entries(aliases));
const replacementsMap = new Map<string, ReplacedProps>();

export function requiresReplacement(item: RuleProps) {
	const alias = aliasedMap.get(item.rule);

	if (alias) {
		item.meta.deprecated = true;

		const replacement: ReplacedProps = {
			...item,
			replacedBy: alias,
			target: mapConfigKeys(item.source),
		};

		/** @todo required ?? */
		if (requiresOverwrite(item)) {
			replacement.value = getOverwrite(item);
		}

		replacementsMap.set(item.rule, replacement);
		return true;
	}

	const replacedBy = hasBeenReplaced(item);

	if (replacedBy) {
		item.meta.deprecated = true;
		console.log(`'${item.rule}' has been deprecated in favour of '${replacedBy}'`);
		return false;
	}

	const plugins: (keyof PluginPrefix)[] = ['node', 'style'];
	const prefixes = plugins.reduce((all, plugin) => {
		if (rawMetaData[plugin].has(item.rule)) {
			all.push(plugin);
		}

		return all;
	}, [] as (keyof PluginPrefix)[]);

	assertCondition(prefixes.length <= 1, 'Expected no overlaps');

	if (prefixes.length === 1) {
		item.meta.deprecated = true;

		const prefix = prefixes[0];
		const replacement: ReplacedProps = {
			...item,
			replacedBy: getPrefixedRule(prefix, item.rule),
			target: mapPrefixToConfigKey(prefix),
		};

		if (requiresOverwrite(item)) {
			replacement.value = getOverwrite(item);
		}

		replacementsMap.set(item.rule, replacement);
		// console.log(`'${item.rule}' requires to be replaced by '${item.replacedBy}'`);
		return true;
	}

	return false;
}

export function getReplacement(item: RuleProps) {
	return replacementsMap.get(item.rule);
}
