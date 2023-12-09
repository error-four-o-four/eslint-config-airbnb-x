import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const prettierConfig = JSON.parse(
	fs.readFileSync(
		fileURLToPath(new URL('../../prettier/index.json', import.meta.url))
	)
);

// export const prettify = () => {}

export { prettierConfig };
