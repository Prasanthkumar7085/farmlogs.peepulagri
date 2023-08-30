
import { combineReducers } from "@reduxjs/toolkit";

import { authSliceReducer } from "./Auth/auth.slice";
import { conversationSliceReducer } from "./Conversations/conversation.slice"

export const combinedReducer = combineReducers({

    ...authSliceReducer,
    ...conversationSliceReducer

});

