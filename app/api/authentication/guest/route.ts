import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/db';
import { generatePassword } from '@/utils/passwordGenerator';
import { generateBookingAccessToken } from '@/utils/bookingToken';
import Logger from '@/utils/winstonLogger';
import { SendMailGuestCredentials } from '@/templates/mail/sendMailGuestCredentials';

var logger = Logger('Route authentication/guest');

export async function POST(request: Request) {
	const { email, bookingNumber } = await request.json();

	if (!email) {
		return new NextResponse('E-Mail konnte nicht gelesen werden', {
			status: 400,
		});
	}

	const emailLower = email.toLowerCase();

	// Check if user exists
	const existingUser = await prisma.user.findUnique({
		where: { email: emailLower },
		select: { id: true },
	});

	if (existingUser) {
		return new NextResponse(
			'Diese Email ist bereits registriert. Bitte loggen Sie sich ein.',
			{
				status: 400,
			}
		);
	}

	// Generate random password and booking access token
	const generatedPassword = generatePassword();
	const hashedPassword = await bcrypt.hash(generatedPassword, 10);
	const bookingAccessToken = generateBookingAccessToken();

	// Create new user
	const user = await prisma.user.create({
		data: {
			email: emailLower,
			password: hashedPassword,
			emailVerified: new Date(),
			provider: 'guest',
			bookingAccessToken: bookingAccessToken,
		},
	});

	logger.info('Guest user created', emailLower);

	// Send enhanced email with credentials and booking info
	await SendMailGuestCredentials(
		emailLower,
		generatedPassword,
		bookingNumber,
		bookingAccessToken
	);

	return NextResponse.json({
		id: user.id,
		bookingAccessToken: bookingAccessToken,
	});
}
