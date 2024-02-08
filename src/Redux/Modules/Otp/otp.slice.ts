import { createSlice } from "@reduxjs/toolkit";
import { Otp } from "./otp";


const reducerName = "otp";

export const initialState: Otp.OtpData = {
  resendOtpIn: 0,
  selectedItems: [],
};

export const otpSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setOtpCountDown: (state: any, action: any) => {
      state.resendOtpIn = action.payload;
    },
    resetOtpCountDown: (state: any) => {
      state.resendOtpIn = 30;
    },
    addItems: (state: any, action: any) => {
      state.selectedItems.push(action.payload);
    },
    removeItems: (state: any, action: any) => {
      state.selectedItems = action.payload;
    },
  },
});

export const { setOtpCountDown, resetOtpCountDown, addItems, removeItems }: any =
  otpSlice.actions;
export const otpSliceReducer = { [reducerName]: otpSlice.reducer };
