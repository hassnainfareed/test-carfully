import { Log } from "@prisma/client";
import { AdminRepository } from "./contracts/AdminRepository";
import axios from "axios";

const ADMIN_API: string = "/api/admin/";

export class AdminService implements AdminRepository {
  async getLogs(): Promise<Log[]> {
    const res = await axios.get(`${ADMIN_API}log`);
    return res.data as Log[];
  }
}
