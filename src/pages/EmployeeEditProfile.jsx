import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { FaSave, FaArrowLeft, FaFileUpload, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmployeeEditProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    // Form Data
    const [form, setForm] = useState({ first_name: '', last_name: '', phone: '', address: '' });
    const [proof, setProof] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    
    // Loading States
    const [loading, setLoading] = useState(false);
    const [photoLoading, setPhotoLoading] = useState(false);

    // Fetch Current Data on Load
    useEffect(() => {
        const fetchProfile = async () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
            
            try {
                const res = await api.get(`/employees/${userData.employee_id}`);
                setForm({
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                    phone: res.data.phone || '',
                    address: res.data.address || ''
                });
                setCurrentPhoto(res.data.profile_picture);
            } catch(e) { console.error(e); }
        };
        fetchProfile();
    }, []);

    // 1. Handle Photo Upload (Direct Update)
    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPhotoLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Ensure this endpoint exists in your backend route list
            const res = await api.post(`/employees/${user.employee_id}/photo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Update UI immediately
            setCurrentPhoto(res.data.path);
            alert("Profile Picture Updated Successfully!");
        } catch (e) {
            alert("Failed to upload photo. Ensure it is an image under 2MB.");
        } finally {
            setPhotoLoading(false);
        }
    };

    // 2. Handle Text Data (Request System)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData();
        // We send changes as a JSON string so the Controller can store it easily
        formData.append('changes', JSON.stringify(form));
        formData.append('request_type', 'Profile Update');
        formData.append('details', 'Employee requested profile update via portal.');
        
        if (proof) {
            formData.append('attachment', proof);
        }

        try {
            await api.post('/profile-requests', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Profile Update Request Submitted! Waiting for Admin Approval.");
            navigate('/portal');
        } catch (e) {
            alert("Failed to submit request.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getPhotoUrl = (path) => path ? `http://127.0.0.1:8000/storage/${path}` : null;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">
            {/* Back Button */}
            <button onClick={() => navigate('/portal')} className="flex items-center text-gray-500 hover:text-railway-green font-medium transition">
                <FaArrowLeft className="mr-2" /> Back to Portal
            </button>

            <Card>
                <CardHeader title="Edit Profile" subtitle="Update your photo and personal details" />
                <CardBody>
                    
                    {/* --- 1. PHOTO UPLOAD SECTION --- */}
                    <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                                {currentPhoto ? (
                                    <img src={getPhotoUrl(currentPhoto)} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">👤</div>
                                )}
                                
                                {/* Loading Overlay */}
                                {photoLoading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                                        <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Camera Button */}
                            <label className="absolute bottom-0 right-0 bg-railway-green text-white p-2.5 rounded-full shadow-md cursor-pointer hover:bg-railway-dark transition transform hover:scale-105">
                                <FaCamera size={16} />
                                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Click camera icon to change photo (Max 2MB)</p>
                    </div>

                    {/* --- 2. TEXT DATA FORM --- */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                                <input className="w-full" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                                <input className="w-full" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                            <input className="w-full" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Present Address</label>
                            <textarea className="w-full" rows="3" value={form.address} onChange={e => setForm({...form, address: e.target.value})}></textarea>
                        </div>

                        {/* Document Proof Section */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <label className="block text-sm font-bold text-blue-900 mb-2">Supporting Document (Optional)</label>
                            <p className="text-xs text-blue-600 mb-3">If changing Name, please upload NID or relevant doc.</p>
                            
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition flex items-center gap-2 shadow-sm">
                                    <FaFileUpload /> {proof ? proof.name : "Choose File..."}
                                    <input type="file" hidden onChange={e => setProof(e.target.files[0])} accept="application/pdf,image/*" />
                                </label>
                                {proof && <span className="text-xs text-green-600 font-bold">File Selected</span>}
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-railway-green text-white py-3 rounded-lg font-bold text-lg hover:bg-railway-dark transition shadow-md disabled:opacity-70 flex justify-center items-center gap-2">
                            {loading ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FaSave /> Submit Update Request
                                </>
                            )}
                        </button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default EmployeeEditProfile;