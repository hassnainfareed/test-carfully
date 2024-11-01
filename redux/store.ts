import { configureStore } from "@reduxjs/toolkit";
import managementReducer from "@/redux/features/managementSlice";
import bookingReducer from "@/redux/features/bookingSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    managementReducer,
    bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
