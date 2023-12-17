import { GLOBS, tsExists } from './setup/constants.js';
import { assignFiles } from './setup/utils.js';

import setup from './setup/index.js';

import bestPractices from './configs/airbnb/best-practices.js';
import errors from './configs/airbnb/errors.js';
import style from './configs/airbnb/style.js';
import variables from './configs/airbnb/variables.js';
import es6 from './configs/airbnb/es6.js';
import strict from './configs/airbnb/strict.js';

import legacy from './configs/custom/disable-legacy.js';
import node from './configs/node.js';
import imports from './configs/imports.js';
import typescript from './configs/typescript.js';

const es6Stripped = {
	// omit languageOptions
	name: es6.name,
	rules: es6.rules,
};

const configs = [
	legacy,
	setup,
	bestPractices,
	errors,
	node,
	style,
	variables,
	es6Stripped,
	strict,
	imports,
].map((config) => assignFiles(config, GLOBS));

if (tsExists) {
	configs.push(typescript);
}

/** @typedef {import('../shared/types.d.ts').FlatConfig} FlatConfig */
/** @typedef {import('../shared/types.d.ts').NamedFlatConfig} NamedFlatConfig */

/**
 *
 * @param  {...FlatConfig} overrides
 * @returns {[FlatConfig | NamedFlatConfig]}
 */
export default (...overrides) => [...configs, ...overrides];

/** @type {{ [x: string]: NamedFlatConfig}} */
export {
	legacy as disableLegacy,
	setup,
	bestPractices,
	errors,
	node,
	style,
	variables,
	es6Stripped as es6,
	strict,
	imports,
	typescript,
};
