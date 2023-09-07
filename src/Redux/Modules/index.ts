
import { combineReducers } from "@reduxjs/toolkit";

import { authSliceReducer } from "./Auth/auth.slice";
import { conversationSliceReducer } from "./Conversations/conversation.slice"
import { otpSliceReducer } from "./Otp";
import { farmsSliceReducer } from "./Farms";

export const combinedReducer = combineReducers({

    ...authSliceReducer,
    ...conversationSliceReducer,
    ...otpSliceReducer,
    ...farmsSliceReducer

});

