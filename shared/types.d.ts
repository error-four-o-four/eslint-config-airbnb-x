import { Linter } from 'eslint';

interface NamedFlatConfig extends Linter.FlatConfig {
    name: string;
}

declare const map: {
    readonly import: "import";
    readonly node: "node";
    readonly stylistic: "stylistic";
    readonly typescript: "typescript";
};

type PluginNames = typeof map;

export type { NamedFlatConfig, PluginNames };
