import { createSlice } from "@reduxjs/toolkit";
import { Otp } from "./otp";


const reducerName = "otp";

export const initialState: Otp.OtpData = {
  resendOtpIn: 0
};

export const otpSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setOtpCountDown: (state: any, action: any) => {
      state.resendOtpIn = action.payload;
    },
    resetOtpCountDown: (state: any) => {
      state.resendOtpIn = 59
    }
  },
});

export const {
  setOtpCountDown,
  resetOtpCountDown
}: any = otpSlice.actions;
export const otpSliceReducer = { [reducerName]: otpSlice.reducer };
