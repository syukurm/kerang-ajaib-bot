export type Result<T, E extends Error = Error> = [T, null] | [null, E];
export type PromiseResult<T, E extends Error = Error> = Promise<Result<T, E>>;
