import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface Room {
    id: string;
    name: string;
    description?: string;
    members: string[];
    createdAt: string;
}

interface RoomsState{
    rooms: Room[];
    currentRoom: Room | null,
    loading: boolean;
    error: string | null;
}

const initialState: RoomsState = {
    rooms: [],
    currentRoom: null,
    loading: false,
    error: null,
}

const roomSlice = createSlice({
    name: "rooms",
    initialState,
    reducers: {
        fetchRoomsStart(state: RoomsState){
            state.loading = true;
            state.error = null;
        },
        fetchRoomsSuccess(state: RoomsState, action: PayloadAction<Room[]>){
            state.loading = false;
            state.rooms = action.payload;
        },
        fetchRoomsFailure(state: RoomsState, action: PayloadAction<string>){
            state.loading = false;
            state.error = action.payload;
        },
        addRoom(state: RoomsState, action: PayloadAction<Room>){
            state.rooms.push(action.payload);
        },
        clearCurrentRoom(state: RoomsState){
            state.currentRoom = null;
        }
    },
});

export const {fetchRoomsStart, fetchRoomsSuccess, fetchRoomsFailure, addRoom, clearCurrentRoom} = roomSlice.actions;
export default roomSlice.reducer;
