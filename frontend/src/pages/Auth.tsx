import React, { useState } from 'react'
import {useNavigate} from "react-router-dom";

const Auth = () => {
    const navigate = useNavigate()
    const [login, setLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    })

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
                navigate('/dashboard');
                localStorage.setItem("token", data.token);

            } else {
                login ? alert(data.message || 'Login failed') : alert(data.message || 'Registration failed');
            }
        } catch (err){
            console.error('Error', err);
        }
    }

return (
    <div className="flex justify-center items-center bg-gray-200">
    <div className="flex h-screen border rounded-2xl overflow-hidden bg-white">
        <div className="w-1/2">
            <img className="h-full w-full object-cover border" src="/group-photo-scaled.jpeg" alt="group"/>
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
                            <input type="text" name="username" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Enter your username"/>
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
