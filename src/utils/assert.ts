import type { Linter } from 'eslint';
import type { UnknownRecord, UnknownArray } from 'type-fest';

function getExpectedMsg(type: string) {
	return `Expected value to be ${type}`;
}

export function assertCondition(
	condition: boolean,
	message: string = 'Expected condition to be true',
): asserts condition is true {
	if (!condition) throw new Error(message);
}

export function assertNotNull(
	value: unknown,
	message: string = getExpectedMsg('not \'null\' or \'undefined\''),
): asserts value is NonNullable<typeof value> {
	if (value === null || value === undefined) throw new Error(message);
}

export function assertIsString(
	value: unknown,
	message: string = getExpectedMsg('a \'string\''),
): asserts value is string {
	if (typeof value !== 'string') {
		throw new Error(message);
	}
}

export function assertIsRecord(
	value: unknown,
	message: string = getExpectedMsg('a \'record\''),
): asserts value is UnknownRecord {
	assertNotNull(value);

	if (typeof value !== 'object') {
		throw new Error(message);
	}

	Object.keys(value as UnknownRecord)
		.forEach((key) => assertIsString(key, `Expected key '${key}' in 'record' to be a 'string'`));
}

export function assertIsArray(
	input: unknown,
	message: string = getExpectedMsg('an \'array\''),
): asserts input is UnknownArray {
	assertNotNull(input);

	if (!Array.isArray(input)) {
		throw new Error(message);
	}
}

export function assertRuleLevel(
	value: Linter.RuleEntry,
): asserts value is Linter.RuleLevel {
	if (Array.isArray(value)) {
		throw new Error('Expected \'RuleLevel\' string');
	}
}

export function assertRuleLevelAndOptions(
	value: Linter.RuleEntry,
): asserts value is Linter.RuleLevelAndOptions {
	if (!Array.isArray(value)) {
		throw new Error('Expected \'RuleLevelAndOptions\' array');
	}
}
