import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../Components/Hooks/useAuth';
import LoadingSpinner from '../Components/Design/LoadingSpinner/LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner progress={50} />;
    }

    if (user) {
        return children;
    }
    return <Navigate to="/login" state={{from: location}} replace></Navigate>
};

export default PrivateRoute;