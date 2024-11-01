"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import NavigationLogin from "./NavigationLogin";
import { Divider, Link } from "@mui/material";
import {
  faSprayCanSparkles,
  faArrowRightToBracket,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import CookieConsent from "react-cookie-consent";
// import { COOKIE_KEY_CONSENT } from "@/constants";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const menuItems = [
    {
      text: "Home",
      onClick: () => {
        router.push("/");
      },
    },
    // {
    //   text: "Preise",
    //   onClick: () => {
    //     if (pathname !== "/") {
    //       router.push("/#pricingContainer");
    //     } else {
    //       const pricingComponent = document.querySelector("#pricingContainer");
    //       pricingComponent?.scrollIntoView({ behavior: "smooth" });
    //     }
    //   },
    // },
    {
      text: "Über Uns",
      onClick: () => {
        router.push("/aboutus");
      },
    },
    {
      text: "Jobs",
      onClick: () => {
        router.push("/jobs");
      },
    },
  ];

  return (
    <>
      {/* <CookieConsent
        location="bottom"
        // enableDeclineButton
        // declineButtonText="Ablehnen"
        // declineButtonStyle={{
        //   backgroundColor: "#b91c1c",
        //   color: "#e5e7eb",
        //   borderRadius: 7,
        //   fontSize: 14,
        // }}
        buttonText="Verstanden"
        buttonStyle={{
          backgroundColor: "#0284c7",
          color: "#e5e7eb",
          borderRadius: 7,
          fontSize: 16,
        }}
        cookieName={COOKIE_KEY_CONSENT}
        overlay
        style={{ fontSize: 16, backgroundColor: "#172554", maxWidth: 500 }}
      >
        Wir nutzen auf unseren Webseiten nur technisch notwendige Cookies, die
        für die uneingeschränkte Nutzung unserer Website technisch erforderlich.
        Nichtsdestotrotz möchten wir Sie auf unsere{" "}
        <a className="font-bold" href="/datenschutz">
          Datenschutzrichtlinien
        </a>{" "}
        aufmerksam machen.
      </CookieConsent> */}
      <AppBar
        position="static"
        style={{ background: "#050a30", padding: "0px", margin: "0px" }}
        className="bg-gray-500"
        elevation={0}
      >
        <Container
          maxWidth={false}
          sx={{ maxWidth: "1280px" }}
          className="bg-blue-carfully"
        >
          <Toolbar disableGutters>
            {/* Small Width Box */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                alignItems: "center",
              }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <a href="/">
                <Image
                  src="/img/CarfullyLogo.png"
                  width={178}
                  height={24}
                  alt="Logo"
                  className="h-[24px]"
                />
              </a>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItem onClick={() => router.push("/booking")}>
                  <FontAwesomeIcon
                    icon={faSprayCanSparkles}
                    className="w-4 h-4 mr-2"
                  />
                  <Typography textAlign="center">Buchen</Typography>
                </MenuItem>
                {menuItems.map((item) => (
                  <MenuItem key={item.text} onClick={item.onClick}>
                    <Typography textAlign="center">{item.text}</Typography>
                  </MenuItem>
                ))}

                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={() => router.push("/authentication/login")}>
                  <FontAwesomeIcon
                    icon={faArrowRightToBracket}
                    className="w-4 h-4 mr-2"
                  />
                  <Typography textAlign="center">Anmelden</Typography>
                </MenuItem>
                <MenuItem onClick={() => router.push("/authentication/login")}>
                  <FontAwesomeIcon
                    icon={faFileSignature}
                    className="w-4 h-4 mr-2"
                  />
                  <Typography textAlign="center">Registrieren</Typography>
                </MenuItem>
              </Menu>
            </Box>

            {/* Large Width Box */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              <a href="/">
                <Image
                  src="/img/CarfullyLogo.png"
                  width={178}
                  height={24}
                  alt="Logo"
                  className="h-[24px] mr-8"
                />
              </a>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={item.onClick}
                  sx={{
                    my: 1,
                    mx: 1,
                    color: "white",
                    display: "block",
                    fontSize: "16px",
                    fontWeight: "600",
                    textTransform: "none",
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>

            <NavigationLogin />
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
