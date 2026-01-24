import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaUserCircle, FaSearch, FaTimes, FaExternalLinkAlt, FaCog, FaKey } from 'react-icons/fa';
import api from '../../utils/api';
import { Modal } from '../ui/Modal'; 
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState({ name: 'Admin', role: '' });
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const searchRef = useRef(null);
    const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) setUser(userData);
        
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) setResults([]);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async (e) => {
        const val = e.target.value;
        setQuery(val);
        if (val.length > 1) {
            try {
                // Ensure backend has: Route::get('/employees', [EmployeeController::class, 'index']);
                // And Controller handles ?search= parameter
                const res = await api.get(`/employees?search=${val}`);
                setResults(res.data);
            } catch (error) { console.error("Search API Error"); }
        } else {
            setResults([]);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if(passForm.new !== passForm.confirm) return alert("New passwords do not match");
        try {
            await api.post('/change-password', { 
                current_password: passForm.current, 
                new_password: passForm.new,
                new_password_confirmation: passForm.confirm 
            });
            alert("Password Changed Successfully");
            setSettingsOpen(false);
            setPassForm({ current: '', new: '', confirm: '' });
        } catch(e) { alert("Failed to change password."); }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm sticky top-0 z-40">
            {/* --- FIXED SEARCH BAR SECTION --- */}
            <div className="relative w-1/3" ref={searchRef}>
                <div className="relative group">
                    {/* ICON: Absolute positioned left */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                        <FaSearch className="text-gray-400 group-focus-within:text-railway-green" />
                    </div>
                    
                    {/* INPUT: Added pl-12 to push text to the right */}
                    <input 
                        type="text" 
                        className="block w-full pl-12 pr-10 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-railway-green focus:border-transparent transition text-sm shadow-sm" 
                        placeholder="Search Employee by Name or NID..." 
                        value={query}
                        onChange={handleSearch}
                        autoComplete="off"
                    />

                    {/* CLEAR BUTTON */}
                    {query && (
                        <button 
                            onClick={() => {setQuery(''); setResults([]);}} 
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500 cursor-pointer z-10"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* SEARCH DROPDOWN RESULTS */}
                {results.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase">
                            Found {results.length} Matches
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                            {results.map(emp => (
                                <div 
                                    key={emp.id} 
                                    onClick={() => {
                                        window.open(`/employees/${emp.id}`, '_blank');
                                        setResults([]); // Close dropdown after click
                                    }} 
                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 flex justify-between items-center group transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-railway-green text-white flex items-center justify-center text-xs font-bold">
                                            {emp.first_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-railway-green">{emp.first_name} {emp.last_name}</p>
                                            <p className="text-xs text-gray-500">{emp.designation}</p>
                                        </div>
                                    </div>
                                    <FaExternalLinkAlt className="text-gray-300 group-hover:text-railway-green text-xs" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* ------------------------------- */}

            {/* PROFILE & SETTINGS */}
            <div className="flex items-center gap-4">
                <button className="relative text-gray-400 hover:text-railway-green transition">
                    <FaBell className="text-xl" />
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-railway-red"></span>
                </button>

                <div className="h-8 w-px bg-gray-200"></div>

                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition" onClick={() => setSettingsOpen(true)}>
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-gray-800 leading-none">{user.name}</div>
                        <div className="text-xs text-gray-500 mt-1 capitalize">{user.role.replace('_', ' ')}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-railway-green text-white flex items-center justify-center border-2 border-green-100 shadow-sm">
                        <FaUserCircle className="text-2xl" />
                    </div>
                </div>
            </div>

            {/* SETTINGS MODAL */}
            <Modal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} title="Account Settings">
                <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start border border-blue-100">
                        <FaCog className="text-blue-600 mt-1" />
                        <div>
                            <h4 className="font-bold text-blue-900 text-sm">Account Info</h4>
                            <p className="text-xs text-blue-700 mt-1">
                                <strong>Role:</strong> {user.role}<br/>
                                <strong>Email:</strong> {user.email}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4 border-t pt-4">
                        <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2"><FaKey /> Change Password</h4>
                        <div>
                            <label className="text-xs font-bold text-gray-500">Current Password</label>
                            <input type="password" className="w-full mt-1" value={passForm.current} onChange={e => setPassForm({...passForm, current: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500">New Password</label>
                                <input type="password" className="w-full mt-1" value={passForm.new} onChange={e => setPassForm({...passForm, new: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Confirm New</label>
                                <input type="password" className="w-full mt-1" value={passForm.confirm} onChange={e => setPassForm({...passForm, confirm: e.target.value})} required />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-slate-900 transition">Update Password</button>
                    </form>
                </div>
            </Modal>
        </header>
    );
};

export default Navbar;