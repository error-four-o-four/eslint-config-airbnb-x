// FILE GENERATED WITH SCRIPT
import disableLegacy from './disable-legacy.js';
import disableLegacyStylistic from './disable-legacy-stylistic.js';
import bestPractice from './best-practices.js';
import errors from './errors.js';
import es6 from './es6.js';
import imports from './imports.js';
import node from './node.js';
import strict from './strict.js';
import style from './style.js';
import stylistic from './stylistic.js';
import variables from './variables.js';

export const all = {
	'disable-legacy': disableLegacy,
	'disable-legacy-stylistic': disableLegacyStylistic,
	bestPractice,
	errors,
	es6,
	imports,
	node,
	strict,
	style,
	stylistic,
	variables,
};

/** @type {import('eslint').Linter.FlatConfig[]} */
export default Object.values(all);
