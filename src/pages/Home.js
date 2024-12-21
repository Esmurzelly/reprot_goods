import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useNavigate, NavLink } from 'react-router-dom';

const Home = () => {
    const [userData, setUserData] = useState();
    const [abc, setAbc] = useState();
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate('/login');
            console.log("Signed out successfully");
        })
        .catch(error => {
            console.log('error from logging out', error)
        })
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                // const uid = user.uid;
                // console.log('uid from Home page', uid);
                setUserData(user)
            } else {
                console.log('user is logged out')
            }
        })
    }, []);

    console.log('userData', userData);

  return (
    <>
        <h1>Home</h1>

        {userData ? <button onClick={handleLogout}>Log out</button> : <NavLink to={'/login'}>Login</NavLink>}
        
    </>
  )
}

export default Home