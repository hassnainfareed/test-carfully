import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: ManagementState;
};

type ManagementState = {
  locationId: string;
};

const initialState = {
  value: {
    locationId: "",
  } as ManagementState,
} as InitialState;

export const auth = createSlice({
  name: "management",
  initialState,
  reducers: {
    setLocationId: (state, action: PayloadAction<string>) => {
      return {
        value: {
          locationId: action.payload,
        },
      };
    },
  },
});

export const { setLocationId } = auth.actions;
export default auth.reducer;
