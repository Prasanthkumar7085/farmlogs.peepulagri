import { createSlice } from "@reduxjs/toolkit";
import { Conversation } from "./conversation";

const reducerName = "conversation";

export const initialState: Conversation.ConversationsInitialState = {
  messages: []
};

export const conversationSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setMessages: (state: any, action: any) => {
      state.messages = [...action.payload];
    },
    addNewMessage: (state: any, action: any) => {
      state.messages = [...state.messages, action.payload];
    }
  },
});

export const {
  setMessages,
  addNewMessage
}: any = conversationSlice.actions;
export const conversationSliceReducer = { [reducerName]: conversationSlice.reducer };
