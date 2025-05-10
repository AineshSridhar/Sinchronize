import {createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User{
    id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthState{
    user: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart(state: AuthState){
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state: AuthState, action: PayloadAction<User>){
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        },
        loginFailure(state: AuthState, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state: AuthState){
            state.user= null;
        },
    },
});

export const {loginStart, loginSuccess, loginFailure, logout} = authSlice.actions;
export default authSlice.reducer;