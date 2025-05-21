import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import studentSlice, { fetchStudentsStart, fetchStudentsFailure, fetchStudentsSuccess } from '../features/students/studentSlice';
import {RootState} from "../app/store"

const RoomDetails = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const room = location.state?.room;
    const {students, loading, error} = useSelector((state:RootState) => state.students);

    if (!room) return <p>No room data provided</p>;

    useEffect(() => {
        if(!room) return;

        const fetchStudents = async() => {
            dispatch(fetchStudentsStart());
            try{
                const token = localStorage.getItem('token');
                const response = await fetch (`http://localhost:5000/api/rooms/${room._id}/students`,{
                    method: "GET",
                    headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    },
                })

                if(!response.ok) throw new Error('Failed to fetch students');
                const data = await response.json();
                console.log(data);
                dispatch(fetchStudentsSuccess(data));
            } catch (err){
                console.error(err);
                dispatch(fetchStudentsFailure((err as Error).message));
            }
        }
        fetchStudents();
    }, [room, dispatch]);

    if (!room) return <p>No room data provided</p>;
    if (loading) return <p>Loading students...</p>;
    if (error) return <p>Error: {error}</p>

  return (
    <div className="p-5">
      <h1>Room: {room._id}</h1>
      <p>Desc: {room.description}</p>
      <p>Members: {room.members?.length || 0}</p>
      <h2>Students in the Room:</h2>
        <div className="flex border pl-2">
            {students.map(student => {
                return (<div key={student._id}>
                    User ID: {student.userId}, Time studied: {student.timeStudied} mins,
                    Questions Solved: {student.questionsSolved}, Streak: {student.streak}
                </div>
                );
            })}
        </div>
    </div>
  )
}

export default RoomDetails
