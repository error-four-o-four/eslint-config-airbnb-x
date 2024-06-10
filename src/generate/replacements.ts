import type { BasePluginPrefix } from '../../src/globalTypes.ts';

import { pluginPrefix } from '../../src/globalSetup.ts';

import { assertCondition } from '../utils/assert.ts';
import { getPrefixedRule } from '../utils/helpers.ts';

import type {
	AirbnbRule,
	ReplacedProps,
	RuleProps,
} from './types.ts';

import rawMetaData from './metadata.ts';

import { airbnbConfig } from './setup.ts';
import { getOverwrite, hasOverwrite } from './overwrites.ts';

import {
	getTargetFromSourceKey,
	getTargetKeyFromPrefix,
	narrowAirbnbRule,
} from './utils.ts';

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

	if (!narrowAirbnbRule(replacedBy)) {
		return false;
	}

	if (airbnbConfig.rules[replacedBy]) {
		return replacedBy;
	}

	return false;
}

const aliases = {
	'no-new-object': 'no-object-constructor',
	'func-call-spacing': pluginPrefix.style + '/function-call-spacing',
};

const aliasedMap = new Map(Object.entries(aliases));

const replacementsMap = new Map<AirbnbRule, ReplacedProps>();

export function getReplacement(item: RuleProps) {
	return replacementsMap.get(item.rule);
}

function setReplacement(item: ReplacedProps) {
	replacementsMap.set(item.rule, item);
}

function handleAliasedRule(alias: string, item: RuleProps) {
	item.meta.deprecated = true;

	const replacement: ReplacedProps = {
		...item,
		replacedBy: alias,
		target: getTargetFromSourceKey(item.source),
	};

	if (hasOverwrite(item)) {
		replacement.value = getOverwrite(item);
	}

	setReplacement(replacement);
}

function handleReplacedByRule(replacedBy: string, item: RuleProps) {
	item.meta.deprecated = true;
	console.log(`'${item.rule}' has been deprecated in favour of '${replacedBy}'`);
}

function handlePluginRule(prefix: keyof BasePluginPrefix, item: RuleProps) {
	item.meta.deprecated = true;

	const replacement: ReplacedProps = {
		...item,
		replacedBy: getPrefixedRule(prefix, item.rule),
		target: getTargetKeyFromPrefix(prefix),
	};

	if (hasOverwrite(item)) {
		replacement.value = getOverwrite(item);
	}

	setReplacement(replacement);
	// console.log(`'${item.rule}' requires to be replaced by '${item.replacedBy}'`);
}

export function hasReplacement(item: RuleProps) {
	const alias = aliasedMap.get(item.rule);

	if (alias) {
		handleAliasedRule(alias, item);
		return true;
	}

	const replacedBy = hasBeenReplaced(item);

	if (replacedBy) {
		handleReplacedByRule(replacedBy, item);
		return false;
	}

	const plugins: (keyof BasePluginPrefix)[] = ['node', 'style'];
	const prefixes = plugins.reduce((all, plugin) => {
		if (rawMetaData[plugin].has(item.rule)) {
			all.push(plugin);
		}

		return all;
	}, [] as (keyof BasePluginPrefix)[]);

	assertCondition(prefixes.length <= 1, 'Expected no overlaps');

	if (prefixes.length === 1) {
		handlePluginRule(prefixes[0], item);
		return true;
	}

	return false;
}
