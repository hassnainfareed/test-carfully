// 'use client'

// import { SessionProvider } from 'next-auth/react'

// export default function AuthProvider({ children }: {
//     children: React.ReactNode
// }) {
//     return (
//         <SessionProvider>
//             {children}
//         </SessionProvider>
//     )
// }

// "use client";
// import { Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";

// export const metadata = {
//   title: "My App",
//   description: "My description",
// };

// export interface AuthContextProps {
//   children: React.ReactNode;
//   session: Session;
// }

// export default function AuthContext({ children }: AuthContextProps) {
//   return <SessionProvider>{children}</SessionProvider>;
// }
