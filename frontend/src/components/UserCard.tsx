import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../app/store'

const UserCard = () => {

  const user = useSelector((state: RootState) => state.auth.user)
  console.log(user);
  
  return (
    <div className="w-full flex flex-col items-center border py-4 rounded">
      <img className="h-40 w-40 object-cover rounded-full mb-4" src="/PresPhoto.jpg"/>
      <h2 className="font-bold">{user?.name}</h2>
    </div>
  )
}

export default UserCard
