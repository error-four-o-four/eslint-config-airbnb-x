import { Linter } from 'eslint';

interface FlatConfig extends Linter.FlatConfig {
}
interface NamedFlatConfig extends FlatConfig {
    name: string;
}

declare const map: {
    readonly import: "import";
    readonly node: "node";
    readonly stylistic: "stylistic";
    readonly typescript: "typescript";
};

type PluginNames = typeof map;

export type { FlatConfig, NamedFlatConfig, PluginNames };
