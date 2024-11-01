import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import prisma from '@/db';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				username: {
					label: 'E-Mail',
					type: 'text',
					placeholder: 'E-Mail Adresse',
				},
				password: { label: 'Passwort', type: 'password' },
			},
			async authorize(credentials, req) {
				if (!credentials?.username || !credentials?.password) {
					return null;
				}

				const email = credentials.username.toLowerCase();

				const user = await prisma.user.findUnique({
					where: {
						email: email,
					},
					select: {
						id: true,
						password: true,
						email: true,
						emailVerified: true,
						role: true,
						provider: true,
					},
				});

				if (!user) return null;

				// If user registered with Google, don't allow credentials login
				if (user.provider === 'google') {
					return null;
				}

				// For users registered with email/password, verify the password
				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!passwordMatch) return null;

				if (user.emailVerified === null) return null;

				return {
					id: user.id,
					email: user.email,
					role: user.role,
					provider: user.provider || 'credentials',
				};
			},
		}),
	],
	callbacks: {
		async signIn({ user, account, profile, email, credentials }) {
			if (account?.provider === 'google') {
				const existingUser = await prisma.user.findUnique({
					where: { email: user.email! },
					select: { id: true, role: true, provider: true },
				});

				if (!existingUser) {
					// Create a new user for Google sign-ins
					const newUser = await prisma.user.create({
						data: {
							email: user.email!,
							password: await bcrypt.hash(
								Math.random().toString(36),
								10
							), // Generate a random password
							emailVerified: new Date(),
							provider: 'google',
							// role will default to "user"
						},
					});
					user.role = newUser.role;
				} else {
					// Use the existing user's role
					user.role = existingUser.role;
					if (!existingUser.provider) {
						await prisma.user.update({
							where: { id: existingUser.id },
							data: { provider: 'google' },
						});
					}
				}
			}
			return true;
		},
		async jwt({ token, user, account }) {
			if (user) {
				token.role = user.role;
				token.provider =
					user.provider || account?.provider || 'credentials';
			}
			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.role = token.role as string;
				session.user.provider = token.provider as string;
			}
			return session;
		},
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === 'development',
	pages: {
		signIn: '../../authentication/login',
	},
};
