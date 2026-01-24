import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal'; // Ensure you have this component
import { FaCheck, FaTimes, FaExternalLinkAlt, FaUserClock, FaHistory } from 'react-icons/fa';

const AdminInbox = () => {
    const [requests, setRequests] = useState([]);
    const [selectedReq, setSelectedReq] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/profile-requests');
            setRequests(res.data);
        } catch (e) { console.error("Failed to load requests"); }
        finally { setIsLoading(false); }
    };

    const handleAction = async (status) => {
        if(!selectedReq) return;
        if(!confirm(`Are you sure you want to mark this as ${status.toUpperCase()}?`)) return;

        try {
            await api.put(`/profile-requests/${selectedReq.id}`, { 
                status, 
                admin_note: adminNote 
            });
            
            // Refresh list and close modal
            fetchRequests();
            setSelectedReq(null);
            setAdminNote('');
        } catch (e) { alert("Failed to update status"); }
    };

    // Helper to format database keys (e.g., "first_name" -> "First Name")
    const formatKey = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaUserClock className="text-railway-green" /> Admin Inbox
            </h1>
            
            <Card>
                <CardHeader title="Profile Update Requests" subtitle="Review and approve employee data changes" />
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Employee</th>
                                <th className="px-6 py-3">Request Type</th>
                                <th className="px-6 py-3">Submitted On</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center py-8">Loading requests...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No requests found.</td></tr>
                            ) : requests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {req.employee?.first_name} {req.employee?.last_name}
                                        <div className="text-xs text-gray-400 font-normal">{req.employee?.designation}</div>
                                    </td>
                                    <td className="px-6 py-4">{req.request_type}</td>
                                    <td className="px-6 py-4">{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <Badge type={req.status === 'pending' ? 'warning' : req.status === 'approved' ? 'success' : 'danger'}>
                                            {req.status.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => { setSelectedReq(req); setAdminNote(req.admin_note || ''); }} 
                                            className="text-railway-green hover:bg-green-50 px-3 py-1 rounded-md transition font-medium border border-transparent hover:border-green-200"
                                        >
                                            {req.status === 'pending' ? 'Review' : 'View Details'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* --- REVIEW MODAL --- */}
            <Modal isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} title={selectedReq?.status === 'pending' ? "Review Request" : "Request Details"}>
                {selectedReq && (
                    <div className="space-y-6">
                        {/* 1. Employee Summary Header */}
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-railway-green text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                    {selectedReq.employee?.first_name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedReq.employee?.first_name} {selectedReq.employee?.last_name}</h4>
                                    <p className="text-xs text-gray-500 font-mono">{selectedReq.employee?.nid_number}</p>
                                </div>
                            </div>
                            
                            {/* LINK TO BIO */}
                            <a 
                                href={`/employees/${selectedReq.employee_id}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 text-railway-green text-sm font-bold hover:underline bg-white px-3 py-1.5 rounded border border-green-100 shadow-sm"
                            >
                                <FaExternalLinkAlt size={12} /> Open Bio
                            </a>
                        </div>

                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-100">
                            <span className="font-bold text-blue-800">Request Reason: </span> 
                            {selectedReq.details || "No details provided."}
                        </div>

                        {/* 2. Changes Table */}
                        {selectedReq.proposed_changes && (
                            <div>
                                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 ml-1">Proposed Data Changes</h5>
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-600 font-semibold border-b">
                                            <tr>
                                                <th className="px-4 py-2 border-r w-1/3">Field Name</th>
                                                <th className="px-4 py-2">New Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 bg-white">
                                            {Object.entries(selectedReq.proposed_changes).map(([key, value]) => {
                                                if (!value) return null; // Skip empty fields
                                                return (
                                                    <tr key={key}>
                                                        <td className="px-4 py-3 border-r bg-gray-50 font-medium text-gray-600">
                                                            {formatKey(key)}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-900 font-bold">
                                                            {value}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 3. Proof Attachment */}
                        {selectedReq.attachment && (
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-bold text-gray-700">Attachment:</span>
                                <a 
                                    href={`http://127.0.0.1:8000/storage/${selectedReq.attachment}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    View Proof Document
                                </a>
                            </div>
                        )}

                        {/* 4. Action Area (Conditional) */}
                        <div className="border-t pt-4 mt-2">
                            {selectedReq.status === 'pending' ? (
                                <div className="space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Admin Note (Required for Rejection)</label>
                                        <textarea 
                                            className="w-full border-gray-300 rounded-lg focus:ring-railway-green focus:border-railway-green text-sm"
                                            rows="2"
                                            placeholder="e.g. Approved based on NID verification..."
                                            value={adminNote}
                                            onChange={e => setAdminNote(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleAction('approved')} 
                                            className="flex-1 bg-railway-green text-white py-2.5 rounded-lg font-bold hover:bg-railway-dark transition flex justify-center items-center gap-2 shadow-sm"
                                        >
                                            <FaCheck /> Approve & Update
                                        </button>
                                        <button 
                                            onClick={() => handleAction('rejected')} 
                                            className="flex-1 bg-white text-red-600 border border-red-200 py-2.5 rounded-lg font-bold hover:bg-red-50 transition flex justify-center items-center gap-2 shadow-sm"
                                        >
                                            <FaTimes /> Reject Request
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* VIEW ONLY MODE */
                                <div className={`p-4 rounded-lg border flex items-center gap-3 ${selectedReq.status === 'approved' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className={`p-2 rounded-full ${selectedReq.status === 'approved' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                                        <FaHistory />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 uppercase text-xs tracking-wide">Request Finalized</p>
                                        <p className="text-sm font-bold text-gray-900">
                                            Marked as {selectedReq.status.toUpperCase()}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">
                                            <span className="font-semibold">Note:</span> {selectedReq.admin_note || "No note provided."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminInbox;