import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaTrain } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', { email, password });
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            const role = response.data.user.role;
            navigate(role === 'verified_user' ? '/portal' : '/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-railway-green">
                <div className="text-center mb-8">
                    <div className="bg-railway-green/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTrain className="text-3xl text-railway-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Railway ERP</h2>
                    <p className="text-gray-500 text-sm">Official Employee Management System</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-railway-green focus:border-railway-green outline-none transition"
                            placeholder="admin@railway.gov.bd"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-railway-green focus:border-railway-green outline-none transition"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-railway-green hover:bg-railway-dark text-white font-bold py-2.5 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400">© 2026 Bangladesh Railway. Restricted Access.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;