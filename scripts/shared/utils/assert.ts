import { Linter } from "eslint";

export function assertNotNull(
	value: unknown,
	message: string = 'Nope',
): asserts value is NonNullable<typeof value> {
	if (value === null || value === undefined) throw new Error(message);
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