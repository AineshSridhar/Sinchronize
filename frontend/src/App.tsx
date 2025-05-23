import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CreateStudyRoom from './pages/CreateStudyRoom'
import RoomDetails from './pages/RoomDetails'
import PublicRooms from './pages/publicRooms'
import JoinPrivate from './pages/JoinPrivate'
import LandingPage from './pages/LandingPage'
import BackgroundTriangles from "./components/BackgroundTriangles";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/auth";
  const isAuthPage = location.pathname === "/auth";

  return (
    <>
      {!hideNavbar && <Navbar/>}
      {!isAuthPage && <BackgroundTriangles />}

      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/add" element={<CreateStudyRoom/>}/>
        <Route path = "/auth" element = {<Auth/>}/>
        <Route path = "/rooms/:id" element = {<RoomDetails />}/>
        <Route path = "/public-rooms" element = {<PublicRooms/>}/>
        <Route path = "/join-private" element = {<JoinPrivate/>}/>
      </Routes>
    </>
  )
}

export default App
