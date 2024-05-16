import type { Linter } from 'eslint';

import { pluginPrefix } from '../setupGlobal.ts';

const overwrites = {
	[`${pluginPrefix.import}/no-extraneous-dependencies`](
		source: Linter.RuleEntry,
	) {
		if (!Array.isArray(source)) {
			throw new Error('Expected \'RuleLevelAndOptions\' Array');
		}

		const [severity, dependants] = source;

		return [
			severity,
			{
				devDependencies: [
					...dependants.devDependencies,
					'**/eslint.config.js',
					'**/vite.config.js',
					'**/vite.config.*.js',
				],
				optionalDependencies: dependants.optionalDependencies,
			},
		] as Linter.RuleEntry;
	},
};

const keys = Object.keys(overwrites);

export function hasOverwrite(rule: string) {
	return keys.includes(rule);
}

export function overwrite<K extends keyof typeof overwrites>(
	key: K,
	value: Linter.RuleEntry,
) {
	/** @todo types */
	// console.log(value);
	return overwrites[key](value);
}
