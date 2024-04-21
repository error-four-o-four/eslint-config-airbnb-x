import * as eslint from 'eslint';

declare const configs: {
    bestPractices: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
    errors: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
    node: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
    style: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
    variables: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
    es6: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
    imports: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
    strict: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
};

declare const bestPractices: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
declare const errors: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
declare const es6: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
declare const imports: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
declare const node: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
declare const strict: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
declare const style: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;
declare const variables: eslint.Linter.FlatConfig<eslint.Linter.RulesRecord>;

export { bestPractices, configs as default, errors, es6, imports, node, strict, style, variables };
