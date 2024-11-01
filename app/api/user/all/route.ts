import { NextResponse } from "next/server";
import prisma from "@/db";
import Logger from "@/utils/winstonLogger";
import { getSession, isAdmin } from "../../roleChecker";

var logger = Logger("route user all");

export async function GET(req: Request, res: Response) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter admin user`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      emailVerified: true,
      createdAt: true,
      role: true,
      email: true,
    },
  });

  return NextResponse.json(users, { status: 200 });
}
