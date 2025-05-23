import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { RootState } from '../app/store';
import { logout as logoutAction } from '../features/auth/authSlice';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isOpen, setIsOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem('token');
        dispatch(logoutAction())
        navigate('/');
    }
  return (
    <div className="relative shadow-md shadow--purple-900">
        <div className="flex-1 p-4 text0-white">
            <h2 className='font-bold text-2xl text-purple-500'>Sinchronize</h2>
        </div>

        {user? (
            <>
        <button onClick={() => setIsOpen(!isOpen)} className={`fixed cursor-pointer text-2xl top-3 right-4 z-50 px-4 py-2 ${isOpen?'text-white':''}`}>
            {isOpen?'✕':'☰'}
        </button>
        <div className={`fixed top-0 right-0 h-full w-64 bg-purple-900 border-purple-300 p-6 transform transition-transform duration-300 ease-in-out ${
            isOpen?'translate-x-0':'translate-x-full'
        }`}>
            <h3 className="text-xl font-semibold text-white mb-6">Menu</h3>
            <ul className="space-y-4 text-white text-lg">
                <li className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>Dashboard</li>
                <li className="cursor-pointer hover:underline" onClick={() => navigate('/public-rooms')}>Public Rooms</li>
                <li className="cursor-pointer hover:underline" onClick={() => navigate('/join-private')}>Join Private Rooms</li>
                <li className="cursor-pointer hover:underline" onClick={() => navigate('/statistics')}>Statistics</li>
                <li className="cursor-pointer hover:underline" onClick={logout}>Logout</li>
            </ul>
        </div>
        </>
        ):(
            <button onClick={() => navigate('auth')} className="fixed top-3 right-4 px-4 py-2 cursor-pointer bg-purple-500 text-white rounded">Login</button>
        )}
    </div>
  )
}

export default Navbar
