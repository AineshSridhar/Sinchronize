import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import { addRoom } from '../features/rooms/roomSlice';
import {useForm} from 'react-hook-form';

type RoomFormData = {
    name: string;
    description: string;
    isPrivate: boolean;
}

const CreateStudyRoom = () => {
    const {register, handleSubmit} = useForm<RoomFormData>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async(data: RoomFormData) => {
        const newRoom = {
            id: uuidv4(),
            name: data.name,
            description: data.description,
            isPrivate: data.isPrivate,
            members: [],
            createdAt: new Date().toISOString(),
        };

        try{
            const response = await fetch('http://localhost:5000/api/rooms', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newRoom),
            });

            if (!response.ok) throw new Error('Failed to create study room');

            dispatch(addRoom(newRoom));
            navigate('/dashboard');
        } catch (error){
            console.error(error);
        }
    }
  return (
    <div>
        <div className="p-10 max-w-xl mx-auto">
            <h1 className='text-2xl font-bold mb-5'>Create Study Room</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input {...register('name', {required: true})} placeholder="Room Name" className="w-full border p-2 rounded"/>
                <textarea {...register('description', {required: true})} placeholder = "Description" className="w-full border p-2 rounded"/>
                <label className="block">
                    <input type='checkbox' {...register('isPrivate')} className="mr-2"/>
                    Make room private (join via code)
                </label>
                <button type="submit" className="bg-purple-500 text-white py-2 px-4 rounded">
                    Create Room
                </button>
            </form>
        </div>
      
    </div>
  )
}

export default CreateStudyRoom
