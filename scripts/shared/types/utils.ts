export type AnyRecord = Record<string, any>;

export type ObjectEntry<T> = [keyof T, T[keyof T]];

export type ValueOf<T> = T[keyof T];

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;
