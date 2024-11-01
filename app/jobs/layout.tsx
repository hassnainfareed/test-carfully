"use client";

import Navigation from "@/components/navigation/Navigation";
import { Footer } from "@/components/Footer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deDE } from "@mui/x-date-pickers/locales";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";

const theme = createTheme({}, deDE);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <main>{children}</main>
        </LocalizationProvider>
      </ThemeProvider>
      <Footer />
    </>
  );
}
