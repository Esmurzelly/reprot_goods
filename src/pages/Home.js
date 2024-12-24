import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useNavigate, NavLink } from 'react-router-dom';
import AddItemPopup from '../components/AddStoreItemPopup'
import Loader from '../components/Loader';

const Home = () => {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate('/login');
            console.log("Signed out successfully");
        }).catch(error => {
            console.log('error from logging out', error)
        })
    }

    useEffect(() => {
        try {
            setLoading(true);
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    // const uid = user.uid;
                    // console.log('uid from Home page', uid);
                    setUserData(user)
                } else {
                    console.log('user is logged out');
                    setLoading(false);
                }
            })
            setLoading(false);

        } catch (error) {
            console.log('user Error');
        }

    }, []);

    console.log('userData', userData);

    if (loading) {
        return (
            <div className='w-full min-h-screen bg-slate-300'>
                <Loader />
            </div>
        )
    }

    return (
        <>
            <h1>Home</h1>
            <p>Email: {userData?.email}</p>
            <AddItemPopup />

            <div className='my-9'>
                <NavLink to={'/store'} className={'border bg-green-600 text-black'}>Store</NavLink>
                <NavLink to={'/sells'} className={'border bg-green-600 text-black'}>Sells</NavLink>
            </div>

            {/* tableComponent */}

            {userData ? <button onClick={handleLogout}>Log out</button> : <NavLink to={'/login'}>Login</NavLink>}

        </>
    )
}

export default Home