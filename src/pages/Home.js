import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase';
import { useNavigate, NavLink } from 'react-router-dom';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import userAvatar from '../assets/user.png'

const Home = () => {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate('/login');
            toast("Signed out successfully");
        }).catch(error => {
            toast.error('error from logging out', error)
        })
    }

    useEffect(() => {
        try {
            setLoading(true);
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserData(user)
                } else {
                    toast('user is not found');
                    setLoading(false);
                }
            })
            setLoading(false);

        } catch (error) {
            toast.error('user Error');
        }

    }, []);

    if (loading) {
        return (
            <div className='w-full min-h-screen bg-slate-300'>
                <Loader />
            </div>
        )
    }

    return (
        <div className='mt-8'>
            <div className='flex flex-row items-start justify-between'>
                <img className='w-12' src={userAvatar} alt="Аватарка" />
                <p>Ваш email: <span className='font-medium'>{userData?.email}</span></p>
            </div>

            <div className='my-9 flex flex-col items-start gap-2'>
                <NavLink to={'/store'} className={'p-3 w-60 bg-green-600 text-white'}>Склад</NavLink>
                <NavLink to={'/sells'} className={'p-3 w-60 bg-green-600 text-white'}>Продажи</NavLink>
            </div>

            {userData ? <button className='p-2 mt-7 text-left rounded-lg bg-red-600 text-sm text-white' onClick={handleLogout}>Выйти из аккаунта</button> : <NavLink className='p-2 mt-7 text-left rounded-lg bg-green-600 text-sm text-white' to={'/login'}>Войти</NavLink>}
        </div>
    )
}

export default Home