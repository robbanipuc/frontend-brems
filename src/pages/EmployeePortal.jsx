import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaMapMarkerAlt, FaHistory, FaEdit, FaEnvelope, FaIdCard, FaExchangeAlt } from 'react-icons/fa';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Preloader from '../components/ui/Preloader';

const EmployeePortal = () => {
    const [employee, setEmployee] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return navigate('/login');
            
            try {
                const empRes = await api.get(`/employees/${user.employee_id}`);
                setEmployee(empRes.data);

                const reqRes = await api.get('/profile-requests'); 
                const myReqs = reqRes.data.filter(r => r.employee_id === user.employee_id);
                setRequests(myReqs);
            } catch(e) { console.error(e); } 
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const getPhotoUrl = (path) => path ? `http://127.0.0.1:8000/storage/${path}` : null;

    if (loading) return <Preloader />;

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">My Portal</h1>
                <button onClick={() => navigate('/profile/edit')} className="bg-white text-railway-green border border-railway-green px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-50 flex items-center gap-2 transition">
                    <FaEdit /> Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* --- LEFT SIDEBAR (My Profile) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="overflow-hidden border-t-4 border-railway-green">
                        <div className="p-6 text-center">
                            <div className="w-40 h-40 mx-auto bg-gray-100 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
                                {employee.profile_picture ? (
                                    <img src={getPhotoUrl(employee.profile_picture)} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">👤</div>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{employee.first_name} {employee.last_name}</h2>
                            <p className="text-railway-green font-bold">{employee.designation}</p>
                            <div className="mt-2 flex justify-center">
                                <Badge type="success">Active</Badge>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 border-t border-gray-100 space-y-4">
                            <div className="flex items-center text-gray-600">
                                <FaIdCard className="w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">National ID</p>
                                    <p className="text-sm font-medium">{employee.nid_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaMapMarkerAlt className="w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Office</p>
                                    <p className="text-sm font-medium">{employee.office?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaPhone className="w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Phone</p>
                                    <p className="text-sm font-medium">{employee.phone || 'N/A'}</p>
                                </div>
                            </div>
                             <div className="flex items-center text-gray-600">
                                <FaEnvelope className="w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Address</p>
                                    <p className="text-sm font-medium">{employee.address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* --- RIGHT MAIN CONTENT --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* 1. Request History */}
                    <Card>
                         <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800 flex items-center gap-2">
                            <FaHistory className="text-railway-green" /> Profile Update Requests
                        </div>
                        <div className="p-4 space-y-3">
                            {requests.length > 0 ? requests.map(r => (
                                <div key={r.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{r.request_type}</p>
                                        <p className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge type={r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'danger' : 'warning'}>
                                            {r.status.toUpperCase()}
                                        </Badge>
                                        {r.admin_note && <p className="text-xs text-gray-500 mt-1">{r.admin_note}</p>}
                                    </div>
                                </div>
                            )) : <p className="text-gray-400 text-sm text-center py-4">No pending requests.</p>}
                        </div>
                    </Card>

                    {/* 2. Transfer History Timeline */}
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-800 flex items-center gap-2">
                            <FaExchangeAlt className="text-railway-green" /> Transfer History
                        </div>
                        <div className="p-6">
                            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pl-6 py-2">
                                {/* Current */}
                                <div className="relative">
                                    <span className="absolute -left-[31px] bg-railway-green h-4 w-4 rounded-full border-2 border-white shadow"></span>
                                    <h4 className="font-bold text-sm text-gray-800">Current Station: {employee.office?.name}</h4>
                                    <p className="text-xs text-gray-500">Active</p>
                                </div>

                                {/* Past Transfers */}
                                {employee.transfers && employee.transfers.map(t => (
                                    <div key={t.id} className="relative">
                                        <span className="absolute -left-[31px] bg-gray-300 h-3 w-3 rounded-full border-2 border-white"></span>
                                        <h4 className="font-bold text-sm text-gray-700">Transferred from {t.from_office?.name}</h4>
                                        <p className="text-xs text-gray-500">Date: {t.transfer_date}</p>
                                    </div>
                                ))}
                                
                                {/* Start */}
                                <div className="relative">
                                    <span className="absolute -left-[31px] bg-gray-300 h-3 w-3 rounded-full border-2 border-white"></span>
                                    <h4 className="font-bold text-sm text-gray-700">Joined Railway</h4>
                                    <p className="text-xs text-gray-400">{new Date(employee.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EmployeePortal;