import { NextRequest, NextResponse } from 'next/server';
import { getServicesByLocationIdAndCarId } from '../serviceProvider';
import prisma from '@/db';
import { guardRoute } from '@/utils/routeGuard';

export async function GET(req: NextRequest, res: NextResponse) {
	// Allow access for guest booking
	const guard = await guardRoute(req, true);
	if (guard) return guard;

	const locationId = req.nextUrl.searchParams.get('locationId');
	const carId = req.nextUrl.searchParams.get('carId');

	if (locationId && carId) {
		const services = await getServicesByLocationIdAndCarId(
			locationId,
			carId
		);
		return NextResponse.json(services);
	}

	return NextResponse.json(null, { status: 400 });
}
