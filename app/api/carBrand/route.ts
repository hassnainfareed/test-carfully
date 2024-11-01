import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { guardRoute } from '@/utils/routeGuard';

export async function GET(req: NextRequest, res: NextResponse) {
	// Check if this is a guest booking request
	const guard = await guardRoute(req, true);
	if (guard) return guard;

	const session = await getServerSession(authOptions);

	// For both guest and authenticated users, return car brands
	// as this is needed for the booking form
	const carBrands = await prisma.carBrand.findMany({
		select: {
			id: true,
			name: true,
		},
		orderBy: {
			name: 'asc',
		},
	});

	return NextResponse.json(carBrands);
}

// POST endpoint remains protected
export async function POST(req: Request, res: NextResponse) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return new NextResponse('Nicht eingeloggt', { status: 401 });
	}

	const { name } = await req.json();

	try {
		const newCarBrand = await prisma.carBrand.create({
			data: {
				name: name,
			},
		});

		return NextResponse.json(newCarBrand);
	} catch (error) {
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
