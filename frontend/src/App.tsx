import './App.css'
import { Route, Routes } from 'react-router-dom'
import RoomsList from './components/RoomsList'
import AddRoom from './components/AddRoom'
import Auth from './pages/Auth'


function App() {

  return (
    <Routes>
      <Route path="/das" element={<RoomsList/>}/>
      <Route path="/" element={<AddRoom/>}/>
      <Route path = "/auth" element = {<Auth/>}/>
    </Routes>
  )
}

export default App
