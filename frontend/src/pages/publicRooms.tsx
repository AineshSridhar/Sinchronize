import React, { useEffect } from 'react'

const publicRooms = () => {
    useEffect(() => {
        const fetchPublicRooms = async() => {
            try{
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/rooms', {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                
                const data = response.json();
                console.log(data);
            } catch (err){
                console.error(err);
            }
        }
        fetchPublicRooms()
    }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-purple-500">Let's get going!</h2>
    </div>
  )
}

export default publicRooms
