import {createSlice, PayloadAction} from "@redux/toolkit";

interface Room {
    id: string;
    name: string;
    description?: string;
    members: string[];
    createdAt: string;
}

interface RoomsState{
    rooms: Room[];
    loading: boolean;
    error: string | null;
}

const roomsSlice = createSlice({
    name: "rooms"
    initialState,
    reducers: {
        fetchRoomsStart(state){
            state.loading = true;
            state.error = null;
        },
        fetchRoomsSuccess(state, action: PayloadAction<Room[]>){
            state.loading = false;
            state.rooms = action.payload;
        },
        fetchRoomsFailure(state, action: PayloadAction<string>){
            state.loading = false;
            state.error = action.payload;
        }
    }
})