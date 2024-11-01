import { Booking, User } from "@prisma/client";
import BaseService from "./BaseService";
import axios from "axios";
import { UserRepository } from "./contracts/UserRepository";
import { UserRole } from "@/app/api/user/updateRole/route";

export default class UserService
  extends BaseService<User>
  implements UserRepository
{
  constructor() {
    super("/api/user/");
  }

  async getUser() {
    var res = await axios.get(this.urlPath);
    return res.data as User;
  }

  async getBookings() {
    const res = await axios.get(`${this.urlPath}booking`);
    return res.data as Booking[];
  }

  async getAllUsers() {
    var res = await axios.get(`${this.urlPath}all`);
    return res.data as User[];
  }

  async updateRole(userRole: UserRole) {
    const res = await axios.put(`${this.urlPath}updateRole`, userRole);
  }
}
