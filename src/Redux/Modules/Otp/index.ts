import { otpSliceReducer } from ".";

const combinedReducer = {
    ...otpSliceReducer,

};

export * from "./otp.slice";
export default combinedReducer;
