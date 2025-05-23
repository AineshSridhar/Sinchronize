import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JoinRoomByCode: React.FC = () => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rooms/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code: roomCode}),
      });

      if (!response.ok) throw new Error('Room not found');

      const data = await response.json();
      const room = data.room;
        console.log(room);
      navigate(`/rooms/${room._id}`, { state: { room } });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Join Private Room</h1>
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-64 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <button
        onClick={handleJoin}
        className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition"
      >
        Join Room
      </button>
    </div>
  );
};

export default JoinRoomByCode;
