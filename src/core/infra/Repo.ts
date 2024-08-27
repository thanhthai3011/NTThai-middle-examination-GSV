export interface Repo<T> {
    findById(t: T): Promise<T>;
}
