import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import { BookingStatus } from '@prisma/client';
import { LocationModel } from '@/services/contracts/LocationRepository';
import { guardRoute } from '@/utils/routeGuard';

export async function GET(req: NextRequest) {
	// Check if this is a guest booking request
	const guard = await guardRoute(req, true);
	if (guard) return guard;

	const locations = await prisma.location.findMany({
		select: {
			id: true,
			city: true,
			name: true,
			number: true,
			postalCode: true,
			street: true,
			activeFromDate: true,
			highBookings: true,
			maxBookings: true,
			mondayStart: true,
			mondayEnd: true,
			tuesdayStart: true,
			tuesdayEnd: true,
			wednesdayStart: true,
			wednesdayEnd: true,
			thursdayStart: true,
			thursdayEnd: true,
			fridayStart: true,
			fridayEnd: true,
			saturdayStart: true,
			saturdayEnd: true,
			sundayStart: true,
			sundayEnd: true,
			Booking: {
				where: {
					OR: [
						{
							status: BookingStatus.ASSIGNING,
						},
						{
							status: BookingStatus.ACTIVE,
						},
					],
				},
			},
		},
	});

	var locationModels: LocationModel[] = [];

	var currentDate = new Date();

	locations.map((location) => {
		let locationModel: LocationModel = {
			id: location.id,
			name: location.name,
			street: location.street,
			number: location.number,
			postalCode: location.postalCode,
			city: location.city,
			disabled: false,
			mondayStart: location.mondayStart,
			mondayEnd: location.mondayEnd,
			tuesdayStart: location.tuesdayStart,
			tuesdayEnd: location.tuesdayEnd,
			wednesdayStart: location.wednesdayStart,
			wednesdayEnd: location.wednesdayEnd,
			thursdayStart: location.thursdayStart,
			thursdayEnd: location.thursdayEnd,
			fridayStart: location.fridayStart,
			fridayEnd: location.fridayEnd,
			saturdayStart: location.saturdayStart,
			saturdayEnd: location.saturdayEnd,
			sundayStart: location.sundayStart,
			sundayEnd: location.sundayEnd,
		};

		if (location.activeFromDate && location.activeFromDate > currentDate) {
			locationModel.disabled = true;
			locationModel.disabledByDate = true;
		}

		if (
			location.highBookings &&
			location.highBookings <= location.Booking.length
		) {
			locationModel.disabledByHighBookings = true;
		}

		if (
			location.maxBookings &&
			location.maxBookings <= location.Booking.length
		) {
			locationModel.disabled = true;
			locationModel.disabledByMaxBookings = true;
		}

		locationModels.push(locationModel);
	});

	return NextResponse.json(locationModels);
}
