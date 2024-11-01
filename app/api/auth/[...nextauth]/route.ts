import NextAuth from "next-auth/next";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";
// import prisma from "@/db";
// import { NextAuthOptions } from "next-auth";

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

import { authOptions } from "@/utils/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
