import { createSlice } from "@reduxjs/toolkit";
import { Farms } from "./farms";


const reducerName = "farms";

export const initialState: Farms.FarmsData = {
  farmsDataArray: [],
  singleFarm: {},
  filesList: [],
  cropName: '',
  farmName:"",
  taskFilterOpen:false
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
    setFarmTitleTemp: (state: any, action: any) => {
      state.farmName = action.payload;
    },
    removeTheFilesFromStore: (state: any, action: any) => {
      state.filesList = action.payload
    },
    removeOneElement: (state: any, action: any) => {
      const selectedFilesCopy = [...state.filesList];
      selectedFilesCopy.splice(action.payload, 1);
      state.filesList = selectedFilesCopy
    },
    setToInitialState: (state: any) => {
      state = initialState;
    },
    changeTaskFilterOpen:(state:any)=>{
      state.taskFilterOpen = !state.taskFilterOpen
    }
  },
});

export const {
  setAllFarms,
  setSingleFarm, storeFilesArray,
  setCropTitleTemp,
  setFarmTitleTemp,
  removeTheFilesFromStore,
  removeOneElement,
  setToInitialState,
  changeTaskFilterOpen
}: any = farmsSlice.actions;
export const farmsSliceReducer = { [reducerName]: farmsSlice.reducer };



