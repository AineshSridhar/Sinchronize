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
        <div >
      <h1 className="text-xl text-purple-900"><span className="font-bold">Room: </span>{room.name}</h1>
      <p className="text-xl"><span className="font-bold">Desc: </span>{room.description}</p>
      <p className="text-xl mb-3"><span className="font-bold">Members: </span>{room.members?.length || 0}</p>
      </div>
      <h2 className="text-xl mb-4">Users in the Room:</h2>
        <div className="w-1/4 border pl-2">
            {students.map(student => {
                return (<div key={student._id}>
                    <div>User: {student.userId}</div>
                    <div>Time studied: {student.timeStudied} mins</div>
                    <div>Questions Solved: {student.questionsSolved}</div>
                    <div>Streak: {student.streak}</div>
                </div>
                );
            })}
        </div>
    </div>
  )
}

export default RoomDetails
