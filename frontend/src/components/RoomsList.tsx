import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {RootState} from "../app/store.ts"
import { useSelector } from 'react-redux';
import { fetchRoomsFailure, fetchRoomsStart, fetchRoomsSuccess } from '../features/rooms/roomSlice';
import { useNavigate } from 'react-router-dom';

const RoomsList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {rooms, loading, error} = useSelector((state: RootState) => state.rooms)

    useEffect(() => {
        const fetchRooms = async() => {
            dispatch(fetchRoomsStart())
            try{
                const token = localStorage.getItem('token')
                const response = await fetch('http://localhost:5000/api/rooms/myrooms', {
                    method: "GET",
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
                    },
                });
                const data = await response.json();
                console.log(data);
                dispatch(fetchRoomsSuccess(data))
            } catch (err) {
                dispatch(fetchRoomsFailure('Failed to fetch rooms'))
            }
        }
        fetchRooms()
    }, [dispatch])

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>

  return (
    <div>
        <h2 className="text-2xl font-bold mb-5">My Rooms</h2>
        <div className="flex flex-wrap gap-4">
            {rooms.map(room => (
                <div key={room.id} onClick={() => navigate(`/rooms/${room._id}`, { state: { room } })} className="w-1/5 border border-purple-500 border-2 cursor-pointer rounded-lg p-3 w-1/2 text-left">
                        <h3 className="mb-1 font-bold"><span className="text-purple-500">Study Room: </span>{room.name}</h3>
                        <p><span className="font-bold">Description: </span>{room.description}</p>
                        <p><span className="font-bold">Members: </span>{room.members.length}</p>
                </div>
            ))}
        </div>  
    </div>
  )
}

export default RoomsList
