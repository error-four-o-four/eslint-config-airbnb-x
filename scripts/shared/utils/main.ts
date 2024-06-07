import type { UnknownRecord } from 'type-fest';
import type { PluginPrefix } from '../types/main.ts';
import { FlatConfig } from '../../../src/globalTypes.ts';

// function hasOwnProperty<
// 	X extends {},
// 	Y extends PropertyKey,
// >(obj: X, prop: Y): obj is X & Record<Y, unknown> {
// 	return obj.hasOwnProperty(prop);
// }

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

export function isBuiltinRule(rule: string) {
	return !regExPrefixed.test(rule);
}

export function isPrefixed(rule: string) {
	return (regExPrefixed.test(rule));
}

export function getPrefixedRule<T extends string = string>(
	prefix: keyof PluginPrefix,
	rule: string,
) {
	return `${prefix}/${rule}` as T;
}

const regExPrefixed = /\//;

export function getUnprefixedRule<T extends string>(rule: T) {
	return (regExPrefixed.test(rule)) ? rule.split('/')[1] : rule;
}

// #####

const sortByString = (a: string, b: string) => (a.toUpperCase() < b.toUpperCase()
	? -1
	: a > b
		? 1
		: 0);

const reduceRecordByKeys = <
	T extends UnknownRecord,
>(record: T, keys: (keyof T)[]) => keys.reduce((all, key) => ({
	...all,
	[key]: record[key],
}), {});

export function sortRulesRecord<T extends UnknownRecord>(record: T) {
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
	return preferredOrder.reduce((result, key) => {
		if (key in config) {
			return {
				...result,
				[key]: config[key],
			};
		}

		return result;
	}, {});
}

// export function sortArrOfObjsByProp<
// 	T extends {} & Record<string, any>
// >(key: keyof T) {
// 	return (a: T, b: T) => {
// 		const u = a[key];
// 		const v = b[key];

// 		return sortString(u, v);
// 	};
// }
