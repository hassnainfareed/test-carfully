import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from './authOptions';

export async function guardRoute(
	req: NextRequest,
	allowGuest: boolean = false
) {
	console.log('RouteGuard - Headers:', req.headers);
	console.log('RouteGuard - Allow Guest:', allowGuest);

	const isGuestBooking = req.headers.get('x-guest-booking') === 'true';
	console.log('RouteGuard - Is Guest Booking:', isGuestBooking);

	// If guest booking is allowed and this is a guest request, allow access
	if (allowGuest && isGuestBooking) {
		console.log('RouteGuard - Allowing guest access');
		return null;
	}

	// Check for authenticated session
	const session = await getServerSession(authOptions);
	if (!session) {
		console.log('RouteGuard - No session found, denying access');
		return new NextResponse('Nicht eingeloggt', { status: 401 });
	}

	console.log('RouteGuard - Session found, allowing access');
	return null;
}
