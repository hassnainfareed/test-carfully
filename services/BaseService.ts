import axios from "axios";
import { Repository } from "./contracts/Repository";

export default class BaseService<T> implements Repository<T> {
  urlPath: string;

  constructor(urlPath: string) {
    this.urlPath = urlPath;
  }

  async getAll(): Promise<T[]> {
    var res = await axios.get(this.urlPath);
    return res.data as T[];
  }

  async get(id: string): Promise<T> {
    var res = await axios.get(`${this.urlPath}${id}`);
    return res.data as T;
  }

  async create(data: T): Promise<T> {
    var res = await axios.post(this.urlPath, data);
    return res.data as T;
  }

  async update(data: T): Promise<T> {
    var res = await axios.put(this.urlPath, data);
    return res.data as T;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.urlPath}?id=${id}`);
  }
}
