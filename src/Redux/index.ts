import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import { configureStore, createAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";


import pesistStorage from "./persistateStore"
import { combinedReducer } from "./Modules";


export const makeStore = ({ isServer }: any) => {
    /* istanbul ignore else */
    if (typeof isServer === undefined || isServer) {
        isServer = typeof window === "undefined";
    }

    /* istanbul ignore else */
    if (isServer) {
        //If it's on server side, create a store
        return configureStore({
            reducer: combinedReducer,
            middleware: (getDefaultMiddleware) =>
                getDefaultMiddleware({
                    serializableCheck: {
                        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                    },
                }),

        });
    } else {

        const persistConfig = {
            key: "peepul_agri_v1",
            version: 1,
            storage: pesistStorage,
            REHYDRATE: false
        };



        /* istanbul ignore next */
        const persistedReducer = persistReducer(persistConfig, combinedReducer); // Create a new reducer with our existing reducer

        /* istanbul ignore next */
        const store: any = configureStore({
            reducer: persistedReducer,

        });

        /* istanbul ignore next */
        store.__persistor = persistStore(store);

        /* istanbul ignore next */
        return store;
    }
};

export const wrapper = createWrapper<any>(makeStore);
