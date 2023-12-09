import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import prettier from 'prettier';

// import { prettierConfig } from './utils.js';
import { deprecatedRules, rawRules } from './compatConfigs.js';

const writeDeprecatedLog = async (deprecated) => {
	let string = `# deprecated rules\n`;
	string += `Log generated with script\n\n`;

	for (const rule of deprecated) {
		const rawRule = rawRules.get(rule);
		if (rawRule.meta && rawRule.meta?.docs?.url) {
			string += `* ${rawRule.meta.docs.url}\n`;
			continue;
		}

		string += `* \`${rule}\` is deprecated (Could not find any meta data)\n`;
	}

	const data = await prettier.format(string, {
		parser: 'markdown',
		// ...prettierConfig,
	});

	const file = fileURLToPath(new URL(`../deprecated.log.md`, import.meta.url));

	fs.writeFileSync(file, data);
	console.log('Written data to', file);
};

writeDeprecatedLog(deprecatedRules);
