import type { Linter } from 'eslint';

import type {
	ConvertedConfigs,
	MetaDataProps,
	MetaDataItem,
} from '../shared/types/main.ts';

export type DecoratedIterator = (
	config: keyof ConvertedConfigs,
	rules: Partial<Linter.RulesRecord>
) => (
	rule: string
) => (MetaDataItem | null);

export type CustomMetaData = Record<
	keyof ConvertedConfigs,
	Record<
		string,
		Omit<MetaDataProps, 'config'>
	>
>;
