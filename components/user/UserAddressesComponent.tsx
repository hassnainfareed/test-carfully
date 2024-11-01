import { Address, AddressType, GenderType } from "@prisma/client";
import React, { useEffect, useState } from "react";
import AddressService from "@/services/AddressService";
import { GUID_EMPTY } from "@/constants";
import { UserEditAddressComponent } from "./UserEditAddressComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderCellParams,
  GridRowId,
  deDE,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  deDE
);

export default function UserAddressesComponent(props: {
  userId: string | undefined;
}) {
  const addressService = new AddressService();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressId, setAddressId] = useState<string>();

  useEffect(() => {
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadAddresses() {
    addressService.getAll().then((data) => {
      setAddresses(data);
    });
  }

  const columns: GridColDef[] = [
    {
      field: "addressType",
      headerName: "Typ",
      renderCell: (params: GridRenderCellParams<any, string>) => (
        <strong>
          {params.value === AddressType.BUSINESS ? "Geschäftlich" : "Privat"}
        </strong>
      ),
    },
    {
      field: "companyName",
      headerName: "Firma",
    },
    { field: "firstname", headerName: "Vorname", width: 150 },
    { field: "lastname", headerName: "Nachname", width: 150 },
    { field: "street", headerName: "Straße", width: 150 },
    { field: "number", headerName: "Hausnr." },
    { field: "postalCode", headerName: "PLZ", width: 150 },
    { field: "city", headerName: "Stadt", width: 150 },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          key={"delete"}
          icon={<DeleteIcon />}
          label="Löschen"
          onClick={deleteUser(params.id)}
        />,
        <GridActionsCellItem
          key={"toggle"}
          icon={<EditIcon />}
          label="Bearbeiten"
          onClick={editUser(params.id)}
        />,
      ],
    },
  ];

  const editUser = React.useCallback(
    (id: GridRowId) => async () => {
      setAddressId(id.toString());
      setShowModal(true);
    },
    []
  );

  const deleteUser = React.useCallback(
    (id: GridRowId) => async () => {
      await addressService.delete(id.toString());
      loadAddresses();
    },
    []
  );
  function handleCreateAddress() {
    setAddressId(GUID_EMPTY);
    setShowModal(true);
  }

  return (
    <>
      <div id="itemAddresses" className="border-gray-300 border-0 rounded-xl">
        <div className="flex flex-row justify-between mb-2">
          <h3 className="text-lg font-semibold text-sky-600">Adresse(n)</h3>
          <a
            onClick={(e) => handleCreateAddress()}
            className="relative flex ml-2 items-center justify-center h-10 px-4 m-y-2 bg-sky-600 rounded-lg hover:bg-sky-700 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5 text-slate-100" />
          </a>
        </div>

        <ThemeProvider theme={theme}>
          <DataGrid rows={addresses} columns={columns} hideFooter={true} />
        </ThemeProvider>
      </div>
      {showModal && (
        <UserEditAddressComponent
          open={true}
          onConfirm={() => {
            setShowModal(false);
            loadAddresses();
          }}
          onClose={() => {
            setShowModal(false);
          }}
          addressId={addressId}
        />
      )}
    </>
  );
}
