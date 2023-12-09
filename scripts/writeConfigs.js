import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';
import { prettierConfig } from './utils.js';

import { configs } from './compatConfigs.js';

const writeConfig = async (config) => {
	const name = config.name.split(':')[1];

	let string = `// Rules generated with script\n`;
	string += `/** @type {import('eslint').Linter.FlatConfig} */\n`;
	string += `export default ${JSON.stringify(config)}`;

	const data = await prettier.format(string, {
		parser: 'espree',
		...prettierConfig,
	});

	const url =
		name === 'node' || name === 'imports'
			? `../src/config/_${name}.js` // maunally modified
			: `../src/config/${name}.js`;

	const file = fileURLToPath(new URL(url, import.meta.url));

	fs.writeFileSync(file, data);
	console.log('Written data to', file);
};

configs.reduce(async (chain, config) => {
	await chain;
	return writeConfig(config);
}, Promise.resolve());
