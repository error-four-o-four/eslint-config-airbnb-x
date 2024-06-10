import type { Entries } from 'type-fest';

import type {
	BasePluginPrefix,
	FlatConfig,
	ImportSettings,
} from '../globalTypes.ts';

import { assertNotNull } from '../utils/assert.ts';

import type {
	SourceConfigs,
	RuleItem,
	RuleProps,
	MaybeInvalidProps,
} from './types.ts';

import {
	airbnbConfig,
	sourceConfigs,
	targetConfigs,
} from './setup.ts';

import { getReplacement, hasReplacement } from './replacements.ts';
import { getOverwrite, hasOverwrite } from './overwrites.ts';

import {
	getRuleProps,
	getTargetFromSourceKey,
	getTargetKeyFromPrefix,
	narrowRuleProps,
} from './utils.ts';
import { narrowConfigWithOptions, narrowConfigWithSettings } from '../utils/helpers.ts';
import { getLanguageOptions } from './options.ts';
import { getSettings } from './settings.ts';

function requiresDisapproval(item: RuleProps) {
	return item.meta.deprecated;
}

function disapproveRule(item: RuleProps) {
	if (item.unprefixed) {
		const prefix = item.rule.split('/')[0] as keyof BasePluginPrefix;
		const target = getTargetKeyFromPrefix(prefix);
		targetConfigs[target].rules[item.rule] = 0;
		return;
	}

	targetConfigs.disableLegacy.rules[item.rule] = 0;
}

function iterateRuleProps(item: MaybeInvalidProps) {
	if (!narrowRuleProps(item)) {
		console.log(`Skipped rule '${item.rule}' because 'RuleMetaData' or 'RuleEntry' is undefined`);
		return;
	}

	if (hasReplacement(item)) {
		disapproveRule(item);

		const props = getReplacement(item);
		assertNotNull(props);

		targetConfigs[props.target].rules[props.replacedBy] = props.value;

		console.log(`Replaced '${item.source}' rule '${item.rule}' by '${props.replacedBy}' in '${props.target}'`);
		return;
	}

	if (requiresDisapproval(item)) {
		disapproveRule(item);

		/** @todo check has been replaced */
		return;
	}

	const targetKey = getTargetFromSourceKey(item.source);

	if (hasOverwrite(item)) {
		item.value = getOverwrite(item);
	}

	targetConfigs[targetKey].rules[item.rule] = item.value;
}

export function generateFlatConfigs() {
	// adjust airbnb rules
	(Object.entries(airbnbConfig.rules) as RuleItem[])
		.map(getRuleProps)
		.forEach(iterateRuleProps);

	// adjust languageOptions and Settings
	(Object.entries(sourceConfigs) as Entries<SourceConfigs>)
		.forEach(([sourceKey, sourceConfig]) => {
			const targetKey = getTargetFromSourceKey(sourceKey);

			if (narrowConfigWithOptions(sourceConfig)) {
				/** sourceConfig.languageOptions is unknwon @todo */
				const sourceOptions = sourceConfig.languageOptions as FlatConfig['languageOptions'];
				targetConfigs[targetKey].languageOptions = getLanguageOptions(targetKey, sourceOptions);
			}

			if (narrowConfigWithSettings(sourceConfig)) {
				const sourceSettings = sourceConfig.settings as ImportSettings;
				targetConfigs[targetKey].settings = getSettings(targetKey, sourceSettings);
			}
		});

	return targetConfigs;
}

export function generateUnstyledConfigs() {

}
