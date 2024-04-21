import { Linter } from 'eslint';

interface FlatConfig extends Linter.FlatConfig {
}

declare const _default: (...overrides: FlatConfig[]) => Promise<FlatConfig[]>;

export { _default as default };
