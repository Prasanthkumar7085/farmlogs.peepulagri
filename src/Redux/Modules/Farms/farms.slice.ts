import { createSlice } from "@reduxjs/toolkit";
import { Farms } from "./farms";


const reducerName = "farms";

export const initialState: Farms.FarmsData = {
  farmsDataArray: [],
  singleFarm: {}
};

export const farmsSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setAllFarms: (state: any, action: any) => {
      state.farmsDataArray = [...action.payload];
    },
    setSingleFarm: (state: any, action: any) => {
      let array = [...state.farmsDataArray];
      let id = action.payload;

      let foundItem = array.find((item: any) => item?._id == id);
      state.singleFarm = foundItem;
    }
  },
});

export const {
  setAllFarms,
  setSingleFarm
}: any = farmsSlice.actions;
export const farmsSliceReducer = { [reducerName]: farmsSlice.reducer };
