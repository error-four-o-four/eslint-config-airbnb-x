import { EXTS_JS, EXTS_MIXED } from '../globalSetup.ts';
import type { ImportSettings } from '../globalTypes.ts';

import { assertNotNull } from '../utils/assert.ts';

import type { TargetConfigs } from './types.ts';

const settings: {
	[K in keyof Partial<TargetConfigs>]:
	(sourceSettings: ImportSettings) => ImportSettings
} = {
	imports(sourceSettings) {
		return {
			...sourceSettings,
			'import/extensions': EXTS_JS,
			'import/parsers': { espree: EXTS_JS },
			'import/resolver': {
				node: { extensions: ['.json'] },
				typescript: { extensions: EXTS_JS as string[] },
			},
		};
	},
};

export function getSettings(
	key: keyof TargetConfigs,
	source: ImportSettings,
) {
	const fn = settings[key];

	assertNotNull(fn, `Expected config '${key}' to have 'settings'`);

	return fn(source);
}

export function getTypescriptSettings(source: ImportSettings) {
	return ({
		...source,
		'import/extensions': EXTS_MIXED,
		'import/external-module-folders': ['node_modules', 'node_modules/@types'],
		'import/parsers': { '@typescript-eslint/parser': EXTS_MIXED },
		'import/resolver': {
			node: { extensions: ['.json'] },
			typescript: { extensions: EXTS_MIXED as string[] },
		},
	});
}
