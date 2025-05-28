import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Student{
    _id: string;
    userId: string;
    roomId: string;
    timeStudied: number;
    questionsSolved: number;
    lastActive: string;
    streak: number;
}

interface StudentsState{
    students: Student[];
    loading: boolean;
    error: string | null;
}

const initialState: StudentsState = {
    students: [],
    loading: false,
    error: null,
}

const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers:{
        fetchStudentsStart(state: StudentsState){
            state.loading = true;
            state.error = null;
        },
        fetchStudentsSuccess(state: StudentsState, action: PayloadAction<Student[]>){
            state.loading = false;
            state.students = action.payload;
        },
        fetchStudentsFailure(state: StudentsState, action: PayloadAction<string>){
            state.loading = false;
            state.error = action.payload;
        },
        updateStudentTime(state, action: PayloadAction<{userId: string; timeStudied: number}>) => {
            const index = state.students.findIndex(s => s.userId === action.payload.userId);
            if (index !== -1){
                state.students[index].timeStudied = action.payload.timeStudied;
            }
        }
    },
});

export const {fetchStudentsStart, fetchStudentsSuccess, fetchStudentsFailure} = studentSlice.actions;
export default studentSlice.reducer;
