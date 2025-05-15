import './App.css'
import { Route, Routes } from 'react-router-dom'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CreateStudyRoom from './pages/CreateStudyRoom'


function App() {

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/add" element={<CreateStudyRoom/>}/>
      <Route path = "/auth" element = {<Auth/>}/>
    </Routes>
  )
}

export default App
