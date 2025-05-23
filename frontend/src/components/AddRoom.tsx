import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form'; // Import the useForm hook
import { addRoom } from '../features/rooms/roomSlice';

type RoomFormData = {
    name: string;
    description?: string;
};

const AddRoom = () => {
    const {register, handleSubmit} = useForm<RoomFormData>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data: RoomFormData) => {
        const newRoom = {
            id: uuidv4(),
            name: data.name,
            description: data.description,
            members: [],
            createdAt: new Date().toISOString(),
        };
        try{
            const response = await fetch('http://localhost:5000/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(newRoom),
            });

            if (!response.ok) throw new Error("Failed to save new room");
            
            dispatch(addRoom(newRoom));
            navigate('/dashboard');
        } catch (error){
            console.error(error);
        }
    };

  return (
    <div>
        <h1>Add New Room</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register('name', {required: true})} placeholder="Room Name" className=""/>
            <textarea {...register('description', {required: true})} placeholder="Description" className=""/>
            <button type="submit" className="">Create Room</button>
        </form>
    </div>
  )
}

export default AddRoom;
