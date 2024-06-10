export type RequiredJsonString = `./${string}.json`;
export type RequiredFileString = `./${string}.${'js' | 'ts'}`;

export type GenericString<
	T extends string,
	U extends string,
> = T extends U ? T : never;

type BannedExtensionString = `${string}.${string}`;

export type RequiredFolderString<
	T extends string> = `./${T extends BannedExtensionString ? never : T}`;

export type ConcatTuple<
	K1 extends string[],
	K2 extends string[],
> = [...K1, ...K2];
