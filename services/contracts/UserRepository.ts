import { User, Booking } from "@prisma/client";
import { Repository } from "./Repository";
import { UserRole } from "@/app/api/user/updateRole/route";

export interface UserRepository extends Repository<User> {
  getUser(): Promise<User>;
  getBookings(): Promise<Booking[]>;
  getAllUsers(): Promise<User[]>;
  updateRole(userRole: UserRole): Promise<void>;
}
