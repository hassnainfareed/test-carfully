export interface Repository<T> {
  urlPath: string;
  getAll(): Promise<T[] | null>;
  get(id: string): Promise<T | null>;
  create(data: T): Promise<T | null>;
  update(data: T): Promise<T | null>;
  delete(id: string): Promise<void>;
}
