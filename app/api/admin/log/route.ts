import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import Logger from "@/utils/winstonLogger";
import { getSession, isAdmin } from "../../roleChecker";

var logger = Logger("route admin log");

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter admin log`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  try {
    const logs = await prisma.log.findMany({
      select: {
        id: true,
        timestamp: true,
        level: true,
        label: true,
        message: true,
        email: true,
      },
      orderBy: { timestamp: "desc" },
    });
    return NextResponse.json(logs);
  } catch (e) {
    logger.error(JSON.stringify(e));
  }
}
