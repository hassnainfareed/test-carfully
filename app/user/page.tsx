"use client";

import React, { useState, useEffect, Fragment } from "react";
import UserService from "@/services/UserService";
import UserAddressesComponent from "../../components/user/UserAddressesComponent";
import UserCarsComponent from "../../components/user/UserCarsComponent";
import UserBookingsComponent from "../../components/user/UserBookingsComponent";
import TextField from "@mui/material/TextField";

export default function User() {
  const [email, setEmail] = useState<string>();
  const [userId, setUserId] = useState<string | undefined>();

  let userService = new UserService();

  useEffect(() => {
    Promise.all([initializeUser()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initializeUser() {
    const user = await userService.getUser();
    setUserId(user.id);
    setEmail(user.email);
  }

  return (
    <div className="grid grid-cols-5 mx-auto max-w-7xl p-4">
      <div className="col-span-5">
        <div id="scrollspy-2" className="space-y-4">
          <div id="itemAccount">
            <h3 className="text-lg font-semibold text-sky-600">
              Benutzeraccount
            </h3>
            <div className="flex flex-row mt-2 gap-x-4">
              {/* <TextBox
                className="grow max-w-md"
                label="E-Mail"
                labelMode="floating"
                disabled={true}
                value={email!}
                height={52}
                valueChangeEvent="input"
                onValueChange={(e) => {
                  setEmail(e);
                }}
              /> */}
              <TextField
                label="E-Mail"
                placeholder=""
                className="flex-1"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                value={email}
                variant="outlined"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>

          <UserAddressesComponent userId={userId} />
          <UserCarsComponent userId={userId} />
          <UserBookingsComponent userId={userId} />
        </div>
      </div>
    </div>
  );
}
