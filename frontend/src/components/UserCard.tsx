import React from 'react'

const UserCard = () => {
  return (
    <div className="w-full flex flex-col items-center border py-4 rounded">
      <img className="h-40 w-40 object-cover rounded-full mb-4" src="/PresPhoto.jpg"/>
      <h2 className="font-bold">Ainesh Sridhar</h2>
    </div>
  )
}

export default UserCard
