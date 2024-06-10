import type {
	Entries, SetRequired, UnknownRecord,
} from 'type-fest';

import { merge } from 'ts-deepmerge';

import type {
	FlatConfig,
	FlatConfigWithRules,
	PluginPrefix,
} from '../globalTypes.ts';

// function hasOwnProperty<
// 	X extends {},
// 	Y extends PropertyKey,
// >(obj: X, prop: Y): obj is X & Record<Y, unknown> {
// 	return obj.hasOwnProperty(prop);
// }

// ##### String ops

export function toUpperCase(input: string) {
	return input.slice(0, 1).toUpperCase() + input.slice(1).toLowerCase();
}

export function toCamelCase(input: string) {
	const r = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
	const m = input.match(r);

	if (!m) return input;

	const s = Array.isArray(m)
		? m
			.map(toUpperCase)
			.join('')
		: input;

	return s.slice(0, 1).toLowerCase() + s.slice(1);
}

export function toKebabCase(input: string) {
	const r = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
	const m = input.match(r);

	if (!m) return input;

	return m
		.join('-')
		.toLowerCase();
}

export function getPrefixedRule<T extends string = string>(
	prefix: keyof PluginPrefix,
	rule: string,
) {
	return `${prefix}/${rule}` as T;
}

export const regExPrefixed = /\//;

export function getUnprefixedRule<T extends string>(rule: T) {
	return (regExPrefixed.test(rule)) ? rule.split('/')[1] : rule;
}

// ##### Verification

export function isPrefixedRule(rule: string) {
	return (regExPrefixed.test(rule));
}

export function narrowConfigWithOptions<
	T extends FlatConfig | FlatConfigWithRules,
>(config: T): config is T & SetRequired<T, 'languageOptions'> {
	const prop: keyof FlatConfig = 'languageOptions';
	return prop in config;
}

export function narrowConfigWithSettings<
	T extends FlatConfig | FlatConfigWithRules,
>(config: T): config is T & SetRequired<T, 'settings'> {
	const prop: keyof FlatConfig = 'settings';
	return prop in config;
}

// ##### Sorter

const sortByString = (a: string, b: string) => (a.toUpperCase() < b.toUpperCase()
	? -1
	: a > b
		? 1
		: 0);

export function reduceRecordByKeys<
	T extends UnknownRecord | FlatConfig,
>(record: T, keys: (keyof T)[]) {
	return keys.reduce((all, key) => ({
		...all,
		[key]: record[key],
	}), {});
}

export function sortRulesRecord<T extends FlatConfig['rules']>(record: T) {
	if (!record) {
		console.log('No rules were defined.');
		return {};
	}

	const builtin = Object.keys(record)
		.filter((key): key is keyof T & string => !regExPrefixed.test(key))
		.sort(sortByString);

	const prefixed = Object.keys(record)
		.filter((key): key is keyof T & string => regExPrefixed.test(key))
		.sort(sortByString);

	return {
		...reduceRecordByKeys(record, builtin),
		...reduceRecordByKeys(record, prefixed),
	};
}

export function sortConfigRules(config: FlatConfig) {
	if (!config.rules) return;

	config.rules = sortRulesRecord(config.rules);
}

const preferredOrder: (keyof FlatConfig)[] = [
	'name',
	'files',
	'ignores',
	'plugins',
	'processor',
	'languageOptions',
	'linterOptions',
	'settings',
	'rules',
];

export function sortConfigByKeys<T extends FlatConfig>(config: T) {
	return reduceRecordByKeys(config, preferredOrder);
}

export function mergeFlatConfigs(entries: Entries<Record<string, FlatConfig>>): FlatConfig {
	const result = entries.map((entry) => entry[1]).reduce((all, item) => {
		return merge(all, item);
	}, {});

	sortConfigByKeys(result);
	sortConfigRules(result);

	return result;
}
