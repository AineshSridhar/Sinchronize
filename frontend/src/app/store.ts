import {configureStore, combineReducers} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.ts";
import roomReducer from "../features/rooms/roomSlice.ts";
import studentReducer from "../features/students/studentSlice.ts";

import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
}

const rootReducer = combineReducers({
    auth: authReducer,
    rooms: roomReducer,
    students: studentReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false,
    }),
});

export const persistor = persistStore(store); 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;