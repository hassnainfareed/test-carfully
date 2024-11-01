import "./globals.css";
import type { Metadata } from "next";

import { getServerSession } from "next-auth";
import SessionProvider from "@/context/SessionProvider";
import "./styles/dx.generic.carfully_light.css";
import "./styles/custom.module.css";
// import AuthContext from "@/context/AuthProvider";
import { Poppins } from "next/font/google";

import { ReduxProvider } from "@/redux/ReduxProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import Script from "next/script";

// If loading a variable font, you don't need to specify the font weight
const poppins = Poppins({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carfully - Alles rund um dein Auto",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" className={poppins.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js?cbid=ed6247b5-002a-413e-b732-7fd09bec3c9a"
          data-blockingmode="auto"
          type="text/javascript"
        ></Script>
        <link
          href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-slate-900 h-screen">
        <ReduxProvider>
          <SessionProvider session={session}>
            <AppRouterCacheProvider>
              <main>{children}</main>
            </AppRouterCacheProvider>
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
