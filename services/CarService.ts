import { Car, CarBrand, CarModel } from '@prisma/client';
import axios from 'axios';

export async function getCars(isGuestBooking: boolean = false) {
	const headers = isGuestBooking ? { 'x-guest-booking': 'true' } : {};
	const res = await axios.get('/api/car', { headers });
	return res.data as Car[];
}

export async function getCar(carId: string) {
	var res = await axios.get(`/api/car/${carId}`);
	return res.data as Car;
}

export async function createCar(carDto: any, isGuestBooking: boolean = false) {
	const headers = isGuestBooking ? { 'x-guest-booking': 'true' } : {};
	const data = {
		...carDto,
		isGuestBooking,
	};
	console.log('Creating car with data:', data); // Add this for debugging
	const res = await axios.post('/api/car', data, { headers });
	return res.data;
}

export async function getCarBrands(isGuestBooking: boolean = false) {
	const headers = isGuestBooking ? { 'x-guest-booking': 'true' } : {};
	var res = await axios.get('/api/carBrand', { headers });
	return res.data as CarBrand[];
}

export async function getCarModelByCarBrandId(
	carBrandId: string,
	isGuestBooking: boolean = false
) {
	const headers = isGuestBooking ? { 'x-guest-booking': 'true' } : {};
	try {
		const res = await axios.get(`/api/carModel/${carBrandId}`, { headers });
		return res.data as CarModel[];
	} catch (error) {
		console.error('Error fetching car models:', error);
		return [];
	}
}

export async function getCarModelById(
	carModelId: string,
	isGuestBooking: boolean = false
) {
	const headers = isGuestBooking ? { 'x-guest-booking': 'true' } : {};
	try {
		const res = await axios.get(`/api/carModel?carModelId=${carModelId}`, {
			headers,
		});
		return res.data as CarModel;
	} catch (error) {
		console.error('Error fetching car model:', error);
		return null;
	}
}
