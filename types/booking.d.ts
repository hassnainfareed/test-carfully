import { Dayjs } from 'dayjs';

export class BookingDto {
	locationId: string;
	carId: string;
	serviceIds: string[];
	totalPrice: number;
	parkingSpot: string;
	discountCode: string;
	isNow: boolean;
	appointmentDate: Date | null;
	appointmentTime: Date | null;
	isFuelCardSelected: boolean;
	fuelCardNumber?: string;
	isGuestBooking?: boolean;
	guestEmail?: string;
}
