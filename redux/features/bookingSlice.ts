import { $Enums, Car, Discount, Service } from '@prisma/client';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { LocationModel } from '@/services/contracts/LocationRepository';
import dayjs, { Dayjs } from 'dayjs';
import {
	FRIDAY,
	MONDAY,
	QUARTER_HOUR,
	SATURDAY,
	SUNDAY,
	THURSDAY,
	TIMEZONE,
	TUESDAY,
	WEDNESDAY,
} from '@/constants';
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault(TIMEZONE);

type BookingState = {
	carId: string | undefined;
	cars: Car[];
	// locationId: string | undefined;
	location: LocationModel | undefined;
	locations: LocationModel[];
	parkingSpot: string;
	services: Service[];
	servicesSelected: Service[];
	totalPrice: number | undefined;
	isBookingValid: boolean;
	showAddCars: boolean;
	isNow: boolean;
	isLocationOpen: boolean;
	appointmentDateJSON: string | undefined;
	appointmentTimeJSON: string | undefined;
	appointmentDateTimeValid: boolean | undefined;
	isLoaded: boolean;
	isLoading: boolean;
	showWarning: boolean;
	discountCode: string | undefined;
	discount: Discount | undefined;
	step: number;
	isFuelCardSelected: boolean;
	fuelCardNumber: string;
	guestEmail: string;
	isGuestBooking: boolean;
};

const initialState: BookingState = {
	showAddCars: false,
	isLoaded: false,
	carId: undefined,
	isBookingValid: false,
	isLoading: false,
	totalPrice: undefined,
	showWarning: false,
	isNow: true,
	cars: [],
	// locationId: undefined,
	location: undefined,
	locations: [],
	parkingSpot: '',
	services: [],
	servicesSelected: [],
	discountCode: undefined,
	discount: undefined,
	appointmentDateJSON: undefined,
	appointmentTimeJSON: undefined,
	appointmentDateTimeValid: undefined,
	isLocationOpen: true,
	step: 0,
	isFuelCardSelected: false,
	fuelCardNumber: '',
	guestEmail: '',
	isGuestBooking: false,
};

export const getTotal = (
	services: Service[],
	discountType?: $Enums.DiscountType,
	discountValue?: number,
	discountServiceId?: string | null
) => {
	var total: number = 0.0;

	services.forEach((e, i) => {
		if (discountType && discountServiceId && discountType === 'SERVICE') {
			if (e.id === discountServiceId) {
				return;
			}
		}

		total =
			Math.round(
				(Math.round(total * 100) / 100 +
					Math.round(e.price * 100) / 100) *
					100
			) / 100;
	});

	if (discountType && discountValue) {
		if (discountType === 'PROCENTUAL') {
			const discountTotal =
				(Math.round(total * 100) / 100) * (discountValue / 100);

			const roundedDiscountTotal = Math.round(discountTotal * 100) / 100;
			total = Math.round((total - roundedDiscountTotal) * 100) / 100;
		} else if (discountType === 'MONETARY') {
			total = Math.round((total - discountValue) * 100) / 100;
		}
	}

	if (total < 0) {
		return undefined;
	} else {
		return total;
	}
};

const updateTotal = (state: Draft<BookingState>) => {
	state.totalPrice = getTotal(
		state.servicesSelected,
		state.discount?.discountType,
		state.discount?.value,
		state.discount?.validForServiceId
	);
};

const isTimeSet = (state: Draft<BookingState>): boolean => {
	if (state.isNow && state.parkingSpot && state.parkingSpot.length !== 0) {
		return true;
	} else if (
		!state.isNow &&
		state.appointmentDateJSON &&
		state.appointmentTimeJSON
	) {
		return true;
	}

	return false;
};

const setAppointmentDateTimeValid = (state: Draft<BookingState>): void => {
	if (!state.location) {
		state.appointmentDateTimeValid = false;
		return;
	}

	if (!state.appointmentDateJSON) {
		state.appointmentDateTimeValid = false;
		return;
	}

	if (!state.appointmentTimeJSON) {
		state.appointmentDateTimeValid = false;
		return;
	}

	const selectedTime = dayjs(
		`${dayjs(state.appointmentTimeJSON).hour()}:${dayjs(state.appointmentTimeJSON).minute()}`,
		'HH:mm'
	);

	const day = dayjs(state.appointmentDateJSON).day();
	state.appointmentDateTimeValid = checkOpeningHourForDay(
		state,
		day,
		selectedTime
	);
};

const checkOpeningHourForDay = (
	state: Draft<BookingState>,
	day: number,
	selectedTime: Dayjs
): boolean => {
	if (!state.location) {
		return false;
	}

	switch (day) {
		case SUNDAY:
			return checkOpeningHour(
				selectedTime,
				state.location.sundayStart,
				state.location.sundayEnd
			);
		case MONDAY:
			console.log('in');
			console.log(
				checkOpeningHour(
					selectedTime,
					state.location.mondayStart,
					state.location.mondayEnd
				)
			);
			return checkOpeningHour(
				selectedTime,
				state.location.mondayStart,
				state.location.mondayEnd
			);
		case TUESDAY:
			return checkOpeningHour(
				selectedTime,
				state.location.tuesdayStart,
				state.location.tuesdayEnd
			);
		case WEDNESDAY:
			return checkOpeningHour(
				selectedTime,
				state.location.wednesdayStart,
				state.location.wednesdayEnd
			);
		case THURSDAY:
			return checkOpeningHour(
				selectedTime,
				state.location.thursdayStart,
				state.location.thursdayEnd
			);
		case FRIDAY:
			return checkOpeningHour(
				selectedTime,
				state.location.fridayStart,
				state.location.fridayEnd
			);
		case SATURDAY:
			return checkOpeningHour(
				selectedTime,
				state.location.saturdayStart,
				state.location.saturdayEnd
			);
	}

	return false;
};

const checkOpeningHour = (
	selectedTime: Dayjs,
	start?: Date | null,
	end?: Date | null
): boolean => {
	if (!start && !end) {
		return false;
	}

	const currentDayHourMinuteStart = dayjs(
		`${dayjs(start).hour()}:${dayjs(start).minute()}`,
		'HH:mm'
	);

	const currentDayHourMinuteEnd = dayjs(
		`${dayjs(end).hour()}:${dayjs(end).minute()}`,
		'HH:mm'
	).subtract(QUARTER_HOUR, 'minute');

	if (
		currentDayHourMinuteStart <= selectedTime &&
		selectedTime <= currentDayHourMinuteEnd
	) {
		return true;
	} else {
		return false;
	}
};

const updateIsBookingValid = (state: Draft<BookingState>) => {
	if (
		(state.servicesSelected && state.servicesSelected.length === 0) ||
		!isTimeSet(state)
	) {
		state.isBookingValid = false;
	} else {
		state.isBookingValid = true;
	}
};

const updateShowAddCars = (state: Draft<BookingState>) => {
	if (state.isLoaded) {
		if (state.cars.length === 0) {
			state.showAddCars = true;
		} else {
			state.showAddCars = false;
		}
	}
};

const setStep = (state: Draft<BookingState>, value: number) => {
	state.step = value;
	if (state.step === 1) {
		state.location = undefined;
		state.servicesSelected = [];
		updateTotal(state);
	} else if (state.step === 2) {
		state.servicesSelected = [];
		updateTotal(state);
	} else if (state.step === 3) {
		state.servicesSelected = [];
		updateTotal(state);
	}
};

export const auth = createSlice({
	name: 'booking',
	initialState,
	reducers: {
		// setLocationId: (state, action: PayloadAction<string>) => {
		//   state.locationId = action.payload;
		//   setStep(state, 2);
		//   if (state.locationId) {
		//     const locationModel = state.locations?.find(
		//       (x) => x.id === state.locationId
		//     );
		//     if (locationModel && locationModel.disabledByHighBookings) {
		//       state.showWarning = true;
		//     } else {
		//       state.showWarning = false;
		//     }
		//   }
		// },

		setIsFuelCardSelected(state, action: PayloadAction<boolean>) {
			state.isFuelCardSelected = action.payload;
			if (!action.payload) {
				state.fuelCardNumber = '';
			}
		},
		setFuelCardNumber(state, action: PayloadAction<string>) {
			state.fuelCardNumber = action.payload;
		},
		setLocation: (state, action: PayloadAction<string>) => {
			// state.locationId = action.payload;
			setStep(state, 2);
			if (action.payload) {
				const locationModel = state.locations?.find(
					(x) => x.id === action.payload
				);

				state.location = locationModel;

				const selectedTime = dayjs();
				const day = selectedTime.day();
				state.isLocationOpen = checkOpeningHourForDay(
					state,
					day,
					selectedTime
				);

				if (locationModel && locationModel.disabledByHighBookings) {
					state.showWarning = true;
				} else {
					state.showWarning = false;
				}
			}
		},
		setCars: (state, action: PayloadAction<Car[]>) => {
			if (action.payload.length === 1) {
				var car = action.payload[0];
				state.carId = car.id;
				setStep(state, 1);
			}
			state.cars = action.payload;
			updateShowAddCars(state);
		},
		setLocations: (state, action: PayloadAction<LocationModel[]>) => {
			const sorted = action.payload.sort((a, b) => {
				const nameA = a.city.toUpperCase(); // ignore upper and lowercase
				const nameB = b.city.toUpperCase(); // ignore upper and lowercase
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}

				// names must be equal
				return 0;
			});

			state.locations = sorted;
		},
		setServices: (state, action: PayloadAction<Service[]>) => {
			state.services = action.payload;
		},
		setCarId: (state, action: PayloadAction<string>) => {
			state.carId = action.payload;
			setStep(state, 1);
		},
		setParkingSpot: (state, action: PayloadAction<string>) => {
			state.parkingSpot = action.payload;
			updateIsBookingValid(state);
			if (isTimeSet(state)) {
				setStep(state, 3);
			} else {
				setStep(state, 2);
			}
		},
		setIsLoaded: (state, action: PayloadAction<boolean>) => {
			state.isLoaded = action.payload;
			updateShowAddCars(state);
		},
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setShowAddCars: (state, action: PayloadAction<boolean>) => {
			state.showAddCars = action.payload;
		},
		addService: (state, action: PayloadAction<Service>) => {
			state.servicesSelected.push(action.payload);
			updateTotal(state);
			updateIsBookingValid(state);
		},
		removeService: (state, action: PayloadAction<Service>) => {
			state.servicesSelected = state.servicesSelected.filter((el, i) => {
				return el.id !== action.payload.id;
			});
			updateTotal(state);
			updateIsBookingValid(state);
		},
		setDiscountCode: (state, action: PayloadAction<string>) => {
			state.discountCode = action.payload;
		},
		setDiscount: (state, action: PayloadAction<Discount>) => {
			state.discount = action.payload;
			updateTotal(state);
		},
		setIsNow: (state, action: PayloadAction<boolean>) => {
			state.isNow = action.payload;
			updateIsBookingValid(state);
			if (state.isNow) {
				state.appointmentDateJSON = undefined;
				state.appointmentTimeJSON = undefined;
			} else {
				state.parkingSpot = '';
			}

			if (isTimeSet(state)) {
				setStep(state, 3);
			} else {
				setStep(state, 2);
			}
		},
		setAppointmentDate: (
			state,
			action: PayloadAction<string | undefined>
		) => {
			state.appointmentDateJSON = action.payload;

			setAppointmentDateTimeValid(state);

			if (isTimeSet(state) && state.appointmentDateTimeValid) {
				setStep(state, 3);
			} else {
				setStep(state, 2);
			}
		},
		setAppointmentTime: (
			state,
			action: PayloadAction<string | undefined>
		) => {
			state.appointmentTimeJSON = action.payload;

			setAppointmentDateTimeValid(state);

			if (isTimeSet(state) && state.appointmentDateTimeValid) {
				setStep(state, 3);
			} else {
				setStep(state, 2);
			}
		},
		setGuestEmail: (state, action: PayloadAction<string>) => {
			state.guestEmail = action.payload;
		},
		setIsGuestBooking: (state, action: PayloadAction<boolean>) => {
			state.isGuestBooking = action.payload;
		},
	},
});

export const {
	// setLocationId,
	setLocation,
	setCars,
	setCarId,
	setIsLoaded,
	setIsLoading,
	setLocations,
	setShowAddCars,
	setServices,
	addService,
	setParkingSpot,
	removeService,
	setDiscountCode,
	setDiscount,
	setIsNow,
	setAppointmentDate,
	setAppointmentTime,
	setIsFuelCardSelected,
	setFuelCardNumber,
	setGuestEmail,
	setIsGuestBooking,
} = auth.actions;

export default auth.reducer;
