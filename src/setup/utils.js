/* eslint-disable import/prefer-default-export */
export function assignFiles(config, files) {
	return Object.assign(config, {
		files,
	});
}
