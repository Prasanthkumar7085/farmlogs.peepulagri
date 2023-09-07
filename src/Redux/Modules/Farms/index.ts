import { farmsSliceReducer } from ".";

const combinedReducer = {
    ...farmsSliceReducer,

};

export * from "./farms.slice";
export default combinedReducer;
