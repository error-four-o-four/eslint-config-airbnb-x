import { Linter } from 'eslint';

import { pluginNames, plugins } from '../src/setup/plugins.js';

const rulesImport = plugins[pluginNames.import].rules;
// const rulesNode = plugins[pluginNames.node].rules;
// const rulesTs = plugins[pluginNames.typescript].rules;

const rulesEslint = new Linter().getRules();

/**
 * @typedef {Object} LegacyRule
 * @property {string} name
 * @property {import('eslint').Linter.RuleEntry<any[]>} value
 * @property {string} config
 * @property {string} plugin
 * @property {string[] | undefined} replacedBy
 * @property {string | undefined} url
 */

/**
 *
 * @param {string} name
 * @returns {null | import('./utils.js').CustomRule}
 */
export const findRawRule = (name) => {
	// Airbnb config uses eslint-plugin-import
	// therefore some rules are prefixed with 'import'
	const isImportRule = name.startsWith('import');

	const key = isImportRule ? name.split('/')[1] : name;
	const raw = isImportRule ? rulesImport[key] : rulesEslint.get(key);

	return raw || null;
};

/**
 *
 * @param {string} ruleName
 * @returns {string}
 */
export const findReplacedIn = (ruleName) => {
	const map = {
		[pluginNames.import]: Object.keys(plugins[pluginNames.import].rules),
		[pluginNames.node]: Object.keys(plugins[pluginNames.node].rules),
		[pluginNames.stylistic]: Object.keys(plugins[pluginNames.stylistic].rules),
	};

	const pluginName = Object.entries(map).reduce(
		// (result, [name, rules]) => result !== null ? result : rules.includes(ruleName) ? name : result,
		(result, entry) => {
			const [name, rules] = entry;
			if (result !== null) return result;
			if (rules.includes(ruleName)) return name;
			return null;
		},
		null
	);

	return pluginName;
};

// export const getPluginsLegacy = () => {
// 	let legacy = [];

// 	// node => rule.meta.deprecated
// 	Object.entries(plugins[pluginNames.node].rules).forEach(([name, rule]) => {
// 		if (rule.meta.deprecated) {
// 			legacy.push(createLegacyRule(name, rule, '', pluginNames.node, rule))
// 		}
// 	})

// 	// ts => rule.meta.type === 'layout'
// 	Object.entries(plugins[pluginNames.typescript].rules).forEach(([name, rule]) => {
// 		if (rule.meta.type === 'layout') {
// 			legacy.push(createLegacyRule(name, rule, '', pluginNames.typescript, rule))
// 		}
// 	})

// 	return legacy.sort(legacyRulesSorter).reduce((all, rule) => {}, {})
// };

/**
 *
 * @param {string} ruleName
 * @param {import('eslint').Linter.RuleEntry<any[]>} ruleValue
 * @param {string} configName
 * @param {string} pluginName
 * @param {import('eslint').Rule.RuleModule} rawRule
 * @returns
 */
export const createLegacyRule = (
	ruleName,
	ruleValue,
	configName,
	pluginName,
	rawRule
) => ({
	name: ruleName,
	value: ruleValue,
	config: configName,
	plugin: pluginName,
	replacedBy: rawRule.meta.replacedBy,
	url: rawRule.meta.docs.url,
});

/**
 *
 * @param {LegacyRule} a
 * @param {LegacyRule} b
 * @returns {number}
 */
export const legacyRulesSorter = (a, b) => {
	const nameA = a.name.toUpperCase();
	const nameB = b.name.toUpperCase();

	/* eslint-disable no-nested-ternary */
	return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
};
