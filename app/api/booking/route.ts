import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { BookingDto } from '@/types/booking';
import prisma from '@/db';
import createMollieClient, { Locale, Payment } from '@mollie/api-client';
import { Booking, BookingPaymentStatus, BookingStatus } from '@prisma/client';
import { getBookingNumber } from '@/utils/bookingHelper';
import { getTotal } from '@/redux/features/bookingSlice';
import { SendMailBookingCustomer } from '@/templates/mail/sendMailBookingCustomer';
import { SendMailBookingEmployee } from '@/templates/mail/sendMailBookingEmployee';
import { getServicesByLocationIdAndCarId } from '../service/serviceProvider';
import SendSmsBookingInbound from '@/templates/sms/sendSmsBookingInbound';
import Logger from '@/utils/winstonLogger';
import { getSession, isAdmin } from '../roleChecker';
import GuestUserService from '@/services/GuestUserService';
import { guardRoute } from '@/utils/routeGuard';

var logger = Logger('route booking');

const mollieClient = createMollieClient({
	apiKey: process.env.MOLLIE_API_KEY as string,
});

export async function GET(req: NextRequest, res: NextResponse) {
	const session = await getSession();
	if (!session) {
		return new NextResponse('Nicht eingeloggt', { status: 401 });
	}

	if (!(await isAdmin(session))) {
		logger.error(
			`user ${session!.user!.email} tried to enter admin booking`
		);
		return new NextResponse('Nicht autorisiert', { status: 403 });
	}

	try {
		const bookings = await prisma.booking.findMany({
			select: {
				id: true,
				date: true,
				locationId: true,
				userId: true,
				carId: true,
				status: true,
				parkingSpot: true,
				number: true,
				car: true,
				assigned: true,
				totalPrice: true,
				isNow: true,
				appointmentDate: true,
				appointmentTime: true,
				fuelCardNumber: true,
				location: {
					select: {
						id: true,
						name: true,
						street: true,
						number: true,
						postalCode: true,
						city: true,
					},
				},
			},
		});
		return NextResponse.json(bookings);
	} catch (e) {
		logger.error(JSON.stringify(e));
	}
}

export async function POST(req: NextRequest, res: NextResponse) {
	console.log('Booking API - Headers:', req.headers);
	const isGuestBooking = req.headers.get('x-guest-booking') === 'true';
	console.log('Booking API - Is Guest Booking:', isGuestBooking);

	// Check if this is a guest booking request
	const guard = await guardRoute(req, true);
	if (guard) {
		console.log('Booking API - Guard denied access');
		return guard;
	}

	try {
		const booking: BookingDto = await req.json();
		console.log('Booking API - Request body:', booking);

		// Validate required fields with detailed error messages
		const validationErrors = [];

		if (!booking.carId) {
			validationErrors.push('Car ID is required');
		}
		if (!booking.locationId) {
			validationErrors.push('Location ID is required');
		}
		if (!booking.parkingSpot && booking.isNow) {
			validationErrors.push(
				'Parking spot is required for immediate bookings'
			);
		}
		if (!booking.serviceIds || booking.serviceIds.length === 0) {
			validationErrors.push('At least one service must be selected');
		}
		if (isGuestBooking && !booking.guestEmail) {
			validationErrors.push('Guest email is required for guest booking');
		}
		if (booking.isFuelCardSelected && !booking.fuelCardNumber) {
			validationErrors.push(
				'Fuel card number is required when fuel card is selected'
			);
		}
		if (
			!booking.isNow &&
			(!booking.appointmentDate || !booking.appointmentTime)
		) {
			validationErrors.push(
				'Appointment date and time are required for scheduled bookings'
			);
		}

		if (validationErrors.length > 0) {
			console.error('Booking API - Validation Errors:', validationErrors);
			return NextResponse.json(
				{ message: validationErrors.join(', ') },
				{ status: 400 }
			);
		}

		let userId: string;

		try {
			if (isGuestBooking) {
				// Handle guest booking
				try {
					const guestUserService = new GuestUserService();
					const guestUser = await guestUserService.createGuestUser(
						booking.guestEmail!
					);
					userId = guestUser.id;
					console.log('Booking API - Created guest user:', userId);
				} catch (error) {
					console.error(
						'Booking API - Guest user creation error:',
						error
					);
					return NextResponse.json(
						{
							message:
								'Failed to create guest user. Please try again.',
						},
						{ status: 400 }
					);
				}
			} else {
				// Handle authenticated booking
				const session = await getServerSession(authOptions);
				if (!session) {
					return new NextResponse('Nicht eingeloggt', {
						status: 401,
					});
				}
				const user = await prisma.user.findUnique({
					where: { email: session.user!.email! },
					select: { id: true },
				});
				if (!user) {
					return new NextResponse('Benutzer nicht gefunden', {
						status: 400,
					});
				}
				userId = user.id;
			}

			logger.info('Booking started', userId);

			const services = await getServicesByLocationIdAndCarId(
				booking.locationId,
				booking.carId
			);

			const usedServices = services.filter((v) => {
				return booking.serviceIds.includes(v.id);
			});

			var description: string = '';

			usedServices.forEach((e, i) => {
				description += `${e.name} `;
			});

			const bookingNo = getBookingNumber();

			logger.info(`Bookingnumber ${bookingNo}`, userId);

			// Determine payment status based on fuel card selection
			const paymentStatus = booking.isFuelCardSelected
				? BookingPaymentStatus.FUEL_CARD
				: BookingPaymentStatus.PENDING;

			// Create Booking object with explicit null handling
			const bookingEntity = await prisma.booking.create({
				data: {
					date: new Date(),
					carId: booking.carId,
					locationId: booking.locationId,
					parkingSpot: booking.parkingSpot || '',
					totalPrice: booking.totalPrice,
					userId: userId,
					number: bookingNo,
					isNow: booking.isNow,
					appointmentDate: booking.appointmentDate || null,
					appointmentTime: booking.appointmentTime || null,
					isFuelCardSelected: booking.isFuelCardSelected,
					fuelCardNumber: booking.isFuelCardSelected
						? booking.fuelCardNumber
						: null,
					paymentStatus: booking.isFuelCardSelected
						? BookingPaymentStatus.FUEL_CARD
						: BookingPaymentStatus.PENDING,
					status: BookingStatus.CREATED,
				},
			});

			console.log('Booking API - Created booking:', bookingEntity);

			logger.info(`Booking entity created ${bookingNo}`, userId);

			// Create ServicesOnBookings
			booking.serviceIds.forEach(async (id) => {
				await prisma.servicesOnBookings.create({
					data: {
						bookingId: bookingEntity.id,
						serviceId: id,
					},
				});
			});

			logger.info(
				`ServicesOnBookings entities created ${bookingNo}`,
				userId
			);

			// Check price manipulation
			const date = new Date();

			let totalPrice = getTotal(
				usedServices,
				undefined,
				undefined,
				undefined
			);

			if (booking.discountCode) {
				const discount = await prisma.discount.findFirst({
					where: {
						AND: {
							code: booking.discountCode,
							valid: true,
							validFrom: { lt: date },
							validTo: { gt: date },
						},
					},
					select: {
						id: true,
						discountType: true,
						value: true,
						validForServiceId: true,
						oneTime: true,
					},
				});

				totalPrice = getTotal(
					usedServices,
					discount?.discountType,
					discount?.value,
					discount?.validForServiceId
				);

				if (totalPrice !== booking.totalPrice) {
					logger.error('Fehler bei der Preisberechnung', userId);
					return new NextResponse('Fehler bei der Preisberechnung', {
						status: 400,
					});
				}

				// Check OneTime Discount
				if (discount && discount.oneTime) {
					await prisma.discount.update({
						where: {
							id: discount.id,
						},
						data: {
							valid: false,
						},
					});
				}
			}

			logger.info(`Booking totalPrice ${booking.totalPrice}`, userId);
			logger.info(`Booking total ${bookingNo} - ${totalPrice}`, userId);

			if (totalPrice !== booking.totalPrice) {
				logger.error('Fehler bei der Preisberechnung', userId);
				return new NextResponse('Fehler bei der Preisberechnung', {
					status: 400,
				});
			}

			// For fuel card payments or free bookings
			if (booking.isFuelCardSelected) {
				await confirmBooking(bookingEntity);
				// Only change this part to handle guest booking URL
				const bookingUrl = isGuestBooking
					? `/guest-booking/${bookingEntity.id}`
					: `/booking/${bookingEntity.id}`;
				logger.info('Booking finished', userId);
				return NextResponse.json(bookingUrl);
			} else if (totalPrice === 0) {
				await confirmBooking(bookingEntity);
				// And this part for free bookings
				const bookingUrl = isGuestBooking
					? `/guest-booking/${bookingEntity.id}`
					: `/booking/${bookingEntity.id}`;
				logger.info('Free booking finished', userId);
				return NextResponse.json(bookingUrl);
			} else {
				// For Mollie payments, proceed with payment creation
				const baseUrl = process.env.SERVER_URL || req.nextUrl.origin;

				try {
					// Create Payment object to get the tracking id
					const payment: Payment = await mollieClient.payments.create(
						{
							amount: {
								value: booking.totalPrice.toFixed(2).toString(),
								currency: 'EUR',
							},
							locale: Locale.de_DE,
							description: description,
							redirectUrl: `${baseUrl}/booking/${bookingEntity.id}`,
							webhookUrl: `${baseUrl}/api/booking/webhook`,
						}
					);

					logger.info(
						`Booking Payment created ${bookingNo} - ${payment.id}`,
						userId
					);

					const mollieUrl = payment.getCheckoutUrl();

					await prisma.booking.update({
						where: {
							id: bookingEntity.id,
						},
						data: {
							paymentId: payment.id,
							paymentStatus: BookingPaymentStatus.OPEN,
						},
					});

					logger.info('Mollie booking finished', userId);

					return NextResponse.json(mollieUrl);
				} catch (error) {
					logger.error(JSON.stringify(error));
					return NextResponse.json(JSON.stringify(error), {
						status: 400,
					});
				}
			}
		} catch (error) {
			console.error('Booking API - Creation Error:', error);
			return NextResponse.json(
				{
					message:
						error instanceof Error
							? error.message
							: 'Unknown error occurred',
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error('Booking API - JSON Parse Error:', error);
		return NextResponse.json(
			{ message: 'Invalid request data' },
			{ status: 400 }
		);
	}
}

export const confirmBooking = async (booking: Booking) => {
	const user = await prisma.user.findFirst({
		where: {
			id: booking?.userId,
		},
		select: {
			email: true,
		},
	});

	logger.info('confirmBooking starting', user?.email);

	const location = await prisma.location.findFirst({
		where: {
			id: booking?.locationId,
		},
	});

	const car = await prisma.car.findFirst({
		where: {
			id: booking?.carId,
		},
	});

	const services = await prisma.servicesOnBookings.findMany({
		where: {
			bookingId: booking?.id,
		},
		include: {
			service: true,
		},
	});

	var description: string = '';

	services.forEach((e, i) => {
		description += `${e.service.name} `;
	});

	// Create invoice
	await prisma.invoice.create({
		data: {
			bookingId: booking?.id!,
		},
	});

	await prisma.booking.update({
		where: {
			id: booking?.id,
		},
		data: {
			status: BookingStatus.ASSIGNING,
		},
	});

	try {
		// await SendWhatsAppBookingInbound(
		//   location?.whatsAppReceiver,
		//   booking?.id!,
		//   booking?.number!,
		//   location?.name!,
		//   booking?.parkingSpot!,
		//   car?.licenseNumber!,
		//   description,
		// );

		await SendSmsBookingInbound(
			location?.smsReceiver,
			booking?.id!,
			booking?.number!,
			location?.name!,
			booking?.parkingSpot!,
			car?.licenseNumber!,
			description,
			booking.isNow,
			booking.appointmentDate,
			booking.appointmentTime
		);

		await SendMailBookingEmployee(
			location?.emailReceiver,
			booking?.id!,
			booking?.number!,
			location?.name!,
			booking?.parkingSpot!,
			car?.licenseNumber!,
			description,
			booking.isNow,
			booking.appointmentDate,
			booking.appointmentTime
		);

		await SendMailBookingCustomer(
			user!.email,
			booking?.number!,
			location?.name!,
			booking?.parkingSpot!,
			car?.licenseNumber!,
			description,
			booking.isNow,
			booking.appointmentDate,
			booking.appointmentTime
		);
	} catch (error) {
		logger.error(JSON.stringify(error));
		console.error(error);
	}

	logger.info('confirmBooking finished', user?.email);
};
