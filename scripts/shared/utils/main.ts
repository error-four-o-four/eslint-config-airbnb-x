import type { PluginPrefix } from '../types/main.ts';

// function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
// 	return obj.hasOwnProperty(prop);
// }

export function toUpperCase(input: string) {
	return input.slice(0, 1).toUpperCase() + input.slice(1).toLowerCase();
}

export function toCamelCase(input: string) {
	/* eslint-disable-next-line stylistic/max-len */
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
	/* eslint-disable-next-line stylistic/max-len */
	const r = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
	const m = input.match(r);

	if (!m) return input;

	return m
		.join('-')
		.toLowerCase();
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

// const sortString = (a: string, b: string) => (a.toUpperCase() < b.toUpperCase()
// 	? -1
// 	: a > b
// 		? 1
// 		: 0);

// export function sortArrOfObjsByProp<
// 	T extends {} & Record<string, any>
// >(key: keyof T) {
// 	return (a: T, b: T) => {
// 		const u = a[key];
// 		const v = b[key];

// 		return sortString(u, v);
// 	};
// }
