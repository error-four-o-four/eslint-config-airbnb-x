import type { Linter } from 'eslint';
import type { UnknownRecord } from 'type-fest';

export function assertNotNull(
	value: unknown,
	message: string = 'Expected input to be not \'null\' or \'undefined\'',
): asserts value is NonNullable<typeof value> {
	if (value === null || value === undefined) throw new Error(message);
}

export function assertIsString(
	value: unknown,
	message: string = 'Expected input to be a \'string\'',
): asserts value is string {
	if (typeof value !== 'string') {
		throw new Error(message);
	}
}

export function assertIsRecord(
	input: unknown,
	message: string = 'Expected input to be a \'record\'',
): asserts input is UnknownRecord {
	assertNotNull(input);

	if (typeof input !== 'object') {
		throw new Error(message);
	}

	Object.keys(input as UnknownRecord)
		.forEach((key) => assertIsString(key, message));
}

export function assertRuleLevel(
	value: Linter.RuleEntry,
): asserts value is Linter.RuleLevel {
	if (Array.isArray(value)) {
		throw new Error('Expected \'RuleLevelAndOptions\' Array');
	}
}

export function assertRuleLevelAndOptions(
	value: Linter.RuleEntry,
): asserts value is Linter.RuleLevelAndOptions {
	if (!Array.isArray(value)) {
		throw new Error('Expected \'RuleLevelAndOptions\' Array');
	}
}
