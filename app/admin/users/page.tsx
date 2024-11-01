"use client";

import React, { useState, useEffect, MouseEventHandler } from "react";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  deDE,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CheckBox } from "devextreme-react";
import UserService from "@/services/UserService";
import dayjs from "dayjs";
import { Button, Typography } from "@mui/material";
import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_USER } from "@/constants";
// import { TIMEZONE } from "@/constants";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault(TIMEZONE);

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  deDE
);

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  const userService = new UserService();

  useEffect(() => {
    userService.getAllUsers().then((data) => {
      setUsers(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateRole = async (id: string, role: string) => {
    await userService.updateRole({ id: id, role: role });
    userService.getAllUsers().then((data) => {
      setUsers(data);
    });
  };

  const columns: GridColDef[] = [
    {
      field: "email",
      headerName: "E-Mail",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Erstellt am",
      width: 200,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const user = params.row as User;
        if (user) {
          return dayjs(user.createdAt).format("DD.MM.YYYY HH:mm");
        }
      },
    },
    {
      field: "role",
      headerName: "Rolle",
      width: 100,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const user = params.row as User;
        if (user) {
          if (user.role === ROLE_ADMIN) {
            return <Typography color={"error"}>{user.role}</Typography>;
          } else if (user.role === ROLE_EMPLOYEE) {
            return <Typography color="secondary">{user.role}</Typography>;
          } else {
            return <Typography>{user.role}</Typography>;
          }
        }
      },
    },
    {
      field: "emailVerified",
      headerName: "E-Mail verifiziert",
      width: 200,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const user = params.row as User;
        if (user) {
          if (user.emailVerified) {
            return dayjs(user.emailVerified).format("DD.MM.YYYY HH:mm");
          }
        }
      },
    },
    {
      field: "id",
      headerName: "",
      width: 300,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const user = params.row as User;
        if (user) {
          return (
            <>
              <Button
                sx={{ marginRight: 1 }}
                variant="contained"
                color="primary"
                onClick={(e) => updateRole(user.id, ROLE_USER)}
              >
                USER
              </Button>
              <Button
                sx={{ marginRight: 1 }}
                variant="contained"
                color="secondary"
                onClick={(e) => updateRole(user.id, ROLE_EMPLOYEE)}
              >
                MITARBEITER
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={(e) => updateRole(user.id, ROLE_ADMIN)}
              >
                ADMIN
              </Button>
            </>
          );
        }
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex flex-row justify-end mb-2"></div>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={users}
            columns={columns}
            hideFooter={false}
            rowSelection={false}
            initialState={{
              pagination: { paginationModel: { pageSize: 100 } },
              sorting: {
                sortModel: [{ field: "createdAt", sort: "asc" }],
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
