import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api';
import toast from 'react-hot-toast';
import { storage } from '../utils/storageUtils';
import { getErrorMessage } from '../utils/errorUtils';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = storage.get('token');
            const savedUser = storage.get('user');

            if (token && savedUser) {
                try {
                    setUser(savedUser);
                    setIsAuthenticated(true);
                    await apiService.users.getProfile();
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const register = async (userData) => {
        try {
            const response = await apiService.users.register(userData);
            const { token, user: userInfo } = response.data;
            
            storage.set('token', token);
            storage.set('user', userInfo);
            
            setUser(userInfo);
            setIsAuthenticated(true);
            toast.success('Registration successful! Welcome aboard! 🎉');
            
            return { success: true };
        } catch (error) {
            toast.error(getErrorMessage(error));
            return { success: false, error: getErrorMessage(error) };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await apiService.users.login(credentials);
            const { token, user: userInfo } = response.data;
            
            storage.set('token', token);
            storage.set('user', userInfo);
            
            setUser(userInfo);
            setIsAuthenticated(true);
            toast.success(`Welcome back, ${userInfo.username}! 👋`);
            
            return { success: true };
        } catch (error) {
            toast.error(getErrorMessage(error));
            return { success: false, error: getErrorMessage(error) };
        }
    };

    const logout = () => {
        storage.remove('token');
        storage.remove('user');
        setUser(null);
        setIsAuthenticated(false);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};