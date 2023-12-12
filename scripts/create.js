import { pluginNames } from '../src/setup/plugins.js';

import {
	prefix,
	convertConfig,
	findRawRule,
	getDeprecatedRule,
	rulesSorter,
} from './utils.js';

/**
 *
 * @param {[string, import('./utils.js').BaseConfig]} entries
 * @returns {[import('./utils.js').CustomConfigDict, import('./utils.js').DeprecatedRule[]]}
 */
export default function createConfigs(entries) {
	// remove plugins from base config
	// remove and collect deprecated rules
	// replace deprecated rules
	// convert base to flat config
	const [processedEntries, deprecatedRules] = processEntries(entries);
	const processedConfigs = Object.fromEntries(processedEntries);

	// create a config which turns all deprecated rules off
	const legacyConfigName = 'disable-legacy';
	processedConfigs[legacyConfigName] = createLegacyConfig(
		legacyConfigName,
		deprecatedRules
	);

	// create a config which uses the values of the deprecated rules
	processedConfigs[pluginNames.stylistic] = createStylisticConfig(
		pluginNames.stylistic,
		deprecatedRules
	);

	return [processedConfigs, deprecatedRules];
}

function processEntries(entries) {
	const deprecatedRules = [];
	const processedEntries = [];

	entries.forEach(([configName, configBase]) => {
		const processedRules = [];

		Object.entries(configBase.rules).forEach(([ruleName, ruleValue]) => {
			const rawRule = findRawRule(ruleName);

			if (!rawRule) {
				console.log(`Could not find rule '${ruleName}'`);
				return;
			}

			if (!rawRule.meta.deprecated) {
				processedRules.push([ruleName, ruleValue]);
				return;
			}

			const deprecatedRule = getDeprecatedRule(
				configName,
				ruleName,
				ruleValue,
				rawRule
			);

			if (
				deprecatedRule.plugin &&
				deprecatedRule.plugin !== pluginNames.stylistic
			) {
				processedRules.push([
					`${deprecatedRule.plugin}/${deprecatedRule.name}`,
					deprecatedRule.value,
				]);
			}

			deprecatedRules.push(deprecatedRule);
		});

		processedEntries.push([
			configName,
			convertConfig(configName, configBase, processedRules),
		]);
	});

	return [processedEntries, deprecatedRules];
}

function createLegacyConfig(name, deprecated) {
	const rules = deprecated
		.filter((rule) => rule.plugin !== pluginNames.stylistic)
		.sort(rulesSorter)
		.reduce((all, item) => {
			const ruleName =
				item.plugin === pluginNames.import
					? `${item.plugin}/${item.name}`
					: item.name;
			return Object.assign(all, {
				[ruleName]: 0,
			});
		}, {});

	return {
		name: `${prefix}:${name}`,
		rules,
	};
}

function createStylisticConfig(name, deprecated) {
	const rules = deprecated
		.filter((rule) => rule.plugin === name)
		.sort(rulesSorter)
		.reduce(
			(all, item) =>
				Object.assign(all, {
					[`${name}/${item.name}`]: item.value,
				}),
			{}
		);

	return {
		name: `${prefix}:${name}`,
		rules,
	};
}
