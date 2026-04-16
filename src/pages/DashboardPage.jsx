import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import Navbar from '../components/Navbar';
import { storage } from '../utils/storageUtils';

const DashboardPage = () => {
    const { user, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({ totalQuizzes: 0, averageScore: 0, recentResults: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Debug: Check if user is authenticated
        console.log('Dashboard - isAuthenticated:', isAuthenticated);
        console.log('Dashboard - user:', user);
        console.log('Dashboard - token exists:', !!storage.get('token'));
        
        if (isAuthenticated && user) {
            fetchDashboardData();
        }
    }, [isAuthenticated, user]);

    const fetchDashboardData = async () => {
        try {
            const response = await apiService.results.getUserResults();
            const userResults = response.data.data || [];
            
            setStats({
                totalQuizzes: userResults.length,
                averageScore: userResults.length > 0 
                    ? Math.round(userResults.reduce((sum, r) => sum + r.percentage, 0) / userResults.length)
                    : 0,
                recentResults: userResults.slice(0, 5)
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || !user) {
        return null; // Will redirect via PrivateRoute
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome back, {user.username}! 👋
                </h1>
                <p className="text-gray-600 mb-8">Track your quiz progress and performance</p>
                
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl mb-2">📚</div>
                        <div className="text-2xl font-bold text-indigo-600">{stats.totalQuizzes}</div>
                        <div className="text-gray-600">Quizzes Taken</div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl mb-2">📊</div>
                        <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
                        <div className="text-gray-600">Average Score</div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl mb-2">🏆</div>
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.recentResults.filter(r => r.percentage >= 60).length}
                        </div>
                        <div className="text-gray-600">Quizzes Passed</div>
                    </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="flex gap-4">
                        <Link to="/quizzes" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                            Browse Quizzes
                        </Link>
                        <Link to="/create-quiz" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                            Create Quiz
                        </Link>
                        <Link to="/results" className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
                            View Results
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;