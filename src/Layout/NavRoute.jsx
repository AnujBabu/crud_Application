import React from 'react'
import SignIn from './SignIn';
import SignUp from './SignUp';
import HomePage from './HomePage';
import { Routes, Route,useNavigate } from 'react-router-dom';
const NavRoute = () => {
    const navigate=useNavigate()
    let storeEmail = localStorage.getItem("Email");
      let storePass = localStorage.getItem("Password");
           React.useEffect(() => {
        if (!storeEmail || !storePass) {
          navigate('/');
        }
      }, [])

    return (

        <div>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/homepage" element={<HomePage />} /> 
            </Routes>
        </div>
    )
}

export default NavRoute