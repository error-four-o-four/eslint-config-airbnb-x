import type {
	ConvertedConfigs,
	MetaDataPluginProps,
	MetaDataProps,
} from '../../shared/types/main.ts';

import type { CustomConfigs } from '../types.ts';

import { assertNotNull } from '../../shared/utils/assert.ts';
import { getPrefixedRule } from '../../shared/utils/main.ts';

import {
	getRuleValue,
	verify,
} from '../utils.ts';

import {
	addedRules,
	disabledRules,
	overwrite,
	replacement,
} from './overwrites.ts';

export function handleTypescriptRule(
	sourceRule: string,
	meta: MetaDataProps,
	plugin: MetaDataPluginProps | undefined,
	sourceConfigs: ConvertedConfigs,
	targetConfigs: CustomConfigs,
) {
	if (replacement.isRequired(sourceRule)) {
		const sourceValue = getRuleValue(sourceRule, meta, sourceConfigs);
		const props = replacement.get(sourceRule, sourceValue);

		targetConfigs[props.key].rules[props.rule] = props.value;
		return;
	}

	const target = targetConfigs.typescript;

	/** @todo prefixed ? */
	if (overwrite.isRequired(sourceRule)) {
		const sourceValue = getRuleValue(sourceRule, meta, sourceConfigs);
		const targetValue = overwrite.get(sourceRule, sourceValue);
		target.rules[sourceRule] = targetValue;
		return;
	}

	/** @note handle overlapping rules, especially no-namespace */
	const isImportXRule = verify.isImportXRule(sourceRule);
	// const overwriteIsRequired = overwrite.isRequired(sourceRule);

	// if (isImportXRule && !overwriteIsRequired) {
	// 	return;
	// }

	assertNotNull(plugin, `Expected plugin data for ${sourceRule} to be not 'null'`);

	const prefixedRule = !isImportXRule
		? getPrefixedRule(plugin.prefix, sourceRule)
		: sourceRule;

	if (!isImportXRule && plugin.deprecated) {
		target.rules[prefixedRule] = 0;
		return;
	}

	if (!isImportXRule && meta.deprecated) {
		return;
	}

	// assertNotNull(meta.plugins);

	// const sourceValue = getRuleValue(sourceRule, meta, sourceConfigs);
	// const targetValue = overwriteIsRequired
	// 	? overwrite.get(sourceRule, sourceValue)
	// 	: sourceValue;

	target.rules[sourceRule] = 0;
	target.rules[prefixedRule] = getRuleValue(sourceRule, meta, sourceConfigs);
}

export function applyTypescript(targetConfigs: CustomConfigs) {
	const target = targetConfigs.typescript;

	addedRules.forEach(([rule, value]) => {
		target.rules[rule] = value;
	});

	disabledRules.forEach((rule) => {
		target.rules[rule] = 0;
	});
}

export const overwriteTypescriptIsRequired = overwrite.isRequired;
