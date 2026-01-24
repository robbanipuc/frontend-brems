import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaUserShield, FaExchangeAlt, FaLevelUpAlt, FaTrash, FaKey, FaArrowLeft, FaPhone, FaMapMarkerAlt, FaEnvelope, FaIdCard, FaUserCheck, FaBriefcase, FaExclamationTriangle } from 'react-icons/fa';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import Preloader from '../components/ui/Preloader';

const EmployeeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Data & UI States
    const [emp, setEmp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('transfer'); 

    // Dropdown Data
    const [offices, setOffices] = useState([]);
    const [designations, setDesignations] = useState([]);

    // Modal States
    const [modalType, setModalType] = useState(null);
    const [transferForm, setTransferForm] = useState({ target_office_id: '', transfer_date: '', order_number: '' });
    const [promoForm, setPromoForm] = useState({ new_designation: '', new_salary: '', promotion_date: '' });
    const [loginEmail, setLoginEmail] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eRes, oRes, dRes] = await Promise.all([
                    api.get(`/employees/${id}`),
                    api.get('/offices'),
                    api.get('/designations')
                ]);
                setEmp(eRes.data);
                setOffices(oRes.data);
                setDesignations(dRes.data);
            } catch (e) { alert("Error loading data"); navigate('/employees'); }
            finally { setLoading(false); }
        };
        loadData();
    }, [id]);

    // --- ACTIONS ---

    const handleVerify = async () => {
        if(confirm(`Confirm identity verification for ${emp.first_name} ${emp.last_name}?`)) {
            try {
                await api.put(`/employees/${id}/verify`);
                alert("Employee Verified Successfully!");
                window.location.reload();
            } catch(e) { alert("Verification Failed"); }
        }
    };

    const handleDelete = async () => {
        if(confirm(`⚠️ WARNING: Are you sure you want to delete ${emp.first_name}? This action is irreversible.`)) {
            try {
                await api.delete(`/employees/${id}`);
                alert("Profile Deleted.");
                navigate('/employees');
            } catch(e) { alert(e.response?.data?.message || "Delete failed"); }
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/employees/${id}/transfer`, transferForm);
            alert("Transfer Successful!");
            window.location.reload();
        } catch(e) { alert("Transfer Failed"); }
    };

    const handlePromote = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/employees/${id}/promote`, promoForm);
            alert("Promotion Successful!");
            window.location.reload();
        } catch(e) { alert("Promotion Failed"); }
    };

    const handleCreateLogin = async () => {
        try {
            const res = await api.post(`/employees/${id}/create-login`, { email: loginEmail });
            alert(`Credentials Generated!\n\nEmail: ${res.data.email}\nDefault Password: 123456`);
            setModalType(null);
        } catch(e) { alert(e.response?.data?.message || "Failed"); }
    };

    const getPhotoUrl = (path) => path ? `http://127.0.0.1:8000/storage/${path}` : null;

    if (loading) return <Preloader />;

    return (
        <div className="space-y-6">
            {/* Top Navigation */}
            <div className="flex justify-between items-center">
                <button onClick={() => navigate('/employees')} className="flex items-center text-gray-500 hover:text-railway-green font-medium transition">
                    <FaArrowLeft className="mr-2" /> Back to Directory
                </button>
                <div className="text-sm text-gray-400">Employee ID: {emp.id}</div>
            </div>

            {/* UNVERIFIED WARNING BANNER */}
            {!emp.is_verified && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex justify-between items-center shadow-sm rounded-r-lg">
                    <div className="flex items-center">
                        <FaExclamationTriangle className="text-yellow-500 mr-3 text-xl" />
                        <div>
                            <p className="text-sm font-bold text-yellow-800">Unverified Employee</p>
                            <p className="text-xs text-yellow-600">This profile has not been verified by HR/Admin yet.</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleVerify}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition"
                    >
                        <FaUserCheck /> Verify Identity
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* --- LEFT SIDEBAR (Profile Info) --- */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className={`overflow-hidden border-t-4 ${emp.is_verified ? 'border-railway-green' : 'border-yellow-400'}`}>
                        <div className="p-6 text-center">
                            <div className="w-40 h-40 mx-auto bg-gray-100 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4 relative">
                                {emp.profile_picture ? (
                                    <img src={getPhotoUrl(emp.profile_picture)} className="w-full h-full object-cover"/>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">👤</div>
                                )}
                                {!emp.is_verified && (
                                    <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                                        <FaExclamationTriangle className="text-white text-4xl drop-shadow-md" />
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{emp.first_name} {emp.last_name}</h2>
                            <p className="text-railway-green font-bold">{emp.designation}</p>
                            
                            <div className="mt-2 flex justify-center gap-2">
                                {emp.is_verified ? (
                                    <Badge type="success">Verified</Badge>
                                ) : (
                                    <Badge type="warning">Unverified</Badge>
                                )}
                                <Badge type={emp.status === 'active' ? 'success' : 'danger'}>{emp.status.toUpperCase()}</Badge>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 border-t border-gray-100 space-y-4">
                            <div className="flex items-center text-gray-600">
                                <FaIdCard className="w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">National ID</p>
                                    <p className="text-sm font-medium">{emp.nid_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaMapMarkerAlt className="w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Current Station</p>
                                    <p className="text-sm font-medium">{emp.office?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaPhone className="w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Phone</p>
                                    <p className="text-sm font-medium">{emp.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaEnvelope className="w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Address</p>
                                    <p className="text-sm font-medium">{emp.address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-gray-100">
                            <button onClick={handleDelete} className="w-full py-2 text-red-600 font-bold hover:bg-red-50 rounded transition text-sm flex items-center justify-center gap-2">
                                <FaTrash /> Delete Profile
                            </button>
                        </div>
                    </Card>
                </div>

                {/* --- RIGHT MAIN CONTENT --- */}
                <div className="lg:col-span-8 space-y-6">
                    
                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button onClick={() => setModalType('login')} disabled={!emp.is_verified} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-railway-green hover:shadow-md transition text-left group disabled:opacity-50 disabled:cursor-not-allowed">
                            <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-slate-600 mb-3 group-hover:bg-railway-green group-hover:text-white transition">
                                <FaKey />
                            </div>
                            <h3 className="font-bold text-gray-800">Portal Access</h3>
                            <p className="text-xs text-gray-500 mt-1">Generate login key</p>
                        </button>
                        
                        <button onClick={() => setModalType('transfer')} disabled={!emp.is_verified} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-railway-green hover:shadow-md transition text-left group disabled:opacity-50 disabled:cursor-not-allowed">
                            <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:bg-blue-600 group-hover:text-white transition">
                                <FaExchangeAlt />
                            </div>
                            <h3 className="font-bold text-gray-800">Transfer</h3>
                            <p className="text-xs text-gray-500 mt-1">Change station</p>
                        </button>

                        <button onClick={() => setModalType('promote')} disabled={!emp.is_verified} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-railway-green hover:shadow-md transition text-left group disabled:opacity-50 disabled:cursor-not-allowed">
                            <div className="bg-green-50 w-10 h-10 rounded-full flex items-center justify-center text-green-600 mb-3 group-hover:bg-green-600 group-hover:text-white transition">
                                <FaLevelUpAlt />
                            </div>
                            <h3 className="font-bold text-gray-800">Promote</h3>
                            <p className="text-xs text-gray-500 mt-1">Update rank & salary</p>
                        </button>
                    </div>

                    {/* History Tabs (Same as before) */}
                    <Card className="min-h-[400px]">
                        <div className="flex border-b border-gray-200">
                            <button 
                                onClick={() => setActiveTab('transfer')}
                                className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition ${activeTab === 'transfer' ? 'border-railway-green text-railway-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                <FaExchangeAlt className="inline mr-2"/> Transfer History
                            </button>
                            <button 
                                onClick={() => setActiveTab('promotion')}
                                className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition ${activeTab === 'promotion' ? 'border-railway-green text-railway-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                <FaLevelUpAlt className="inline mr-2"/> Promotion History
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {/* Transfer Content */}
                            {activeTab === 'transfer' && (
                                <div className="space-y-4">
                                    {emp.transfers && emp.transfers.length > 0 ? emp.transfers.map((t, idx) => (
                                        <div key={t.id} className="flex gap-4 relative">
                                            {idx !== emp.transfers.length - 1 && <div className="absolute left-[15px] top-8 bottom-[-16px] w-0.5 bg-gray-200"></div>}
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 z-10"><FaExchangeAlt size={12} /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">Transferred to {t.to_office?.name}</h4>
                                                <p className="text-xs text-gray-500">{t.transfer_date}</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-gray-400 text-center py-10">No transfer history.</p>}
                                </div>
                            )}

                            {/* Promotion Content */}
                            {activeTab === 'promotion' && (
                                <div className="space-y-4">
                                    {emp.promotions && emp.promotions.length > 0 ? emp.promotions.map((p, idx) => (
                                        <div key={p.id} className="flex gap-4 relative">
                                            {idx !== emp.promotions.length - 1 && <div className="absolute left-[15px] top-8 bottom-[-16px] w-0.5 bg-gray-200"></div>}
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 z-10"><FaLevelUpAlt size={12} /></div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-sm">Promoted to {p.new_designation}</h4>
                                                <p className="text-xs text-gray-500">{p.promotion_date}</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-gray-400 text-center py-10">No promotion history.</p>}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* --- MODALS --- */}
            <Modal isOpen={modalType === 'login'} onClose={() => setModalType(null)} title="Generate Access Key">
                <div className="space-y-4">
                    <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Official Email" className="w-full" />
                    <button onClick={handleCreateLogin} className="w-full bg-slate-800 text-white py-2 rounded font-bold">Generate</button>
                </div>
            </Modal>
            
            <Modal isOpen={modalType === 'transfer'} onClose={() => setModalType(null)} title="Transfer Employee">
                 <form onSubmit={handleTransfer} className="space-y-4">
                    <select className="w-full" value={transferForm.target_office_id} onChange={e => setTransferForm({...transferForm, target_office_id: e.target.value})} required>
                        <option value="">Select Target Station...</option>
                        {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <input type="date" className="w-full" onChange={e => setTransferForm({...transferForm, transfer_date: e.target.value})} required />
                    <input type="text" placeholder="Order Number" className="w-full" onChange={e => setTransferForm({...transferForm, order_number: e.target.value})} required />
                    <button className="w-full bg-railway-green text-white py-2 rounded font-bold">Confirm Transfer</button>
                 </form>
            </Modal>

            <Modal isOpen={modalType === 'promote'} onClose={() => setModalType(null)} title="Promote Employee">
                 <form onSubmit={handlePromote} className="space-y-4">
                    <select className="w-full" onChange={e => { const d = designations.find(x=>x.title===e.target.value); setPromoForm({...promoForm, new_designation: d.title, new_salary: d.basic_salary})}} required>
                        <option value="">Select New Designation...</option>
                        {designations.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                    </select>
                    <input type="number" placeholder="New Salary" className="w-full" value={promoForm.new_salary} onChange={e => setPromoForm({...promoForm, new_salary: e.target.value})} required />
                    <input type="date" className="w-full" onChange={e => setPromoForm({...promoForm, promotion_date: e.target.value})} required />
                    <button className="w-full bg-railway-green text-white py-2 rounded font-bold">Approve Promotion</button>
                 </form>
            </Modal>
        </div>
    );
};

export default EmployeeDetails;