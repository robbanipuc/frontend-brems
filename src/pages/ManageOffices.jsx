import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { FaPlus, FaEdit, FaSearch } from 'react-icons/fa';

const ManageOffices = () => {
    const [offices, setOffices] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    
    // Filters
    const [search, setSearch] = useState('');
    const [parentFilter, setParentFilter] = useState('');
    
    // Edit State
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ name: '', code: '', location: '', parent_id: '' });

    useEffect(() => { fetchOffices(); }, []);

    const fetchOffices = async () => {
        try {
            const res = await api.get('/offices');
            setOffices(res.data);
            setFiltered(res.data);
        } catch (e) { console.error("API Error"); }
    };

    useEffect(() => {
        let res = offices;
        if(search) res = res.filter(o => o.name.toLowerCase().includes(search.toLowerCase()) || o.code.toLowerCase().includes(search.toLowerCase()));
        if(parentFilter) res = res.filter(o => o.parent_id === parseInt(parentFilter));
        setFiltered(res);
    }, [search, parentFilter, offices]);

    const openEdit = (office) => {
        setForm({ name: office.name, code: office.code, location: office.location, parent_id: office.parent_id || '' });
        setIsEdit(true);
        setEditId(office.id);
        setModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(isEdit) await api.put(`/offices/${editId}`, form);
            else await api.post('/offices', form);
            
            setModalOpen(false);
            fetchOffices(); // Refresh list
            setForm({ name: '', code: '', location: '', parent_id: '' });
        } catch (e) { alert("Operation Failed"); }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Offices & Stations</h1>
                <button onClick={() => { setIsEdit(false); setForm({ name: '', code: '', location: '', parent_id: '' }); setModalOpen(true); }} className="bg-railway-green text-white px-4 py-2 rounded-lg flex gap-2 font-bold shadow-sm hover:bg-railway-dark">
                    <FaPlus /> Add Office
                </button>
            </div>

            <Card>
                <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="relative w-64">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            className="pl-10 w-full" 
                            placeholder="Search Station..." 
                            value={search} 
                            onChange={e => setSearch(e.target.value)} 
                        />
                    </div>
                    
                    {/* Parent Filter - FIXED: Shows ALL offices now */}
                    <select 
                        className="w-64 bg-white" 
                        value={parentFilter} 
                        onChange={e => setParentFilter(e.target.value)}
                    >
                        {/* This is the first option */}
                        <option value="">All Zones/Parents</option> 
                        
                        {/* Then map the rest */}
                        {offices.map(o => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-xs uppercase font-bold text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Code</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Location</th>
                                <th className="px-6 py-3">Parent Office</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.map(o => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-mono font-bold text-gray-500">{o.code}</td>
                                    <td className="px-6 py-3 font-bold text-gray-800">{o.name}</td>
                                    <td className="px-6 py-3">{o.location}</td>
                                    <td className="px-6 py-3 text-gray-500">{o.parent ? o.parent.name : '-'}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button onClick={() => openEdit(o)} className="text-blue-600 hover:bg-blue-50 p-2 rounded transition">
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={isEdit ? "Edit Office" : "Add Office"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Office Name</label>
                        <input className="w-full" name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Code</label>
                             <input className="w-full" name="code" value={form.code} onChange={e => setForm({...form, code: e.target.value})} required />
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                             <input className="w-full" name="location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Parent Office</label>
                        <select className="w-full bg-white" name="parent_id" value={form.parent_id} onChange={e => setForm({...form, parent_id: e.target.value})}>
                            <option value="">None (Top Level)</option>
                            {/* Prevent selecting itself as parent to avoid infinite loop */}
                            {offices.filter(o => o.id !== editId).map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-railway-green text-white py-2 rounded-lg font-bold hover:bg-railway-dark transition">
                        {isEdit ? 'Update Office' : 'Create Office'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ManageOffices;