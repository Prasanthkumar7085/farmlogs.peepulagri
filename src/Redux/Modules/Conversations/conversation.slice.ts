import { createSlice } from "@reduxjs/toolkit";
import { Conversation } from "./conversation";

const reducerName = "conversation";

export const initialState: Conversation.ConversationsInitialState = {
  messages: [],
  attachmentsFilesList: [],

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
    },
    storeAttachementsFilesArray: (state: any, action: any) => {
      let temp = [...state.attachmentsFilesList, ...action.payload]
      state.attachmentsFilesList = temp
    },
    removeTheAttachementsFilesFromStore: (state: any, action: any) => {
      state.attachmentsFilesList = action.payload
    },
    removeOneAttachmentElement: (state: any, action: any) => {
      const selectedFilesCopy = [...state.attachmentsFilesList];
      selectedFilesCopy.splice(action.payload, 1);
      state.attachmentsFilesList = selectedFilesCopy
    },
  },
});

export const {
  setMessages,
  addNewMessage,
  deleteAllMessages,
  storeAttachementsFilesArray,
  removeTheAttachementsFilesFromStore,
  removeOneAttachmentElement
}: any = conversationSlice.actions;
export const conversationSliceReducer = { [reducerName]: conversationSlice.reducer };
