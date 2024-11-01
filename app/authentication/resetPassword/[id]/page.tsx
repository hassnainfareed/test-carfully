"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { UserDto } from "@/types/user.d";
import { resetPassword } from "@/services/AuthenticationService";
import LeftDivider from "@/components/LeftDivider";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

export default function ResetPasswordMask({
  params,
}: {
  params: { id: string };
}) {
  // const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const PWD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [focusPassowrd, setFocusPassword] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState("");
  const [validPasswordMatch, setValidPasswordMatch] = useState(true);
  const [focusPasswordMatch, setFocusPasswordMatch] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidPasswordMatch(password === passwordMatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, passwordMatch]);

  useEffect(() => {
    setErrMsg("");
  }, [password, passwordMatch]);

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    setIsSaving(true);
    e.preventDefault();

    const v2 = PWD_REGEX.test(password);
    if (!v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    const user: UserDto = new UserDto();
    user.password = password;

    await resetPassword(params.id, password);

    router.push("/authentication/login");
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="h-screen md:flex">
      <LeftDivider />
      <div className="flex md:w-2/3 justify-center p-4 py-10 items-center ">
        <form className="w-96" onSubmit={handleResetPassword}>
          <h1 className="font-bold text-2xl mb-4 justify-center">
            Passwort zurücksetzen
          </h1>
          <FormControl sx={{ marginTop: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Passwort
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusPassword(true)}
              onBlur={() => setFocusPassword(false)}
              value={password}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
                ? "max-w-md ml-8 mt-2 mb-4 text-sm space-y-0 text-gray-600 list-disc list-outside"
                : "hidden"
            }
          >
            <li>4 bis 24 Zeichen</li>
            <li>Muss mit einem Buchstaben beginnen</li>
            <li>Buchstaben, Nummern, Unterstriche und Bindestriche erlaubt</li>
          </ul>
          <FormControl sx={{ marginTop: 1, width: "100%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Passwort wiederholen
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPasswordMatch(e.target.value)}
              onFocus={() => setFocusPasswordMatch(true)}
              onBlur={() => setFocusPasswordMatch(false)}
              value={passwordMatch}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
                ? "max-w-md ml-8 mt-2 mb-4 text-sm space-y-0 text-gray-600 list-disc list-outside"
                : "hidden"
            }
          >
            <li>Muss mit dem Passwort übereinstimmen</li>
          </ul>

          <button
            type="submit"
            disabled={
              isSaving || !validPassword || !validPasswordMatch ? true : false
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
              "Passwort zurücksetzen"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
