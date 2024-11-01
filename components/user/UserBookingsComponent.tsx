import { Booking, Car, Location } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InvoiceService from "@/services/InvoiceService";
import { UserSelectAddressComponent } from "./UserSelectAddressComponent";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  deDE,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "@mui/material";
import CellRenderBookingStatus from "../cellRender/CellRenderBookingStatus";
import dayjs from "dayjs";
import UserService from "@/services/UserService";
import { getTimeDescription } from "@/utils/bookingHelper";
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

export default function UserBookingsComponent(props: {
  userId: string | undefined;
}) {
  const router = useRouter();
  const invoiceService = new InvoiceService();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingId, setBookingId] = useState<string>();
  const [showModal, setShowModal] = useState<Boolean>(false);

  const userService = new UserService();

  useEffect(() => {
    userService.getBookings().then((data) => setBookings(data));
  }, []);

  async function onInvoiceClick(bookingId: string) {
    setBookingId(bookingId);

    // check if an invoice was already created
    const invoice = await invoiceService.getInvoiceByBookingId(bookingId);

    if (!invoice) {
      return;
    }

    if (!invoice.documentCreated) {
      // if no address is stored
      // check if any address is stored
      setShowModal(true);
    } else {
      // if yes provide the previous created invoice
      router.push(`/api/invoice/download?bookingId=${bookingId}`);
    }
  }

  async function createInvoice(addressId: string) {
    // if yes provide the previous created invoice
    router.push(
      `/api/invoice/create?bookingId=${bookingId}&addressId=${addressId}`
    );
  }

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        const booking = params.row as Booking;

        const car = params.row.car as Car;
        const location = params.row.location as Location;
        if (booking && car && location) {
          return (
            <div className="p-2 flex flex-row w-full gap-x-2">
              <div className="flex-1">
                <p className="font-bold">{booking.number}</p>
                <p>{car.licenseNumber}</p>
                <p>{dayjs(booking.date).format("DD.MM.YYYY HH:mm")}</p>
                <p>{getTimeDescription(booking)}</p>
                <p>{location.name}</p>
              </div>
              <div className="flex-1 flex flex-col gap-y-2">
                <CellRenderBookingStatus booking={booking} />
                <Button
                  variant="outlined"
                  onClick={() => onInvoiceClick(booking.id)}
                >
                  Rechnung
                </Button>
              </div>
            </div>
          );
        }
      },
    },
  ];

  return (
    <>
      <div id="itemBookings">
        <h3 className="text-lg font-semibold text-sky-600 mb-2">Buchungen</h3>
        <ThemeProvider theme={theme}>
          <DataGrid
            rows={bookings}
            columns={columns}
            rowSelection={false}
            hideFooter={true}
            columnHeaderHeight={0}
            getRowHeight={() => "auto"}
            initialState={{
              sorting: {
                sortModel: [{ field: "date", sort: "asc" }],
              },
            }}
          />
        </ThemeProvider>
      </div>
      {showModal && (
        <UserSelectAddressComponent
          open={true}
          onConfirm={(addressId: string) => {
            setShowModal(false);
            createInvoice(addressId);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
