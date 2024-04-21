import { Linter } from 'eslint';

interface FlatConfig extends Linter.FlatConfig {
}

declare const configs: {
    bestPractices: FlatConfig;
    errors: FlatConfig;
    node: FlatConfig;
    style: FlatConfig;
    variables: FlatConfig;
    imports: FlatConfig;
    strict: FlatConfig;
    es2022: FlatConfig;
    stylistic: FlatConfig;
    typescript: FlatConfig;
    disableLegacy: FlatConfig;
};

declare const bestPractices: FlatConfig;
declare const errors: FlatConfig;
declare const node: FlatConfig;
declare const style: FlatConfig;
declare const variables: FlatConfig;
declare const es2022: FlatConfig;
declare const imports: FlatConfig;
declare const strict: FlatConfig;
declare const disableLegacy: FlatConfig;
declare const stylistic: FlatConfig;
declare const typescript: FlatConfig;

export { bestPractices, configs as default, disableLegacy, errors, es2022, imports, node, strict, style, stylistic, typescript, variables };
