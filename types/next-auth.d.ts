import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			role: string;
			email: string;
			provider?: string;
		} & DefaultSession;
	}

	interface User extends DefaultUser {
		role: string;
		provider?: string;
	}
}
declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		role: string;
		provider?: string;
	}

	// declare module "next-auth/jwt" {
	//   interface JWT extends DefaultJWT {
	//     role: string;
	//   }
}

// import { User } from "./interfaces";

// declare module "next-auth" {
//   interface Session {
//     user: User;
//   }
// }
