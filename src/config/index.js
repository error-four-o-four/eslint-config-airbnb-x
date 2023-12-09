import bestPractice from './best-practices.js';
import errors from './errors.js';
import es6 from './es6.js';
import imports from './imports.js';

import node from './node.js';
import strict from './strict.js';
import style from './style.js';
import variables from './variables.js';

const all = [
	bestPractice,
	errors,
	es6,
	imports,
	node,
	strict,
	style,
	variables,
];

export default {
	configs: {
		all,
		bestPractice,
		errors,
		es6,
		imports,
		node,
		strict,
		style,
		variables,
	},
};
