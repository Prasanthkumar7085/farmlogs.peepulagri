import { conversationSliceReducer } from "./conversation.slice";

const combinedReducer = {
    ...conversationSliceReducer,

};

export * from "./conversation.slice";
export default combinedReducer;
