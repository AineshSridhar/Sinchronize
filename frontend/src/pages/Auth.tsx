    import React, { useState } from 'react'

    const Auth = () => {
        const [login, setLogin] = useState(true);

    return (
        <div className="flex h-screen border rounded-2xl overflow-hidden">
            <div className="w-1/2">
                <img className="h-full w-full object-cover border" src="/group-photo-scaled.jpeg" alt="group"/>
            </div>
            <div className="w-1/2 flex flex-col px-10 py-8">
                <div className="w-full flex mb-10">                    
                    <button className={`w-1/2 py-2 ${login ? 'bg-blue-500 text-white':'bg-gray-300'}`} onClick={() => setLogin(true)}>Login</button>
                    <button className={`w-1/2 py-2 ${!login ? 'bg-blue-500 text-white':'bg-gray-300'}`} onClick={() => setLogin(false)}>Register</button>
                </div>
                <div className="w-3/4 max-w-md mx-auto mt-auto mb-auto">
                    <h1 className="text-center font-bold text-2xl mb-10">{login ? 'Login' : 'Register'}</h1>
                    <form className="space-y-5">
                        <div>
                            <label className="block mb-1">Username</label>
                            <input type="text" className="p-2 border w-full rounded" placeholder="Enter your username"/>
                        </div>
                        <div>
                            <label className="block mb-1">Password</label>
                            <input type="password" className="w-full border p-2 rounded" placeholder="Enter your password"/>
                        </div>
                        {!login && (
                            <div>
                                <label className="block mb-1">Email</label>
                                <input type="text" className="w-full border p-2 rounded" placeholder="Enter your email"/>
                            </div>
                        )}
                        <button type='submit' className="w-full bg-blue-500 text-white py-2 rounded hover: bg-blue-700">{login ? 'Login' : 'Register' }</button>
                    </form>
                </div>
            </div>
        </div>
    )
    }

    export default Auth
