"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Box, Button, Menu, MenuProps, alpha, styled } from "@mui/material";
import { useRouter } from "next/navigation";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";

export default function NavigationLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const MAX_EMAIL_LENGTH_FOR_DISPLAY = 10;
  let userEmail = session?.user?.email;
  if (userEmail) {
    if (userEmail.length > MAX_EMAIL_LENGTH_FOR_DISPLAY) {
      userEmail = `${userEmail.substring(0, MAX_EMAIL_LENGTH_FOR_DISPLAY)}...`;
    }
  }

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));

  return (
    <>
      {/* Logged in */}
      {session?.user ? (
        <>
          <div className="hidden md:block">
            <FontAwesomeIcon
              className="h-5 w-5 text-green-600 mr-2"
              icon={faWhatsapp}
            />
            <a
              href="phone:+4917687731630"
              className="text-gray-200 font-bold mr-3"
            >
              +49 17687731630
            </a>
          </div>

          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            <PersonIcon className="block md:hidden" />
            <span className="hidden md:block">{userEmail}</span>
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <div className="px-4 py-3 border-gray-600">
              <p className="text-sm font-bold leading-5">Eingeloggt als</p>
              <p className="text-sm font-medium leading-5 truncate">
                {session.user.email}
              </p>
            </div>

            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => router.push("/user")} disableRipple>
              <SettingsIcon />
              Benutzerkonto
            </MenuItem>
            <MenuItem onClick={() => signOut()} disableRipple>
              <LogoutIcon />
              Ausloggen
            </MenuItem>
          </StyledMenu>
        </>
      ) : (
        <>
          {/* Not logged in */}
          <Box
            sx={{
              flexGrow: 0,
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="hidden md:block">
              <FontAwesomeIcon
                className="h-5 w-5 text-green-600 mr-2"
                icon={faWhatsapp}
              />
              <a
                href="phone:+4917687731630"
                className="text-gray-200 font-bold mr-3"
              >
                +49 17687731630
              </a>
            </div>

            <Button
              id="demo-customized-button"
              aria-controls={open ? "demo-customized-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="contained"
              disableElevation
              startIcon={<LoginIcon />}
              onClick={() => router.push("/authentication/login")}
            >
              <p className="hidden sm:block">Anmelden</p>
            </Button>
          </Box>
        </>
      )}
    </>
  );
}
