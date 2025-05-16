import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {RootState} from "../app/store.ts"
import { useSelector } from 'react-redux';
import { fetchRoomsFailure, fetchRoomsStart, fetchRoomsSuccess } from '../features/rooms/roomSlice';

const RoomsList = () => {
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
        <ul>
            {rooms.map(room => (
                <li key={room.id} className="border rounded-lg p-2 w-1/4">
                    <h3 className=""><span className="font-bold">Study Room: </span>{room.name}</h3>
                    <p><span className="font-bold">Description: </span>{room.description}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default RoomsList
