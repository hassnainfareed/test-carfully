import axios, { AxiosResponse } from "axios";

export async function registerUser(user: any): Promise<AxiosResponse> {
  var res = await axios.post("/api/authentication/register", user);
  return res.data;
}

export async function verifyEmailAddress(verificationId: string) {
  var res = await axios.post("/api/authentication/verify", {
    id: verificationId,
  });
  return res.data as boolean;
}

export async function createResetPasswordId(email: string) {
  var res = await axios.post("/api/authentication/createResetPasswordId", {
    email: email,
  });
  return res.data as boolean;
}

export async function resetPassword(resetPasswordId: string, password: string) {
  var res = await axios.post("/api/authentication/resetPassword", {
    resetPasswordId: resetPasswordId,
    password: password,
  });
  return res.data as boolean;
}
