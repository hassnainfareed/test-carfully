import { User } from '@prisma/client';
import axiosInstance from '@/utils/axiosConfig';

export default class GuestUserService {
	async createGuestUser(
		email: string,
		bookingNumber?: string
	): Promise<User> {
		try {
			console.log('GuestUserService - Creating guest user:', email);
			const res = await axiosInstance.post('/api/authentication/guest', {
				email,
				bookingNumber,
				headers: {
					'x-guest-booking': 'true',
				},
			});
			console.log('GuestUserService - Response:', res.data);
			return res.data;
		} catch (error) {
			console.error('GuestUserService - Error:', error);
			throw error;
		}
	}
}
