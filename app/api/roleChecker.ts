import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { ROLE_ADMIN, ROLE_EMPLOYEE } from "@/constants";
import { Session } from "next-auth";
import prisma from "@/db";
import { User } from "@prisma/client";
import { UserDto } from "@/types/user";

export const getSession = async (): Promise<Session | null> => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  if (session?.user?.role) {
    return session;
  }

  return null;
};

export const isAdmin = async (session: Session): Promise<boolean> => {
  if (session.user.role === ROLE_ADMIN) {
    return true;
  }

  return false;
};

export const isEmployee = async (session: Session): Promise<boolean> => {
  if (session.user.role === ROLE_EMPLOYEE || session.user.role === ROLE_ADMIN) {
    return true;
  }

  return false;
};

export const getUserId = async (
  session: Session
): Promise<string | undefined> => {
  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    select: {
      id: true,
    },
  });

  return user?.id;
};
