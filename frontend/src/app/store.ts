import {configureStore} from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.ts";
import roomReducer from "../features/rooms/roomSlice.ts";
import studentReducer from "../features/students/studentSlice.ts";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        rooms: roomReducer,
        students: studentReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;