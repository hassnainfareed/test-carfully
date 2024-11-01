import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import { guardRoute } from '@/utils/routeGuard';

export async function GET(req: NextRequest) {
	// Check if this is a guest booking request
	const guard = await guardRoute(req, true);
	if (guard) return guard;

	const id = req.url.slice(req.url.lastIndexOf('/') + 1);

	try {
		const carModels = await prisma.carModel.findMany({
			where: {
				carBrandId: id!,
			},
			select: {
				id: true,
				carBrandId: true,
				name: true,
				length: true,
				priceCategoryId: true,
				CarBrand: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: {
				name: 'asc',
			},
		});

		return NextResponse.json(carModels);
	} catch (error) {
		console.error('Error fetching car models:', error);
		return new NextResponse('Error fetching car models', { status: 500 });
	}
}
