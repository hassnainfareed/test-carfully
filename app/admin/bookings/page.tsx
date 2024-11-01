'use client';

import React, { useState, useEffect } from 'react';
import { Booking, Car, Location } from '@prisma/client';
import {
	DataGrid,
	GridColDef,
	GridRenderCellParams,
	deDE,
} from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CellRenderBookingStatus from '@/components/cellRender/CellRenderBookingStatus';
import { getBookings } from '@/services/BookingService';
import { getTimeDescription } from '@/utils/bookingHelper';
import { exportToCSV } from '@/utils/csvHelper';
import Button from '@mui/material/Button';

const theme = createTheme(
	{
		palette: {
			primary: { main: '#1976d2' },
		},
	},
	deDE
);

export default function Bookings() {
	const [bookings, setBookings] = useState<Booking[]>([]);

	useEffect(() => {
		getBookings().then((data) => {
			//console.log('Fetched Bookings:', data);
			setBookings(data);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const columns: GridColDef[] = [
		{
			field: 'number',
			headerName: 'Buchungsnummer',
			width: 150,
		},
		{
			field: 'status',
			headerName: 'Status',
			renderCell: (params: GridRenderCellParams<any, string>) => {
				const booking = params.row as Booking;
				if (booking) {
					return (
						<div className="flex-1 flex flex-col gap-y-2">
							<CellRenderBookingStatus booking={booking} />
						</div>
					);
				}
			},
			width: 150,
		},
		{
			field: 'location.id',
			headerName: 'Standort',
			valueGetter: (params) => {
				const location = params.row.location as Location;
				if (location) {
					return location.name;
				}
			},
			width: 250,
		},
		{ field: 'parkingSpot', headerName: 'Parkplatz', width: 150 },
		{
			field: 'isNow',
			headerName: 'Info',
			width: 200,
			renderCell: (params: GridRenderCellParams<any, string>) => {
				const booking = params.row as Booking;
				if (booking) {
					return getTimeDescription(booking);
				}
			},
		},
		{
			field: 'car.licenseNumber',
			headerName: 'Kennzeichen',
			valueGetter: (params) => {
				const car = params.row.car as Car;
				if (car) {
					return car.licenseNumber;
				}
			},
		},
		{
			field: 'fuelCardNumber',
			headerName: 'Tankkartennummer',
			width: 180,
			valueGetter: (params) => {
				const booking = params.row as Booking;
				return booking.fuelCardNumber || '-';
			},
		},
		{
			field: 'booking.assigned',
			headerName: 'Bearbeiter',
			valueGetter: (params) => {
				const booking = params.row as Booking;
				if (booking) {
					return booking.assigned;
				}
			},
			width: 200,
		},
	];

	/**
	 * Handler for CSV download
	 */
	const [isExporting, setIsExporting] = useState(false);

	const handleDownloadCSV = async () => {
		const definedColumns = columns.map((col) => ({
			headerName: col.headerName || 'Unnamed Column',
			field: col.field,
		}));

		setIsExporting(true);
		await exportToCSV(bookings, definedColumns, 'bookings.csv');
		setIsExporting(false);
	};

	return (
		<div className="p-4">
			<div className="flex flex-col">
				<div className="flex flex-row justify-start mb-2">
					<Button
						variant="contained"
						color="primary"
						onClick={handleDownloadCSV}
						style={{ marginRight: '16px' }}
						disabled={isExporting}
					>
						{isExporting ? 'Exporting...' : 'Download CSV'}
					</Button>
				</div>

				<ThemeProvider theme={theme}>
					<DataGrid
						rows={bookings}
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
