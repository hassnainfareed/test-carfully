"use client";

import React, { useState, useEffect } from "react";
import { Location, Service } from "@prisma/client";
import { useRouter } from "next/navigation";
import LocationService from "@/services/LocationService";
import ServiceService from "@/services/ServiceService";
import { GUID_EMPTY } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  deDE,
} from "@mui/x-data-grid";
import { Button, ThemeProvider, createTheme } from "@mui/material";

export default function Locations() {
  const router = useRouter();

  const locationService = new LocationService();

  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    locationService.getAll().then((data) => setLocations(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = createTheme(
    {
      palette: {
        primary: { main: "#1976d2" },
      },
    },
    deDE
  );

  function insertLocation() {
    router.push(`/admin/locations/${GUID_EMPTY}`);
  }

  function handleEdit(e: any) {
    router.push(`/admin/locations/${e.row.key}`);
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "",
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const location = params.row as Location;
        if (location) {
          return (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                router.push(`/admin/locations/${location.id}`);
              }}
            >
              Bearbeiten
            </Button>
          );
        }
      },
      width: 150,
    },
    {
      field: "name",
      headerName: "Standortname",
      width: 150,
    },

    {
      field: "street",
      headerName: "Straße",
      width: 150,
    },
    {
      field: "number",
      headerName: "Hausnummer",
      width: 150,
    },
    {
      field: "postalCode",
      headerName: "PLZ",
      width: 150,
    },
    {
      field: "city",
      headerName: "Ort",
      width: 150,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex flex-row justify-end mb-2">
          <a
            onClick={(e) => insertLocation()}
            className="relative flex ml-2 items-center justify-center h-10 px-4 m-y-2 bg-green-700 rounded-lg hover:bg-green-800 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="h-5 w-5 pr-2 text-slate-100"
            />
            <span className="relative text-md font-normal text-slate-100 max-md:hidden">
              Standort hinzufügen
            </span>
          </a>
        </div>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={locations}
            columns={columns}
            hideFooter={false}
            rowSelection={false}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
