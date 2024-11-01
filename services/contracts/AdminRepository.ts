import { Booking, Log } from "@prisma/client";

export interface AdminRepository {
  getLogs(): Promise<Log[] | null>;
}
