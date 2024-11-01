import { NextResponse } from "next/server";
import prisma from "@/db";
import Logger from "@/utils/winstonLogger";
import { getSession, isAdmin } from "../../roleChecker";

var logger = Logger("route user updateRole");

export interface UserRole {
  id: string;
  role: string;
}

export async function PUT(req: Request, res: Response) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(
      `user ${session!.user!.email} tried to enter admin user updateRole`
    );
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const userRole: UserRole = await req.json();

  await prisma.user.update({
    where: {
      id: userRole.id,
    },
    data: {
      role: userRole.role,
    },
  });

  return NextResponse.json(null, { status: 200 });
}
