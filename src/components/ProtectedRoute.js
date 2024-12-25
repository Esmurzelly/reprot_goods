import { getAuth } from 'firebase/auth';
import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const authUser = getAuth();

    const isLoggedUser = authUser.currentUser !== null;

    if(!isLoggedUser) return <Navigate to={'/login'} replace />

    return children
}

export default ProtectedRoute