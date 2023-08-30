
import { combineReducers } from "@reduxjs/toolkit";
import { authSliceReducer } from "./Auth/auth.slice";

export const combinedReducer = combineReducers({

    ...authSliceReducer,

});

