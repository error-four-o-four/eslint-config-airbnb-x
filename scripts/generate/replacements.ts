import type { Linter } from 'eslint';

import type {
	ConvertedConfigs,
	MetaDataProps,
} from '../shared/types.ts';

import type {
	RuleProps,
	ReplacementOptions,
} from './types.ts';

import { assertNotNull } from '../shared/utils.ts';
import { mapConfigKeys, verify } from './utils.ts';

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

const replacements: Partial<
	Record<
		RuleProps['rule'],
		({ meta, value }: ReplacementOptions) => RuleProps
	>
> = {
	'no-new-object': ({ meta }) => {
		assertNotNull(meta);

		return {
			key: mapConfigKeys(meta.source),
			rule: 'no-object-constructor',
			value: 'error',
		};
	},

	/**
	 * also replaces
	 * 'no-spaced-func': 'error',
	 */
	'style/func-call-spacing': ({ value }) => {
		assertNotNull(value);

		return {
			key: 'style',
			rule: 'style/function-call-spacing',
			value,
		};
	},
};

export function hasBeenReplaced(
	rule: string,
	meta: MetaDataProps,
	sourceConfigs: ConvertedConfigs,
): RuleProps | null {
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

	assertNotNull(meta.replacedBy);

	const [replacedBy] = meta.replacedBy;
	assertNotNull(replacedBy);

	const sourceKeys = Object.keys(sourceConfigs) as (keyof ConvertedConfigs)[];

	const matchedKey = sourceKeys.reduce((
		result: undefined | keyof ConvertedConfigs,
		key,
	) => {
		if (result) return result;

		const source = sourceConfigs[key];
		assertNotNull(source.rules);

		if (replacedBy in source.rules) {
			return key;
		}

		return result;
	}, undefined);

	if (!matchedKey) {
		return null;
	}

	const matchedSource = sourceConfigs[matchedKey];
	assertNotNull(matchedSource.rules);

	const matchedValue = matchedSource.rules[rule];

	if (!matchedValue) {
		return null;
	}

	console.log(`'${rule}' has already been replaced by '${replacedBy}' in '${matchedKey}'`);
	// console.log(matchedValue, '\n');

	return {
		key: mapConfigKeys(matchedKey),
		rule: replacedBy as RuleProps['rule'],
		value: matchedValue,
	};
}

const keys = Object.keys(replacements);

export function requiresReplacement(rule: string) {
	return keys.includes(rule as RuleProps['rule']);
}

export function getReplacement(
	rule: string,
	meta: MetaDataProps,
	value: Linter.RuleEntry,
): RuleProps {
	const isEslintRule = verify.isESLintRule(rule);
	const isPluginRule = verify.isPluginRule(rule);

	if (!isEslintRule && !isPluginRule) {
		throw new Error(`Expected valid rule - '${rule}' is invalid`);
	}

	const fn = replacements[rule];

	if (!fn) {
		throw new Error(`Expected replacement for '${rule}' to be defined`);
	}

	const result = fn({
		meta,
		value,
	});

	console.log(`Replaced '${rule}' by '${result.rule}' in '${result.key}'`);
	// console.log(result.value, '\n');

	return result;
}
