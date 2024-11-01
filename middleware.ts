import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { ROLE_ADMIN, ROLE_EMPLOYEE } from './constants';

export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const path = req.nextUrl.pathname;

		// Allow guest-booking path without authentication
		if (path.startsWith('/guest-booking')) {
			return NextResponse.next();
		}

		// Handle /booking path - Check if user is authenticated
		if (path.startsWith('/booking')) {
			if (!req.nextauth.token) {
				return NextResponse.redirect(
					new URL('/guest-booking', req.url)
				);
			}
			return NextResponse.next();
		}

		// Admin role check
		if (
			path.startsWith('/admin') &&
			req.nextauth.token?.role !== ROLE_ADMIN
		) {
			return NextResponse.redirect(
				new URL('/authentication/login', req.url)
			);
		}

		// Employee/Admin role check for manage area
		if (
			path.startsWith('/manage') &&
			req.nextauth.token?.role !== ROLE_ADMIN &&
			req.nextauth.token?.role !== ROLE_EMPLOYEE
		) {
			return NextResponse.redirect(
				new URL('/authentication/login', req.url)
			);
		}

		// User area check - must be authenticated
		if (path.startsWith('/user') && !req.nextauth.token) {
			return NextResponse.redirect(
				new URL('/authentication/login', req.url)
			);
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
		pages: {
			signIn: '/authentication/login',
		},
	}
);

// Specify which routes should be protected by the middleware
export const config = {
	matcher: [
		'/booking/:path*',
		'/admin/:path*',
		'/manage/:path*',
		'/user/:path*',
	],
};
