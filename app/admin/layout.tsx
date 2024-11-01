"use client";

import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Image from "next/image";
import {
  faGauge,
  faBellConcierge,
  faBook,
  faFileLines,
  faTags,
  faLocationDot,
  faUsers,
  faWrench,
  faCarSide,
  faPaperPlane,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";
import { TIMEZONE } from "@/constants";
// import dayjs from "dayjs";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault(TIMEZONE);

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const router = useRouter();

  const menuItems = [
    {
      icon: faGauge,
      text: "Dashboard",
      href: "/admin",
    },
    {
      icon: faBook,
      text: "Buchungen",
      href: "/admin/bookings",
    },
    {
      icon: faBellConcierge,
      text: "Dienstleistungen",
      href: "/admin/services",
    },
    {
      icon: faLocationDot,
      text: "Standorte",
      href: "/admin/locations",
    },
    {
      icon: faTags,
      text: "Rabatte",
      href: "/admin/discounts",
    },
    // {
    //   icon: faFileLines,
    //   text: "Rechnungen",
    //   href: "#",
    // },
    // {
    //   icon: faCarSide,
    //   text: "Kfz",
    //   href: "#",
    // },
    // {
    //   icon: faPaperPlane,
    //   text: "E-Mail Templates",
    //   href: "#",
    // },
    {
      icon: faUsers,
      text: "Benutzer & Rollen",
      href: "/admin/users",
    },
    {
      icon: faReceipt,
      text: "Logs",
      href: "/admin/logs",
    },
    // {
    //   icon: faWrench,
    //   text: "Einstellungen",
    //   href: "#",
    // },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: "#050a30",
            color: "#e5e7eb",
          },
        }}
      >
        <DrawerHeader>
          <Image
            src="/img/CarfullyLogo.png"
            width={178}
            height={24}
            alt="Logo"
            style={{ ...(!open && { display: "none" }) }}
          />
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            // edge="start"
            sx={{
              textAlign: "left",
              color: "#d1d5db",
              marginRight: "6px",
              // ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ backgroundColor: "#475569" }} />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => router.push(item.href)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-5 h-5 text-gray-200"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
          {children}
        </LocalizationProvider>
      </Box>
    </Box>
  );
}
