import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

interface Room {
    _id: string;
    name: string;
    description: string;
    members: string[];
}

const RoomDetails = () => {
    const {id} = useParams<{id: string}>();
    const [room, setRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoom = async() => {
            try{
                const token = localStorage.getItem('token')
                const response = await fetch(`http://localhost:5000/api/rooms/${id}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok){
                    throw new Error("Failed to fetch room details");
                }
                const data = await response.json();
                console.log(data);                
                setRoom(data); 
            } catch (error){
                setError((error as Error).message);
            }
        };
                
        fetchRoom();
    }, [id]);

    if (error) return <p>Error: {error}</p>
    if (!room) return <p>Loading...</p>

  return (
    <div>
      <h1>{room.name}</h1>
      <p>{room.description}</p>
      <p>Members: {room.members?.length || 0}</p>
    </div>
  )
}

export default RoomDetails
