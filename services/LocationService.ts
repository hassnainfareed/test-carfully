import { Location } from '@prisma/client';
import BaseService from './BaseService';
import {
	LocationRepository,
	LocationModel,
} from './contracts/LocationRepository';
import axios from 'axios';

interface SaveServiceOnLocations {
	locationId: string;
	serviceId: string;
}

export default class LocationService
	extends BaseService<Location>
	implements LocationRepository
{
	constructor() {
		super('/api/location/');
	}

	async getAllModels(
		isGuestBooking: boolean = false
	): Promise<LocationModel[]> {
		const headers = isGuestBooking ? { 'x-guest-booking': 'true' } : {};
		const res = await axios.get('/api/location/getModels', { headers });
		return res.data as LocationModel[];
	}

	async insertServiceOnLocations(
		locationId: string,
		serviceId: string
	): Promise<void> {
		const data: SaveServiceOnLocations = {
			locationId: locationId,
			serviceId: serviceId,
		};
		var res = await axios.post(`${this.urlPath}servicesOnLocations`, data);
		return res.data;
	}

	async removeServiceOnLocations(
		locationId: string,
		serviceId: string
	): Promise<void> {
		var res = await axios.delete(
			`${this.urlPath}servicesOnLocations?locationId=${locationId}&serviceId=${serviceId}`
		);
		return res.data;
	}

	async getIncludeServices(locationId: string): Promise<any | null> {
		var res = await axios.get(
			`${this.urlPath}includeServices?locationId=${locationId}`
		);
		return res.data;
	}
}
