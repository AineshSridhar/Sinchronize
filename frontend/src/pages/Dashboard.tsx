import React, { useEffect } from 'react'
import RoomsList from '../components/RoomsList'
import { useNavigate } from 'react-router-dom'
import UserCard from '../components/UserCard'

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem('token')){
            navigate('/auth');
        }
    })
  return (
    <>
        <div className="flex gap-5 p-10">
            <div className="w-3/4">
                <RoomsList/>
            </div>
            <div className="w-1/4">
                <div><UserCard/></div>
                <button className="bg-purple-500 text-white cursor-pointer mt-4 p-3 rounded w-full" onClick={() => navigate('/add')}>Create new room</button>
            </div>
        </div>
    </>
  )
}

export default Dashboard
