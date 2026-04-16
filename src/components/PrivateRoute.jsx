import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isAuthenticated } from '../utils/authUtils';

const PrivateRoute = ({ children }) => {
    const { loading } = useAuth();
    const authenticated = isAuthenticated();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return authenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;