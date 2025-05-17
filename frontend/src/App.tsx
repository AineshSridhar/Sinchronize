import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CreateStudyRoom from './pages/CreateStudyRoom'
import RoomDetails from './pages/RoomDetails'
import PublicRooms from './pages/publicRooms'


function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";

  return (
    <>
      {!hideNavbar && <Navbar/>}
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/add" element={<CreateStudyRoom/>}/>
        <Route path = "/auth" element = {<Auth/>}/>
        <Route path = "/rooms/:id" element = {<RoomDetails />}/>
        <Route path = "/public-rooms" element = {<PublicRooms/>}/>
      </Routes>
    </>
  )
}

export default App
