export type ValueOf<T> = T[keyof T];

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;
