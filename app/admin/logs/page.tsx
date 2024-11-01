"use client";

import React, { useState, useEffect } from "react";
import { Log } from "@prisma/client";
import { useRouter } from "next/navigation";
import { AdminService } from "@/services/AdminService";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  deDE,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  deDE
);

export default function Logs() {
  const router = useRouter();

  const adminService = new AdminService();

  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    adminService.getLogs().then((data) => {
      setLogs(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef[] = [
    {
      field: "timestamp",
      headerName: "Zeit",
      width: 160,
      valueGetter: (params) => {
        const log = params.row as Log;
        if (log) {
          return dayjs(log.timestamp).format("DD.MM.YYYY HH:mm:ss");
        }
      },
    },
    {
      field: "level",
      headerName: "Level",
      width: 60,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const log = params.row as Log;
        if (log && log.level === "error") {
          return (
            <div className="px-1 bg-red-600 text-gray-100">{log.level}</div>
          );
        }
      },
    },
    {
      field: "label",
      headerName: "Label",
      width: 150,
    },
    {
      field: "email",
      headerName: "User",
      width: 150,
    },
    {
      field: "message",
      headerName: "Message",
      flex: 1,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex flex-row justify-end mb-2"></div>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={logs}
            columns={columns}
            hideFooter={false}
            rowSelection={false}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
