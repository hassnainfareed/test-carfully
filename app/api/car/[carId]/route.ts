import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import { guardRoute } from '@/utils/routeGuard';

export async function GET(req: NextRequest) {
	// Check if this is a guest booking request
	const guard = await guardRoute(req, true);
	if (guard) return guard;

	const carId = req.url.slice(req.url.lastIndexOf('/') + 1);

	try {
		const car = await prisma.car.findUnique({
			where: {
				id: carId!,
			},
			select: {
				id: true,
				carBrandId: true,
				carModelId: true,
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

		return NextResponse.json(car);
	} catch (error) {
		console.error('Error fetching car:', error);
		return new NextResponse('Error fetching car', { status: 500 });
	}
}
