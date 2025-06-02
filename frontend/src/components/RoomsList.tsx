import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../app/store'
import { fetchRoomsFailure, fetchRoomsStart, fetchRoomsSuccess } from '../features/rooms/roomSlice'

const RoomsList: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { rooms, loading, error } = useSelector((state: RootState) => state.rooms)

  useEffect(() => {
    const fetchRooms = async () => {
      dispatch(fetchRoomsStart())
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('http://localhost:5000/api/rooms/myrooms', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error('Fetch failed')
        const data = await res.json()
        dispatch(fetchRoomsSuccess(data))
      } catch (err) {
        dispatch(fetchRoomsFailure('Failed to fetch rooms'))
      }
    }
    fetchRooms()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Strip */}
      <header className="w-full bg-purple-700 py-4 shadow-md">
        <h1 className="text-2xl text-white text-center font-semibold">My Rooms</h1>
      </header>

      <main className="p-6">
        {loading && <p>Loading rooms...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map(room => (
              <div
                key={room._id}
                onClick={() => navigate(`/rooms/${room._id}`, { state: { room } })}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition cursor-pointer"
              >
                <h2 className="text-lg font-bold text-purple-800 mb-2">
                  {room.name}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  {room.description}
                </p>
                <p className="text-sm text-gray-600">
                  Members: <span className="font-semibold text-purple-700">{room.members.length}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default RoomsList
