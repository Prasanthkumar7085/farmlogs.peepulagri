import { createSlice } from "@reduxjs/toolkit";
import { Farms } from "./farms";


const reducerName = "farms";

export const initialState: Farms.FarmsData = {
  farmsDataArray: [],
  singleFarm: {},
  filesList: [],
  cropName: ''
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
    },
    storeFilesArray: (state: any, action: any) => {
      let temp = [...state.filesList, ...action.payload]
      state.filesList = temp
    },
    setCropTitleTemp: (state: any, action: any) => {
      state.cropName = action.payload;
    },
    removeTheFilesFromStore: (state: any, action: any) => {
      state.filesList = action.payload
    },
  },
});

export const {
  setAllFarms,
  setSingleFarm, storeFilesArray,
  setCropTitleTemp, removeTheFilesFromStore
}: any = farmsSlice.actions;
export const farmsSliceReducer = { [reducerName]: farmsSlice.reducer };



