import React, { useEffect } from 'react'
import {fetchRoomsStart, fetchRoomsSuccess, fetchRoomsFailure} from "../features/rooms/roomSlice"
import { RootState } from '../app/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const publicRooms = () => { 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {rooms, loading, error} = useSelector((state: RootState) => state.rooms);

    useEffect(() => {
        const fetchPublicRooms = async() => {
            dispatch(fetchRoomsStart());
            try{
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/rooms', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                
                const data = await response.json();
                console.log(data);
                dispatch(fetchRoomsSuccess(data));
            } catch (err){
                dispatch(fetchRoomsFailure("Failed to fetch public rooms"));
                console.error(err);
            }
        }
        fetchPublicRooms()
    }, [dispatch]);

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h2 className="text-2xl font-bold border text-center bg-purple-700 text-white p-10 text-3xl">Hurry! Time's ticking!</h2>
      <div className="flex gap-8 p-9">
            {rooms.map(room => (
                <div key={room.id} onClick={() => navigate(`/rooms/${room._id}`)} className="border border-purple-500 border-2 cursor-pointer rounded-lg p-3 w-1/4 text-left">
                        <h3 className="mb-1 font-bold"><span className="text-purple-500">Study Room: </span>{room.name}</h3>
                        <p><span className="font-bold">Description: </span>{room.description}</p>
                        <p><span className="font-bold">Members: </span>{room.members.length}</p>
                </div>
            ))}
      </div>
    </div>
  )
}

export default publicRooms
