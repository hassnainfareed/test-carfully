'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AddCarModal } from './AddCarModal';
import { Checkbox } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { BookingDto } from '@/types/booking.d';
import { getCars } from '@/services/CarService';
import { createBooking } from '@/services/BookingService';
import LocationService from '@/services/LocationService';
import ServiceService from '@/services/ServiceService';
import { LocationModel } from '@/services/contracts/LocationRepository';
import ServiceCard from '../service/ServiceCard';
import { useSelector, useDispatch } from 'react-redux';
import {
	setLocation,
	setCars,
	setCarId,
	setLocations,
	setIsLoaded,
	setIsLoading,
	setShowAddCars,
	setParkingSpot,
	setServices,
	addService,
	setDiscountCode,
	removeService,
	setDiscount,
	setIsNow,
	setAppointmentDate,
	setAppointmentTime,
	setIsFuelCardSelected,
	setFuelCardNumber,
} from '@/redux/features/bookingSlice';
import Snackbar from '@mui/material/Snackbar';
import type { RootState } from '@/redux/store';
import DiscountService from '@/services/DiscountService';
import {
	Box,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Paper,
	Step,
	StepLabel,
	Stepper,
	TextField,
	Typography,
} from '@mui/material';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
	DesktopDatePicker,
	DesktopTimePicker,
	LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import dayjs, { Dayjs } from 'dayjs';
import InfoIcon from '@mui/icons-material/Info';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import { ReactNode } from 'react';  // Add this import

interface BookingComponentProps {
	isGuestBooking?: boolean;
	children?: ReactNode;  // Add this to accept children
}

export default function BookingComponent({ isGuestBooking = false, children }: BookingComponentProps) {
	const bookingState = useSelector(
		(state: RootState) => state.bookingReducer
	);
	const dispatch = useDispatch();

	const router = useRouter();
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const locationService = new LocationService();
	const serviceService = new ServiceService();
	const discountService = new DiscountService();

	useEffect(() => {
		initializeCars();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		locationService.getAllModels(isGuestBooking).then((data) => {
			dispatch(setLocations(data));
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bookingState.carId]);

	useEffect(() => {
		if (bookingState.location && bookingState.carId) {
			initializeServices();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bookingState.location, bookingState.carId]);

	async function initializeCars() {
		const data = await getCars(isGuestBooking); // Pass isGuestBooking here
		dispatch(setIsLoaded(true));
		dispatch(setCars(data));
	}

	async function initializeServices() {
		const services = await serviceService.getServicesByLocation(
			bookingState.location?.id!,
			bookingState.carId!,
			isGuestBooking  // Pass isGuestBooking here
		);
		if (services) {
			dispatch(
				setServices(
					services.sort((a, b) => {
						if (a.price <= b.price) return 1;
						else return -1;
					})
				)
			);
		}
	}

	function selectService(checked: boolean, id: string) {
		if (checked) {
			const service = bookingState.services?.find((x) => x.id == id);
			if (service) {
				dispatch(addService(service));
			}
		} else {
			const service = bookingState.servicesSelected?.find(
				(x) => x.id === id
			);
			if (service) {
				dispatch(removeService(service));
			}
		}
	}

	async function handleBooking(e: any) {
		e.preventDefault();
		dispatch(setIsLoading(true));
		try {
			const booking: BookingDto = {
				carId: bookingState.carId!,
				locationId: bookingState.location?.id!,
				parkingSpot: bookingState.parkingSpot!,
				totalPrice: bookingState.totalPrice!,
				serviceIds: bookingState.servicesSelected.map(s => s.id),
				isNow: bookingState.isNow,
				isFuelCardSelected: bookingState.isFuelCardSelected,
				fuelCardNumber: bookingState.isFuelCardSelected ? bookingState.fuelCardNumber : undefined,
				appointmentDate: bookingState.appointmentDateJSON ? new Date(bookingState.appointmentDateJSON) : null,
				appointmentTime: bookingState.appointmentTimeJSON ? new Date(bookingState.appointmentTimeJSON) : null,
				discountCode: bookingState.discountCode || '',
				isGuestBooking,
				guestEmail: isGuestBooking ? bookingState.guestEmail : undefined
			};

			console.log('BookingComponent - Booking data:', {
				booking,
				state: bookingState,
				isGuestBooking
			});

			const url = await createBooking(booking);
			router.push(url);
		} catch (error: any) {
			console.error('BookingComponent - Error:', {
				error,
				response: error.response?.data,
				state: bookingState
			});
			setSnackbarMessage(
				error.response?.data?.message ||
				'Error creating booking. Please try again.'
			);
			setOpenSnackbar(true);
		} finally {
			dispatch(setIsLoading(false));
		}
	}

	async function handleDiscountCode() {
		if (bookingState.discountCode) {
			const discount = await discountService
				.checkCode(bookingState.discountCode!)
				.catch((e: any) => {
					if (e && e.response && e.response.data) {
						setSnackbarMessage(e.response.data);
						setOpenSnackbar(true);
					}
				});

			if (discount) {
				dispatch(setDiscount(discount));
			}
		}
	}

	function getDisplayTitle(data: LocationModel) {
		return (
			<div className="custom-item">
				{/* <div className="font-bold border-t-[1px] border-gray-300"> */}
				<div className="font-bold ">{data.city}</div>
				<div>{data.name}</div>
				{data.disabledByMaxBookings && (
					<div className=" bg-orange-800 text-gray-100 px-1 rounded-md">
						voll ausgebucht
					</div>
				)}
				{!data.disabledByMaxBookings && data.disabledByHighBookings && (
					<div className=" bg-orange-800 text-gray-100 px-1 rounded-md">
						aktuell hohe Nachfrage
					</div>
				)}
			</div>
		);
	}

	const GetLocationSelectMenuItem = (locationModel: LocationModel) => {
		let disabled = false;
		if (locationModel.disabledByMaxBookings) {
			disabled = true;
		}
		return (
			<MenuItem
				key={locationModel.id}
				value={locationModel.id}
				disabled={disabled}
			>
				{getDisplayTitle(locationModel)}
			</MenuItem>
		);
	};

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnackbar(false);
	};

	const snackbarAction = (
		<React.Fragment>
			<IconButton
				size="small"
				aria-label="close"
				color="inherit"
				onClick={handleClose}
			>
				<CloseIcon fontSize="small" />
			</IconButton>
		</React.Fragment>
	);

	function disableSunday(date: Dayjs) {
		return date.get('day') === 0;
	}

	function disableHours(date: Dayjs) {
		return date.get('hour') <= 7 || date.get('hour') >= 19;
	}

	const steps = [
		{
			label: 'Fahrzeug',
		},
		{
			label: 'Standort',
		},
		{
			label: 'Zeitpunkt',
		},
		{
			label: 'Dienstleistung',
		},
	];

	const LoadingPanel = () => (
		<div className="shadow rounded-md p-4 grow">
			<div className="animate-pulse flex space-x-4">
				<div className="flex-1 space-y-6 py-1">
					<div className="grid h-12 grid-cols-6 gap-4">
						<div className="bg-slate-300 rounded col-span-5" />
						<div className="bg-slate-300 rounded col-span-1" />
					</div>
					<div className="h-12 bg-slate-300 rounded" />
					<div className="h-12 bg-slate-300 rounded" />
				</div>
			</div>
		</div>
	);

	const SelectCar = () => (
		<div className="flex justify-content-start align-text-bottom gap-x-4">
			<FormControl fullWidth required>
				<InputLabel id="car-label">Fahrzeug wählen</InputLabel>
				<Select
					labelId="car-label"
					id="car-id"
					value={bookingState.carId}
					label="Auto wählen"
					onChange={(e) => dispatch(setCarId(e.target.value))}
				>
					{bookingState.cars.map((car) => (
						<MenuItem key={car.id} value={car.id}>
							{car.licenseNumber}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<a
				onClick={(e) => dispatch(setShowAddCars(true))}
				className="relative flex ml-2 items-center justify-center px-4 mt-2 h-auto bg-sky-600 rounded-lg hover:bg-sky-700 cursor-pointer"
			>
				<FontAwesomeIcon
					icon={faPlus}
					className="h-5 w-5 pr-2 text-slate-200"
				/>
				<span className="relative text-md font-normal w-44 text-gray-200 max-md:hidden">
					Fahrzeug hinzufügen
				</span>
			</a>
		</div>
	);

	const SelectLocation = () => (
		<>
			<div className="flex justify-content-start gap-x-4 mt-6">
				<FormControl fullWidth required>
					<InputLabel id="location-label">Standort wählen</InputLabel>
					<Select
						labelId="location-label"
						id="location-id"
						value={bookingState.location?.id}
						label="Standort wählen"
						onChange={(e) => dispatch(setLocation(e.target.value))}
					>
						{bookingState.locations.map((location) =>
							GetLocationSelectMenuItem(location)
						)}
					</Select>
				</FormControl>
			</div>
			{bookingState.showWarning && (
				<div className="flex justify-content-start gap-x-4 mt-6 bg-orange-800 text-gray-100 p-2 rounded-lg">
					Aktuell hohe Nachfrage an diesem Standort. Es kann sein,
					dass die Fertigstellung Ihrer Buchung etwas länger als
					gewohnt dauert.
				</div>
			)}
		</>
	);

	const OpeningHourDay = (props: {
		title: string;
		start?: Date | undefined | null;
		end?: Date | undefined | null;
	}) => {
		return (
			<Box display={'flex'} alignItems={'center'}>
				{props.start && props.end && (
					<>
						<Typography>
							{props.title} {dayjs(props.start).format('HH:mm')}
							{' - '}
							{dayjs(props.end).format('HH:mm')}
						</Typography>
					</>
				)}
			</Box>
		);
	};

	const OpeningHours = () => (
		<Paper sx={{ padding: 1 }}>
			<Box display={'flex'} alignItems={'center'}>
				<InfoIcon color="primary" sx={{ marginRight: 1 }} />
				<Typography fontWeight={600}>
					Öffnungszeiten für diesen Standort
				</Typography>
			</Box>
			<OpeningHourDay
				title="Montag"
				start={bookingState.location?.mondayStart}
				end={bookingState.location?.mondayEnd}
			/>
			<OpeningHourDay
				title="Dienstag"
				start={bookingState.location?.tuesdayStart}
				end={bookingState.location?.tuesdayEnd}
			/>
			<OpeningHourDay
				title="Mittwoch"
				start={bookingState.location?.wednesdayStart}
				end={bookingState.location?.wednesdayEnd}
			/>
			<OpeningHourDay
				title="Donnerstag"
				start={bookingState.location?.thursdayStart}
				end={bookingState.location?.thursdayEnd}
			/>
			<OpeningHourDay
				title="Freitag"
				start={bookingState.location?.fridayStart}
				end={bookingState.location?.fridayEnd}
			/>
			<OpeningHourDay
				title="Samstag"
				start={bookingState.location?.saturdayStart}
				end={bookingState.location?.saturdayEnd}
			/>
			<OpeningHourDay
				title="Sonntag"
				start={bookingState.location?.sundayStart}
				end={bookingState.location?.sundayEnd}
			/>
			<Typography fontWeight={400} fontSize={12}>
				Letzte Buchung bis 15 Minuten vor Ladenschluss möglich.
			</Typography>
		</Paper>
	);

	const isBookingEnabled = () => {
		if (!bookingState.isBookingValid || bookingState.isLoading) return false;
		if (bookingState.isFuelCardSelected && !bookingState.fuelCardNumber.trim()) return false;
		if (isGuestBooking && (!bookingState.guestEmail || !validateEmail(bookingState.guestEmail))) return false;
		return true;
	};

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	return (
		<>
			<Snackbar
				anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
				open={openSnackbar}
				autoHideDuration={6000}
				onClose={handleClose}
				message={snackbarMessage}
				action={snackbarAction}
			/>

			<Stepper
				activeStep={bookingState.step}
				alternativeLabel
				sx={{ marginBottom: 2 }}
			>
				{steps.map((step) => (
					<Step key={step.label}>
						<StepLabel>{step.label}</StepLabel>
					</Step>
				))}
			</Stepper>

			{!bookingState.isLoaded ? (
				<LoadingPanel />
			) : bookingState.showAddCars ? (
				<AddCarModal
					onAddCar={initializeCars}
					open={bookingState.showAddCars}
					onCloseModal={() => dispatch(setShowAddCars(false))}
					isGuestBooking={isGuestBooking}
				/>
			) : (
				<>
					{bookingState.step >= 0 && <SelectCar />}

					{bookingState.step >= 1 && <SelectLocation />}

					{bookingState.step >= 2 && (
						<>
							<div className="flex justify-content-start gap-x-4 mt-6">
								<RadioGroup
									row
									value={bookingState.isNow}
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) => {
										dispatch(
											setIsNow(e.target.value === 'true')
										);
									}}
									aria-labelledby="isNow-label"
									name="isNow-group"
								>
									<FormControlLabel
										value={true}
										control={<Radio />}
										label="Jetzt"
									/>
									<FormControlLabel
										value={false}
										control={<Radio />}
										label="Termin vereinbaren"
									/>
								</RadioGroup>
							</div>
							{bookingState.isNow && (
								<>
									{bookingState.isLocationOpen ? (
										<div className="flex justify-content-start gap-x-4 mt-6">
											<TextField
												id="outlined-basic"
												label="Parkplatzinfo erforderlich"
												// disabled={bookingState.locationId === undefined ? true : false}
												fullWidth
												required
												placeholder="Beispiel: 2.OG 4711"
												value={bookingState.parkingSpot}
												variant="outlined"
												onChange={(e) =>
													dispatch(
														setParkingSpot(
															e.target.value
														)
													)
												}
											/>
										</div>
									) : (
										<OpeningHours />
									)}
								</>
							)}
							{!bookingState.isNow && (
								<>
									{bookingState.location && <OpeningHours />}
									<div className="flex justify-content-start gap-x-4 mt-6">
										<LocalizationProvider
											dateAdapter={AdapterDayjs}
											adapterLocale="de"
										>
											<DesktopDatePicker
												disablePast
												shouldDisableDate={
													disableSunday
												}
												onChange={(e) => {
													dispatch(
														setAppointmentDate(
															e?.toJSON()
														)
													);
												}}
											/>
											<DesktopTimePicker
												timeSteps={{ minutes: 15 }}
												shouldDisableTime={disableHours}
												onChange={(e) =>
													dispatch(
														setAppointmentTime(
															e?.toJSON()
														)
													)
												}
											/>
										</LocalizationProvider>
									</div>
									{bookingState.appointmentDateTimeValid ===
										false && (
											<div className="flex justify-content-start gap-x-4 mt-6">
												<Paper sx={{ padding: 1 }}>
													<Box
														display={'flex'}
														alignItems={'center'}
													>
														<DoDisturbOnIcon
															color={'error'}
															sx={{ marginRight: 1 }}
														/>
														<Typography
															fontWeight={600}
														>
															Bitte die Öffnungszeiten
															beachten!
														</Typography>
													</Box>
												</Paper>
											</div>
										)}
								</>
							)}
						</>
					)}

					{bookingState.step >= 3 && (
						<>
							<div className="flex flex-col md:flex-row gap-y-3 content-center justify-between gap-x-4 mt-6">
								{bookingState.services?.map((service) => {
									return (
										<ServiceCard
											id={service.id}
											name={service.name}
											description={service.description}
											price={service.price}
											imageBase64={service.imageBase64}
											key={service.id}
											selectService={selectService}
										/>
									);
								})}
							</div>
							{/* Guest email field moved here, before discount code */}
							{isGuestBooking && children}

							{/* Discount code section */}
							{bookingState.isBookingValid && (
								<div className="flex flex-row mt-2">
									<TextField
										id="outlined-basic"
										label="Rabattcode"
										className="flex-1 mr-2"
										disabled={
											bookingState.location?.id ===
												undefined ||
												bookingState.discount
												? true
												: false
										}
										value={bookingState.discountCode}
										variant="outlined"
										onChange={(e) =>
											dispatch(
												setDiscountCode(e.target.value)
											)
										}
									/>
									{bookingState.discount ? (
										<button
											type="button"
											disabled={true}
											className="flex-1 mt-2 bg-green-600 rounded-xl disabled:bg-gray-500 text-white font-semibold hover:bg-green-700"
										>
											{bookingState.discount
												.discountType === 'MONETARY'
												? `${bookingState.discount.value}€ abgezogen`
												: bookingState.discount
													.discountType ===
													'PROCENTUAL'
													? `${bookingState.discount.value}% abgezogen`
													: bookingState.discount
														.discountType ===
														'SERVICE'
														? 'Rabatt abgezogen'
														: ''}
										</button>
									) : (
										<button
											type="button"
											onClick={handleDiscountCode}
											className="flex-1 mt-2 ml-2 w-96 bg-green-600 rounded-xl disabled:bg-gray-500 text-white font-semibold hover:bg-green-700"
										>
											Einlösen
										</button>
									)}
								</div>
							)}
							<div className="flex flex-row mt-2">
								<FormControlLabel
									control={
										<Checkbox
											checked={
												bookingState.isFuelCardSelected
											}
											onChange={(e) =>
												dispatch(
													setIsFuelCardSelected(
														e.target.checked
													)
												)
											}
											name="fuelCard"
											color="primary"
										/>
									}
									label="Ich möchte mit meiner Tankkarte bezahlen (DKV, UTA, LOGPAY etc..)"
								/>
							</div>

							{bookingState.isFuelCardSelected && (
								<div className="flex flex-row mt-2">
									<TextField
										id="fuel-card-number"
										label="Tankkartennummer"
										fullWidth
										required
										placeholder="Beispiel: 704310 XXXXX XXXXX"
										value={bookingState.fuelCardNumber}
										variant="outlined"
										onChange={(e) =>
											dispatch(
												setFuelCardNumber(
													e.target.value
												)
											)
										}
									/>
								</div>
							)}
						</>
					)}

					<button
						type="button"
						onClick={handleBooking}
						disabled={!isBookingEnabled()}
						className="w-full flex flex-row mt-2 justify-center bg-sky-600 py-2 rounded-xl disabled:bg-gray-500 text-white font-semibold hover:bg-sky-700"
					>
						{bookingState.isLoading && (
							<svg
								aria-hidden="true"
								className="w-6 h-6 mr-2 text-gray-200 animate-spin fill-sky-700"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
						)}
						Buchen
						{bookingState.totalPrice === 0 ||
							bookingState.totalPrice === undefined
							? ''
							: `  ${bookingState.totalPrice.toFixed(2)} €`}
					</button>
				</>
			)}
		</>
	);
}
