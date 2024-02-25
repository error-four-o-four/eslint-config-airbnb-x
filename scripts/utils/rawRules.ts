import { Linter, type Rule } from 'eslint';

import plugins, { pluginPrefix } from '../../src/plugins.ts';

import { PluginPrefixNotTS } from '../types/plugins.ts';

const rawRules = {
	eslint: new Map<string, Rule.RuleModule>(
		new Linter().getRules().entries(),
	),
	import: new Map<string, Rule.RuleModule>(
		Object.entries(plugins.import.rules),
	),
	node: new Map<string, Rule.RuleModule>(
		Object.entries(plugins.node.rules),
	),
	stylistic: new Map<string, Rule.RuleModule>(
		Object.entries(plugins.stylistic.rules),
	),
	typescript: new Map<string, Rule.RuleModule>(
		Object.entries(plugins.typescript.rules),
	),
	getAirbnbRule(name: string, isImportsRule: boolean) {
		const raw = isImportsRule
			? this.import.get(name)
			: this.eslint.get(name);

		return raw || null;
	},
	getReplacedIn(ruleName: string) {
		const possiblePlugins: PluginPrefixNotTS[] = [
			pluginPrefix.import,
			pluginPrefix.node,
			pluginPrefix.stylistic,
		];

		const findReplacedIn = (
			plugin: PluginPrefixNotTS,
			prefix: string,
		): plugin is PluginPrefixNotTS => this[plugin].has(prefix);

		let isReplacedIn: PluginPrefixNotTS | undefined;

		possiblePlugins.forEach((plugin) => {
			if (isReplacedIn) return;

			if (findReplacedIn(plugin, ruleName)) {
				isReplacedIn = plugin;
			}
		});

		return isReplacedIn;
	},
};

const nonEnumerableProp: PropertyDescriptor = {
	enumerable: false,
	writable: false,
};

Object.defineProperties(
	rawRules,
	{
		getAirbnbRule: nonEnumerableProp,
		getReplacedIn: nonEnumerableProp,
	},
);

Object.freeze(rawRules);

export default rawRules;
