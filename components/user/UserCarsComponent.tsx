import { Car, CarBrand, CarModel } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { getCars } from "@/services/CarService";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  deDE,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AddCarModal } from "../booking/AddCarModal";

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  deDE
);
export default function UserCarsComponent(props: {
  userId: string | undefined;
}) {
  const [cars, setCars] = useState<Car[]>([]);
  const [showAddCar, setShowAddCar] = useState<boolean>(false);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = () => {
    getCars().then((data) => setCars(data));
  };

  const columns: GridColDef[] = [
    {
      field: "licenseNumber",
      headerName: "",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const car = params.row as Car;
        const carBrand = params.row.CarBrand as CarBrand;
        const carModel = params.row.CarModel as CarModel;

        if (car && carBrand && carModel) {
          return (
            <div className="p-3 flex flex-row w-full">
              <div className="flex-1">
                <p className="font-bold">{car.licenseNumber}</p>
              </div>
              <div className="flex-1 flex flex-col gap-y-2">
                <p className="">{carBrand.name}</p>
                <p className="">{carModel.name}</p>
              </div>
            </div>
          );
        }
      },
    },
  ];

  return (
    <div id="itemCars">
      <div className="flex flex-row justify-between mb-2">
        <h3 className="text-lg font-semibold text-sky-600">Auto(s)</h3>
        <a
          onClick={(e) => setShowAddCar(true)}
          className="relative flex ml-2 items-center justify-center h-10 px-4 m-y-2 bg-sky-600 rounded-lg hover:bg-sky-700 cursor-pointer"
        >
          <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-slate-100" />
        </a>
      </div>
      {showAddCar && (
        <AddCarModal
          onAddCar={loadCars}
          open={true}
          onCloseModal={() => setShowAddCar(false)}
        />
      )}
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={cars}
          columns={columns}
          rowSelection={false}
          hideFooter={true}
          columnHeaderHeight={0}
          getRowHeight={() => "auto"}
          initialState={{
            sorting: {
              sortModel: [{ field: "licenseNumber", sort: "asc" }],
            },
          }}
        />
      </ThemeProvider>
      {/* <DataGrid
        dataSource={cars}
        keyExpr="id"
        // defaultColumns={columns}
        showBorders={true}
      >
        <Editing mode="form" allowUpdating={false} allowDeleting={false} />
        <Column
          dataField="licenseNumber"
          dataType="string"
          caption="Kennzeichen"
        />
        <Column dataField="CarBrand.name" dataType="string" caption="Marke" />
        <Column dataField="CarModel.name" dataType="string" caption="Modell" />
      </DataGrid> */}
    </div>
  );
}
