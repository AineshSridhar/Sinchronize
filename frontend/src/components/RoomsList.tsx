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
                const response = await fetch('/api/rooms');
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
        <h2 className="">Available Rooms</h2>
        <ul>
            {rooms.map(room => (
                <li key={room.id} className="">
                    <h3 className="">{room.name}</h3>
                    <p>{room.description}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default RoomsList
