import React, { useState } from 'react';
import BookingComponent from './BookingComponent';
import { TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setGuestEmail } from '@/redux/features/bookingSlice';
import type { RootState } from '@/redux/store';

export default function GuestBookingComponent() {
    const bookingState = useSelector((state: RootState) => state.bookingReducer);
    const dispatch = useDispatch();
    const [emailError, setEmailError] = useState<string>('');

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        dispatch(setGuestEmail(email));

        if (email && !validateEmail(email)) {
            setEmailError('Bitte geben Sie eine gültige E-Mail-Adresse ein');
        } else {
            setEmailError('');
        }
    };

    return (
        <BookingComponent isGuestBooking={true}>
            {bookingState.step >= 3 && (
                <div className="flex flex-row mt-4 mb-4">
                    <TextField
                        required
                        error={!!emailError}
                        id="guest-email"
                        label="E-Mail Adresse"
                        className="flex-1"
                        value={bookingState.guestEmail}
                        variant="outlined"
                        onChange={handleEmailChange}
                        helperText={emailError || "Ihre E-Mail Adresse für die Buchungsbestätigung"}
                    />
                </div>
            )}
        </BookingComponent>
    );
}
