import crypto from 'crypto';

export const generateBookingAccessToken = () => {
	return crypto.randomBytes(32).toString('hex');
};
