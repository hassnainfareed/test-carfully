import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import Logger from '@/utils/winstonLogger';
import { guardRoute } from '@/utils/routeGuard';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

var logger = Logger('Route car');

export async function POST(req: NextRequest, res: NextResponse) {
	// Check if this is a guest booking request
	const guard = await guardRoute(req, true);
	if (guard) return guard;

	const { licenseNumber, carBrandId, carModelId, isGuestBooking } =
		await req.json();

	try {
		if (isGuestBooking) {
			const cookieStore = cookies();
			let guestSessionId = cookieStore.get('guest_session_id')?.value;
			if (!guestSessionId) {
				guestSessionId = uuidv4();
				cookieStore.set('guest_session_id', guestSessionId, {
					maxAge: 60 * 60 * 24,
					path: '/',
				});
			}

			const newCar = await prisma.car.create({
				data: {
					licenseNumber: licenseNumber,
					CarBrand: {
						connect: { id: carBrandId },
					},
					CarModel: {
						connect: { id: carModelId },
					},
					user: {
						create: {
							email: `guest_${guestSessionId}@temp.carfully.app`,
							password: 'temp',
							provider: 'guest_temp',
							emailVerified: new Date(),
							guestSessionId: guestSessionId, // Use the mapped field name
						},
					},
				},
				select: {
					id: true,
					licenseNumber: true,
					CarBrand: {
						select: {
							id: true,
							name: true,
						},
					},
					CarModel: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});
			return NextResponse.json(newCar);
		} else {
			// For authenticated users, continue with existing logic
			const session = await getServerSession(authOptions);
			if (!session) {
				return new NextResponse('Nicht eingeloggt', { status: 401 });
			}

			const user = await prisma.user.findUnique({
				where: {
					email: session.user!.email!,
				},
				select: {
					id: true,
				},
			});

			if (!user) {
				return NextResponse.json(
					{
						message: 'Benutzer existiert nicht',
					},
					{
						status: 400,
					}
				);
			}

			const newCar = await prisma.car.create({
				data: {
					licenseNumber: licenseNumber,
					carBrandId: carBrandId,
					carModelId: carModelId,
					userId: user.id,
				},
			});

			return NextResponse.json(newCar);
		}
	} catch (error) {
		logger.error(JSON.stringify(error));
		return NextResponse.json(
			{
				message: JSON.stringify(error),
			},
			{
				status: 400,
			}
		);
	}
}

export async function GET(req: NextRequest, res: NextResponse) {
	// Check if this is a guest booking request
	const guard = await guardRoute(req, true);
	if (guard) return guard;

	const session = await getServerSession(authOptions);
	const isGuestBooking = req.headers.get('x-guest-booking') === 'true';

	if (isGuestBooking) {
		const cookieStore = cookies();
		const guestSessionId = cookieStore.get('guest_session_id')?.value;

		if (!guestSessionId) {
			return NextResponse.json([]);
		}

		const guestCars = await prisma.car.findMany({
			where: {
				user: {
					provider: 'guest_temp',
					guestSessionId: guestSessionId, // Use the mapped field name
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			select: {
				id: true,
				licenseNumber: true,
				userId: true,
				CarBrand: {
					select: {
						id: true,
						name: true,
					},
				},
				CarModel: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		return NextResponse.json(guestCars);
	}

	// For authenticated users, continue with existing logic
	if (!session) {
		return NextResponse.json([]);
	}

	const user = await prisma.user.findUnique({
		where: {
			email: session.user!.email!,
		},
	});

	if (!user) {
		return new NextResponse('Benutzer existiert nicht', { status: 401 });
	}

	const cars = await prisma.car.findMany({
		where: {
			userId: user?.id,
		},
		select: {
			id: true,
			licenseNumber: true,
			userId: true,
			CarBrand: {
				select: {
					id: true,
					name: true,
				},
			},
			CarModel: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});

	return NextResponse.json(cars);
}
