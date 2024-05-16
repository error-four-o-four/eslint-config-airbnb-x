import type {
	ConvertedConfigs,
	MetaDataItem,
	MetaDataPluginProps,
	PluginPrefix,
	RawMetaData,
} from '../shared/types.ts';

import rawMetaData from '../shared/raw.ts';

import { pluginPrefix } from '../setupGlobal.ts';

import { assertNotNull, toUnprefixedKey } from '../shared/utils.ts';
import { findPlugins, renameReplacedByPrefix } from './utils.ts';

/**
 *
 * @param configs airbnb config files
 * @returns all rules which are used in airbnb config
 */
export function extractRules(configs: ConvertedConfigs) {
	const tmp: Record<string, keyof ConvertedConfigs> = {};

	(Object.keys(configs) as (keyof ConvertedConfigs)[])
		.forEach((config) => {
			const record = configs[config].rules;
			assertNotNull(record);
			Object.keys(record).forEach((rule) => {
				tmp[rule] = config;
			});
		});

	return Object.keys(tmp).sort().map((rule) => ({
		rule,
		source: tmp[rule],
	}));
}

export function extractMetaData(
	{ rule, source }: { rule: string, source: keyof ConvertedConfigs; },
) {
	const isImportRule = rule.startsWith(pluginPrefix.import);
	const unprefixed = isImportRule ? toUnprefixedKey(rule) : rule;
	const origin: keyof Pick<RawMetaData, 'eslint' | 'import'> = isImportRule ? 'import' : 'eslint';

	const raw = rawMetaData[origin].get(unprefixed);
	assertNotNull(raw, `Could not get '${rule}' meta`);

	const plugins = findPlugins(unprefixed)
		.map((plugin) => extractPluginMetaData(plugin, unprefixed));

	const result: MetaDataItem = {
		rule,
		unprefixed: rule !== unprefixed ? unprefixed : undefined,
		source,
		deprecated: raw.deprecated ? true : undefined,
		replacedBy: raw.replacedBy && raw.replacedBy.length > 0
			? [...raw.replacedBy] : undefined,
		url: raw.docs?.url,
		plugins: plugins.length > 0 ? plugins : undefined,
	};

	return result;
}

function extractPluginMetaData(origin: keyof PluginPrefix, unprefixed: string) {
	const raw = rawMetaData[origin].get(unprefixed);
	assertNotNull(raw, `Could not get '${unprefixed}' meta in '${origin}'`);

	const extracted: MetaDataPluginProps = {
		prefix: origin,
		deprecated: raw.deprecated ? true : undefined,
		replacedBy: renameReplacedByPrefix(raw.replacedBy),
		url: raw.docs?.url,
	};

	return extracted;
}

export function extractLiterals() {
	return (Object.keys(rawMetaData) as (keyof RawMetaData)[])
		.sort()
		.reduce((all, key) => ({
			...all,
			[key]: [...rawMetaData[key].keys()],
		}), {} as Record<keyof RawMetaData, string[]>);
}
