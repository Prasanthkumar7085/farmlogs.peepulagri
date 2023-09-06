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
      state.messages = [action.payload, ...state.messages];
    },
    deleteAllMessages: (state: any) => {
      state.messages = []
    }
  },
});

export const {
  setMessages,
  addNewMessage,
  deleteAllMessages
}: any = conversationSlice.actions;
export const conversationSliceReducer = { [reducerName]: conversationSlice.reducer };
