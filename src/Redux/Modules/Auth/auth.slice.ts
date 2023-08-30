import { createSlice } from "@reduxjs/toolkit";
import { Auth } from "./auth";

const reducerName = "auth";

export const initialState: Auth.AuthInitial = {
  userDetails: {}
};

export const authSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setUserDetails: (state: any, action: any) => {
      state.userDetails = { ...action.payload };
    },
    removeUserDetails: (state: any) => {
      state.userDetails = {}
    }
  },
});

export const {
  setUserDetails
}: any = authSlice.actions;
export const authSliceReducer = { [reducerName]: authSlice.reducer };
