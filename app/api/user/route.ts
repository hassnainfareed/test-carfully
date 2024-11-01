import { NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return new NextResponse("Benuter existiert nicht", { status: 401 });
  }

  return NextResponse.json(user, { status: 200 });
}
