import * as eslint from 'eslint';

declare const configs: {
    bestPractices: eslint.Linter.FlatConfig;
    errors: eslint.Linter.FlatConfig;
    node: eslint.Linter.FlatConfig;
    style: eslint.Linter.FlatConfig;
    variables: eslint.Linter.FlatConfig;
    es6: eslint.Linter.FlatConfig;
    imports: eslint.Linter.FlatConfig;
    strict: eslint.Linter.FlatConfig;
};

declare const bestPractices: eslint.Linter.FlatConfig;
declare const errors: eslint.Linter.FlatConfig;
declare const es6: eslint.Linter.FlatConfig;
declare const imports: eslint.Linter.FlatConfig;
declare const node: eslint.Linter.FlatConfig;
declare const strict: eslint.Linter.FlatConfig;
declare const style: eslint.Linter.FlatConfig;
declare const variables: eslint.Linter.FlatConfig;

export { bestPractices, configs as default, errors, es6, imports, node, strict, style, variables };
