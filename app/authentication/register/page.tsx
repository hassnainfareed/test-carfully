'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserDto } from '@/types/user.d';
import { registerUser } from '@/services/AuthenticationService';
import LeftDivider from '@/components/LeftDivider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { signIn } from 'next-auth/react';
import {
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';

export default function Register() {
	const MAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
	// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
	const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

	const router = useRouter();

	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [focusEmail, setFocusEmail] = useState(false);

	const [password, setPassword] = useState('');
	const [validPassword, setValidPassword] = useState(false);
	const [focusPassowrd, setFocusPassword] = useState(false);

	const [passwordMatch, setPasswordMatch] = useState('');
	const [validPasswordMatch, setValidPasswordMatch] = useState(true);
	const [focusPasswordMatch, setFocusPasswordMatch] = useState(false);

	const [checkTerms, setCheckTerms] = useState(false);

	const [errMsg, setErrMsg] = useState('');

	const [errRegistration, setErrorRegistration] = useState<string | null>(
		null
	);
	const [isSaving, setIsSaving] = useState(false);

	const [toastConfig, setToastConfig] = useState({
		isVisible: false,
		// type: "info" as ToastType,
		message: '',
		show: {
			type: 'fade',
			duration: 600,
			from: 0,
			to: 1,
		},
		hide: {
			type: 'fade',
			duration: 1000,
			from: 1,
			to: 0,
		},
	});

	useEffect(() => {
		setValidEmail(MAIL_REGEX.test(email));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email]);

	useEffect(() => {
		setValidPassword(PWD_REGEX.test(password));
		setValidPasswordMatch(password === passwordMatch);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [password, passwordMatch]);

	useEffect(() => {
		setErrMsg('');
	}, [email, password, passwordMatch]);

	const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
		setIsSaving(true);
		e.preventDefault();
		const v1 = MAIL_REGEX.test(email);
		const v2 = PWD_REGEX.test(password);
		if (!v1 || !v2) {
			setErrMsg('Invalid Entry');
			return;
		}
		try {
			const user: UserDto = new UserDto();
			user.email = email;
			user.password = password;

			await registerUser(user);
			router.push('/authentication/verify');
		} catch (err: any) {
			const type = 'error';
			const message = err.response.data;

			setEmail('');
			setPassword('');
			setPasswordMatch('');
			setIsSaving(false);

			setErrorRegistration(message);
		}
	};

	const handleGoogleSignUp = () => {
		signIn('google', { callbackUrl: '/' });
	};

	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
	};

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setToastConfig({
			...toastConfig,
			isVisible: false,
		});
	};
	const action = (
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

	return (
		<div className="h-screen md:flex">
			<LeftDivider />
			<div className="flex flex-col md:w-2/3 p-4 justify-center py-10 items-center ">
				<form className="w-96" onSubmit={handleRegister}>
					<h1 className="font-bold text-2xl mb-4">Registrieren</h1>
					{errRegistration && (
						<span className="my-3 mb-5 font-bold text-red-600">
							{errRegistration}{' '}
							<a
								className="text-sky-700"
								href="/authentication/resetPassword"
							>
								Passwort zurücksetzen?
							</a>
						</span>
					)}

					<TextField
						id="outlined-basic"
						label="E-Mail"
						className="w-full"
						sx={{ marginTop: 2 }}
						variant="outlined"
						onFocus={() => setFocusEmail(true)}
						onBlur={() => setFocusEmail(false)}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<ul
						id="uidnote"
						className={
							email && !validEmail
								? 'max-w-md ml-8 mt-2 mb-4 text-sm space-y-0 text-red-600 list-disc list-outside'
								: 'hidden'
						}
					>
						<li>4 bis 24 Zeichen</li>
						<li>Muss mit einem Buchstaben beginnen</li>
						<li>
							Buchstaben, Nummern, Unterstriche und Bindestriche
							erlaubt
						</li>
					</ul>

					<FormControl
						sx={{ marginTop: 1, width: '100%' }}
						variant="outlined"
					>
						<InputLabel htmlFor="outlined-adornment-password">
							Passwort
						</InputLabel>
						<OutlinedInput
							id="outlined-adornment-password"
							type={showPassword ? 'text' : 'password'}
							onChange={(e) => setPassword(e.target.value)}
							onFocus={() => setFocusPassword(true)}
							onBlur={() => setFocusPassword(false)}
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
					<ul
						id="pwdnote"
						className={
							password && !validPassword
								? 'max-w-md ml-8 mt-2 mb-4 text-sm space-y-0 text-red-600 list-disc list-outside'
								: 'hidden'
						}
					>
						<li>8 bis 24 Zeichen</li>
						<li>
							Muss Groß- und Kleinbuchstaben und eine Nummer
							enthalten
						</li>
					</ul>

					<FormControl
						sx={{ marginTop: 1, width: '100%' }}
						variant="outlined"
					>
						<InputLabel htmlFor="outlined-adornment-password">
							Passwort wiederholen
						</InputLabel>
						<OutlinedInput
							id="outlined-adornment-password"
							type={showPassword ? 'text' : 'password'}
							onChange={(e) => setPasswordMatch(e.target.value)}
							onFocus={() => setFocusPasswordMatch(true)}
							onBlur={() => setFocusPasswordMatch(false)}
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
							label="Passwort wiederholen"
						/>
					</FormControl>
					<ul
						id="confirmnote"
						className={
							!validPasswordMatch
								? 'max-w-md ml-8 mt-2 mb-4 text-sm space-y-0 text-red-600 list-disc list-outside'
								: 'hidden'
						}
					>
						<li>Muss mit dem Passwort übereinstimmen</li>
					</ul>
					<div className="flex flex-row items-center mt-6 mb-6">
						<Checkbox
							value={checkTerms}
							onChange={(e) => setCheckTerms(e.target.checked)}
						/>
						<div className="ml-3 text-sm">
							<label htmlFor="terms" className="font-light">
								Ich akzeptiere die{' '}
								<a
									className="font-medium text-primary-600 hover:underline dark:text-primary-500"
									href="/agb"
								>
									Geschäftsbedingungen
								</a>
							</label>
						</div>
					</div>

					<button
						type="submit"
						disabled={
							isSaving ||
							!validEmail ||
							!validPassword ||
							!validPasswordMatch ||
							!checkTerms
								? true
								: false
						}
						className="w-full flex flex-row justify-center bg-sky-600 mt-4 py-2 disabled:bg-gray-600 rounded-2xl text-white font-semibold mb-2 hover:bg-sky-700"
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
							'Registrieren'
						)}
					</button>

					<div className="w-full mt-4 flex items-center">
						<div className="flex-grow border-t border-gray-300"></div>
						<span className="flex-shrink mx-4 text-gray-600">
							ODER
						</span>
						<div className="flex-grow border-t border-gray-300"></div>
					</div>

					<button
						type="button"
						onClick={handleGoogleSignUp}
						className="w-full flex flex-row justify-center items-center bg-white mt-4 py-2 rounded-2xl text-black font-semibold mb-4 hover:bg-gray-100 border border-gray-300"
					>
						<FontAwesomeIcon
							icon={faGoogle}
							className="w-5 h-5 mr-2"
							style={{ fontSize: '1.25rem' }}
						/>
						Mit Google registrieren
					</button>

					<div className="text-md flex flex-col gap-y-2 mt-4 items-center py-2 px-3">
						Bereits einen Account?{' '}
						<a
							href="/authentication/login"
							className="text-sky-600"
						>
							Hier anmelden
						</a>
					</div>
				</form>
			</div>
		</div>
	);
}
