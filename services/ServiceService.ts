import { Service } from '@prisma/client';
import BaseService from './BaseService';
import { ServiceRepository } from './contracts/ServiceRepository';
import axios from 'axios';

export interface ServiceUpdateImageProps {
	serviceId: string;
	image: string;
}

export default class ServiceService
	extends BaseService<Service>
	implements ServiceRepository
{
	constructor() {
		super('/api/service/');
	}

	async getServicesByLocation(
		locationId: string,
		carId: string,
		isGuestBooking: boolean = false
	): Promise<Service[] | null> {
		const headers = isGuestBooking ? { 'x-guest-booking': 'true' } : {};
		const res = await axios.get(
			`${this.urlPath}byLocationId?locationId=${locationId}&carId=${carId}`,
			{ headers }
		);
		return res.data as Service[];
	}

	async getServicesByBooking(bookingId: string): Promise<Service[] | null> {
		var res = await axios.get(
			`${this.urlPath}byBookingId?bookingId=${bookingId}`
		);
		return res.data as Service[];
	}

	async updateImage(
		serviceUpdateImageProps: ServiceUpdateImageProps
	): Promise<Service> {
		var res = await axios.put(
			`${this.urlPath}updateImage`,
			serviceUpdateImageProps
		);

		return res.data as Service;
	}
}
