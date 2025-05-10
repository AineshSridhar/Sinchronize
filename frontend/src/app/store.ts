import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.ts";
import roomReducer from "../features/rooms/roomSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        rooms: roomReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;