import type { Linter } from 'eslint';

import type { ImportXRule } from '../extractedLiteralsData.ts';
import type { MetaDataPluginProps, MetaDataProps } from '../shared/types.ts';

// import { assertNotNull } from '../shared/utils.ts';

const overwrites: Partial<{
	[K in ImportXRule]:
	(
		source?: Linter.RuleEntry,
		meta?: MetaDataProps | MetaDataPluginProps
	) => Linter.RuleLevel | Linter.RuleLevelAndOptions
}> = {
	/**
	 * @todo
	 * rule exists in import and typescript plugin
	 */
	// 'import/no-namespace': () => {
	// 	return 0
	// },

	/**
	 * @todo special case 'import/named'
	 * should be disabled for typescript files
	 */
	// 'import/named': (value, meta) => {
	// 	assertNotNull(value, '\'RuleEntry\' are required');
	// 	assertNotNull(meta, '\'MetaData\' is required');

	// 	if (Array.isArray(value)) {
	// 		throw new Error('Expected \'RuleLevel\' param');
	// 	}

	// 	if (assertMetaDataProps(meta)) {
	// 		throw new Error('Expected \'MetaDataPluginProps\' param');
	// 	}

	// 	if (meta.prefix === 'type') {
	// 		return 0;
	// 	}

	// 	return value;
	// },

	'import/no-extraneous-dependencies': (value) => {
		if (!Array.isArray(value)) {
			throw new Error('Expected \'RuleLevelAndOptions\' Array');
		}

		const [severity, dependants] = value;

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
		];
	},
};

// function assertMetaDataProps(
// 	meta: MetaDataProps | MetaDataPluginProps,
// ): meta is MetaDataProps {
// 	return ('plugins' in meta);
// }

const keys = Object.keys(overwrites);

export function hasOverwrite(rule: string): rule is ImportXRule {
	return keys.includes(rule);
}

export function overwrite<K extends ImportXRule>(
	rule: K,
	value?: Linter.RuleEntry,
	meta?: MetaDataProps | MetaDataPluginProps,
) {
	const fn = overwrites[rule];

	if (fn) {
		return fn(value, meta);
	}

	throw new Error(`Expected overwrite for '${rule}' to be defined`);
}
