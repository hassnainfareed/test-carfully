import { UpdateBookingStatusParams } from '@/app/api/booking/updateStatus/route';
import { BookingDto } from '@/types/booking';
import { Booking, BookingStatus } from '@prisma/client';
import axios from 'axios';

export async function createBooking(bookingDto: BookingDto) {
	const headers = bookingDto.isGuestBooking
		? { 'x-guest-booking': 'true' }
		: {};
	console.log('BookingService - Request Data:', {
		bookingDto,
		headers,
	});

	try {
		const res = await axios.post('/api/booking', bookingDto, { headers });
		// res.data will be the URL to redirect to
		return res.data;
	} catch (error: any) {
		console.error('BookingService - Error Details:', {
			message: error.message,
			response: error.response?.data,
		});
		throw error;
	}
}

export async function getBookings() {
	const res = await axios.get('/api/booking');
	return res.data as Booking[];
}

export async function getBooking(bookingId: string) {
	const res = await axios.get(
		`/api/booking/byBookingId?bookingId=${bookingId}`
	);
	return res.data as Booking;
}

export async function getBookingsByLocation(locationId: string) {
	const res = await axios.get(
		`/api/booking/byLocationId?locationId=${locationId}`
	);
	return res.data as Booking[];
}

export async function updateStatus(
	updateBookingStatusParams: UpdateBookingStatusParams
) {
	const res = await axios.put(
		`/api/booking/updateStatus`,
		updateBookingStatusParams
	);

	return res.data;
}
