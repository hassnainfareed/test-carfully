'use client';

import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import LeftDivider from '@/components/LeftDivider';
import {
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Login() {
	const MAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);

	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);

	const searchParams = useSearchParams();
	const [isSaving, setIsSaving] = useState(false);

	const [hasError, setHasError] = useState(false);

	useEffect(() => {
		const error = searchParams.get('error');

		if (error) {
			setHasError(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (email.length > 0) {
			setValidEmail(MAIL_REGEX.test(email));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email]);

	useEffect(() => {
		setValidPassword(password.length >= 4);
	}, [password]);

	const handleLogin = async (e: any) => {
		setIsSaving(true);
		e.preventDefault();

		const callbackUrlParam = searchParams.get('callbackUrl');
		var callbackUrl: string = callbackUrlParam ? callbackUrlParam : '/';

		const result = await signIn('credentials', {
			username: email,
			password: password,
			redirect: true,
			callbackUrl: callbackUrl,
		});
	};

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};

	const handleGoogleLogin = async () => {
		try {
			console.log('Starting Google sign-in...');
			const result = await signIn('google', {
				callbackUrl: '/',
				redirect: false
			});

			if (result?.error) {
				console.error('Google sign-in error:', result.error);
				setHasError(true);
			} else if (result?.url) {
				console.log('Redirecting to:', result.url);
				window.location.href = result.url;
			}
		} catch (error) {
			console.error('Google sign-in exception:', error);
			setHasError(true);
		}
	};

	return (
		<div className="h-screen md:flex">
			<LeftDivider />
			<div className="flex flex-col md:w-2/3 p-4 justify-center py-10 items-center ">
				<form className="w-96" onSubmit={handleLogin}>
					<h1 className="font-bold text-2xl mb-4">Anmelden</h1>
					{hasError && (
						<div className="flex content-center p-3 bg-red-800 text-gray-100 rounded-lg mb-4">
							Fehler bei der Anmeldung. E-Mail oder Passwort
							falsch.
						</div>
					)}
					<TextField
						id="outlined-basic"
						label="E-Mail"
						fullWidth
						variant="outlined"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<FormControl
						sx={{ marginTop: 1 }}
						fullWidth
						variant="outlined"
					>
						<InputLabel htmlFor="outlined-adornment-password">
							Passwort
						</InputLabel>
						<OutlinedInput
							id="outlined-adornment-password"
							type={showPassword ? 'text' : 'password'}
							onChange={(e) => setPassword(e.target.value)}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
									>
										{showPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							}
							label="Passwort"
						/>
					</FormControl>

					<button
						type="submit"
						disabled={
							isSaving || !validEmail || !validPassword
								? true
								: false
						}
						className="w-full flex flex-row justify-center bg-sky-600 mt-4 py-2 rounded-2xl disabled:bg-gray-600  text-white font-semibold mb-2 hover:bg-sky-700"
					>
						{isSaving ? (
							<svg
								aria-hidden="true"
								className="w-6 h-6 text-gray-200 animate-spin fill-sky-700"
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
						) : (
							'Anmelden'
						)}
					</button>

					<div className="flex flex-row justify-end text-md mt-4">
						<a
							href="/authentication/resetPassword"
							className="text-sky-600"
						>
							Passwort vergessen?
						</a>
					</div>

					<div className="w-full mt-4 flex items-center">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="flex-shrink mx-4 text-gray-600">
							ODER
						</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>

					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full flex flex-row justify-center items-center bg-white mt-4 py-2 rounded-2xl text-black font-semibold mb-4 hover:bg-gray-100 border border-gray-300"
					>
						<FontAwesomeIcon
							icon={faGoogle}
							className="w-5 h-5 mr-2"
							style={{ fontSize: '1.25rem' }}
						/>
						Mit Google anmelden
					</button>

					<div className="text-md flex flex-col gap-y-2 mt-4 items-center py-2 px-3">
						Noch keinen Account? Hier geht es zur{' '}
						<div className="flex-row grow inline-flex justify-center rounded-xl bg-sky-600  hover:bg-sky-700 px-4 py-2 text-md font-medium text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
							<a
								href="/authentication/register"
								className="flex flex-row  text-gray-200"
							>
								<FontAwesomeIcon
									icon={faFileSignature}
									className="w-4 h-4 mt-[5px]"
								/>
								<span className="ml-2 relative text-[16px] font-semibold">
									Registrierung
								</span>
							</a>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
