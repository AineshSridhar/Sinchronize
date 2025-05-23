import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import {useNavigate} from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';

const Auth = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {user, loading, error} = useSelector((state: RootState) => state.auth);
    
    const [login, setLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        email: '',
    })

    useEffect(() => {
        if (user || localStorage.getItem('token')){
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        const url = login ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
        const payload = login ? {email: formData.email, password: formData.password}: formData;

        try{
            dispatch(loginStart());
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body:JSON.stringify(payload),
            });

            const data = await res.json();
            console.log('Response:', data);
            if (res.ok){
                const userData = {
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    token: data.token,
                };
                localStorage.setItem('token', data.token);
                dispatch(loginSuccess(userData));
                navigate('/dashboard');
            } else {
                dispatch(loginFailure(data.message || 'Authentication failed'));
            }
        } catch (err){
            console.error('Error', err);
            dispatch(loginFailure("Something went wrong"));
        }
    }

return (
    <div className="flex justify-center items-center bg-purple-300">
    <div className="flex h-screen rounded-2xl overflow-hidden bg-white">
        <div className="w-1/2">
            <img className="h-full w-full object-cover" src="/group-photo-scaled.jpeg" alt="group"/>
        </div>
        <div className="w-1/2 flex flex-col px-10 py-20">
            <div className="w-full flex mb-10">                    
                <button className={`w-1/2 py-2 ${login ? 'bg-purple-500 text-white':'bg-gray-300'}`} onClick={() => setLogin(true)}>Login</button>
                <button className={`w-1/2 py-2 ${!login ? 'bg-purple-500 text-white':'bg-gray-300'}`} onClick={() => setLogin(false)}>Register</button>
            </div>
            <div className="w-3/4 max-w-md mx-auto mt-auto mb-auto">
                <h1 className="text-center font-bold text-2xl mb-10">{login ? 'Login' : 'Register'}</h1>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1">Email</label>
                        <input type="text" name='email' value={formData.email} onChange={handleChange} className="p-2 border w-full rounded" placeholder="Enter your email"/>
                    </div>
                    <div>
                        <label className="block mb-1">Password</label>
                        <input type="password" name='password' value={formData.password} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Enter your password"/>
                    </div>
                    {!login && (
                        <div>
                            <label className="block mb-1">Username</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Enter your username"/>
                        </div>
                    )}
                    <button type='submit' className="w-full bg-purple-500 text-white py-2 rounded cursor-pointer hover:bg-purple-700">{login ? 'Login' : 'Register' }</button>
                </form>
            </div>
        </div>
    </div>
    </div>
)
}

export default Auth
