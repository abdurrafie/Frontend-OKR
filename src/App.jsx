import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Navbar } from './pages/Navbar';
import { NavbarAT } from './pages/NavbarAT';
import { InputProfile } from './pages/InputProfile';
import { OKR } from './pages/OKR';
import { Dashboard } from './pages/Dashboard';
import { Objective } from './pages/Objective';
import { Divisi } from './pages/Divisi';
import { User } from './pages/User';
import { Approving } from './pages/Approving';
import { KeyResult } from './pages/KeyResult';


function App() {

  return (
    <>
    <Navbar/>
    <NavbarAT/>
      <Routes>
        <Route path='/' Component={Login}/>
        <Route path='/OKR' Component={OKR}/>
        <Route path='/Divisi' Component={Divisi}/>
        <Route path='/Approving' Component={Approving}/>
        <Route path='/User' Component={User}/>
        <Route path='/Dashboard' Component={Dashboard}/>
        <Route path='/Profile' Component={Profile}/>
        <Route path='/InputProfile' Component={InputProfile}/>
        <Route path='/Register' Component={Register}/>

        <Route path="/Objective/:id" element={<Objective/>} />
        <Route path="/KeyResult/:id" element={<KeyResult/>} />


      </Routes>
    </>
  )
}

export default App
