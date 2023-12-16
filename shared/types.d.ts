import { Linter, Rule } from 'eslint';

declare const airbnbNameValues: ("best-practices" | "errors" | "node" | "style" | "variables" | "es6" | "imports" | "strict")[];
declare const customNameValues: ("disable-legacy" | "stylistic" | "typescript")[];
declare const configNameValues: ("best-practices" | "errors" | "node" | "style" | "variables" | "es6" | "imports" | "strict" | "disable-legacy" | "stylistic" | "typescript")[];
declare const pluginNameValues: ("node" | "stylistic" | "typescript" | "import")[];
type AirbnbNames = (typeof airbnbNameValues)[number];
type CustomNames = (typeof customNameValues)[number];
type ConfigNames = (typeof configNameValues)[number];
type PluginNames = (typeof pluginNameValues)[number];
type BaseConfig = Linter.BaseConfig;
type FlatConfig = Linter.FlatConfig;
type NamedFlatConfig = {
    name: string;
} & FlatConfig;
type BaseConfigEntry = [AirbnbNames, BaseConfig];
type NamedConfigEntry = [ConfigNames, NamedFlatConfig];
type RawRule = Rule.RuleModule;
type RuleMeta = Rule.RuleMetaData;
type RuleEntry = Linter.RuleEntry<any[]>;
type RulesRecord = Linter.RulesRecord;
type ApprovedRuleEntry = [string, RuleEntry];
type DeprecatedRule = {
    name: string;
    value: RuleEntry;
    config: string;
    plugin: string | undefined;
    replacedBy: string | undefined;
    url: string | undefined;
};

export type { AirbnbNames, ApprovedRuleEntry, BaseConfig, BaseConfigEntry, ConfigNames, CustomNames, DeprecatedRule, FlatConfig, NamedConfigEntry, NamedFlatConfig, PluginNames, RawRule, RuleEntry, RuleMeta, RulesRecord };
