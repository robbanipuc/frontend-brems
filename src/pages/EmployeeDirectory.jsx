import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { FaEye, FaSearch, FaFilter, FaUserPlus, FaIdCard, FaBuilding, FaLayerGroup, FaFileCsv, FaFilePdf, FaBriefcase } from 'react-icons/fa';

const EmployeeDirectory = () => {
    // Data States
    const [employees, setEmployees] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [offices, setOffices] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Add Employee Form State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [newEmp, setNewEmp] = useState({
        first_name: '', last_name: '', nid_number: '', designation_id: '', current_salary: '', office_id: ''      
    });

    // Filters
    const [search, setSearch] = useState('');
    const [officeFilter, setOfficeFilter] = useState('');
    const [designationFilter, setDesignationFilter] = useState(''); // <--- NEW STATE

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const navigate = useNavigate();

    // 1. Fetch All Data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [empRes, offRes, desRes] = await Promise.all([
                api.get('/employees'), 
                api.get('/offices'),
                api.get('/designations')
            ]);
            setEmployees(empRes.data);
            setFilteredData(empRes.data);
            setOffices(offRes.data);
            setDesignations(desRes.data);
        } catch (e) { console.error("Error loading data"); } 
        finally { setLoading(false); }
    };

    // 2. Handle Adding New Employee
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...newEmp,
            designation_id: parseInt(newEmp.designation_id),
            office_id: parseInt(newEmp.office_id),
            current_salary: parseFloat(newEmp.current_salary)
        };
        try {
            await api.post('/employees', payload);
            alert("✅ Employee Added Successfully!");
            setAddModalOpen(false);
            setNewEmp({ first_name: '', last_name: '', nid_number: '', designation_id: '', current_salary: '', office_id: '' });
            loadData(); 
        } catch (error) {
            alert(error.response?.data?.message || "Failed to add employee.");
        }
    };

    // 3. Filter Logic
    useEffect(() => {
        let result = employees;

        // Search
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(e => 
                e.first_name.toLowerCase().includes(lowerSearch) || 
                e.last_name.toLowerCase().includes(lowerSearch) ||
                e.nid_number.includes(lowerSearch) ||
                (e.designation?.title || '').toLowerCase().includes(lowerSearch)
            );
        }

        // Office Filter
        if (officeFilter) {
            result = result.filter(e => e.current_office_id == officeFilter);
        }

        // Designation Filter (NEW)
        if (designationFilter) {
            result = result.filter(e => e.designation_id == designationFilter);
        }

        setFilteredData(result);
        setCurrentPage(1); 
    }, [search, officeFilter, designationFilter, employees]);

    // 4. Export Function
    const handleExport = async (type) => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (officeFilter) params.append('office_id', officeFilter);
            if (designationFilter) params.append('designation_id', designationFilter); // <--- Add to Export

            const endpoint = type === 'csv' ? '/employees/export-csv' : '/employees/export-pdf';
            const response = await api.get(`${endpoint}?${params.toString()}`, { responseType: 'blob' });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `employees_export_${Date.now()}.${type}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Export failed. Please try again.");
        }
    };

    // Pagination Calculations
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#006A4E] flex items-center gap-2">
                        <FaLayerGroup /> Employee Directory
                    </h1>
                    <div className="text-sm text-gray-500 mt-1">
                        Total Records: <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">{filteredData.length}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleExport('csv')} className="bg-white border border-gray-300 text-green-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-green-50 flex items-center gap-2 shadow-sm transition-all">
                        <FaFileCsv /> CSV
                    </button>
                    <button onClick={() => handleExport('pdf')} className="bg-white border border-gray-300 text-red-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-red-50 flex items-center gap-2 shadow-sm transition-all">
                        <FaFilePdf /> PDF
                    </button>
                    <button onClick={() => setAddModalOpen(true)} className="bg-[#006A4E] text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-green-900/20 hover:bg-[#047857] transition flex items-center gap-2 active:scale-[0.98]">
                        <FaUserPlus /> New Employee
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <Card className="border-t-4 border-[#006A4E]">
                <div className="p-5 bg-gray-50 border-b border-gray-100 flex flex-col xl:flex-row gap-4 items-center justify-between">
                    
                    {/* Search */}
                    <div className="relative w-full xl:w-96 text-gray-500 focus-within:text-[#006A4E]">
                        <FaSearch className="absolute left-3 top-3" />
                        <input 
                            className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] text-sm bg-white shadow-sm" 
                            placeholder="Search Name, NID..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-end">
                        {/* Office Filter */}
                        <div className="relative w-full md:w-48">
                            <FaFilter className="absolute left-3 top-3 text-gray-400 z-10" />
                            <select 
                                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] text-sm bg-white shadow-sm cursor-pointer"
                                value={officeFilter} 
                                onChange={e => setOfficeFilter(e.target.value)}
                            >
                                <option value="">All Offices</option>
                                {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                        </div>

                        {/* NEW: Designation Filter */}
                        <div className="relative w-full md:w-48">
                            <FaBriefcase className="absolute left-3 top-3 text-gray-400 z-10" />
                            <select 
                                className="pl-10 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006A4E]/20 focus:border-[#006A4E] text-sm bg-white shadow-sm cursor-pointer"
                                value={designationFilter} 
                                onChange={e => setDesignationFilter(e.target.value)}
                            >
                                <option value="">All Designations</option>
                                {designations.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                            </select>
                        </div>

                        <select 
                            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white shadow-sm cursor-pointer" 
                            value={itemsPerPage} 
                            onChange={e => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
                        >
                            <option value="10">10 Rows</option>
                            <option value="50">50 Rows</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-[#006A4E]/5 text-xs uppercase font-bold text-[#006A4E] tracking-wider border-b border-[#006A4E]/10">
                            <tr>
                                <th className="px-6 py-4">Employee Name</th>
                                <th className="px-6 py-4">NID Number</th>
                                <th className="px-6 py-4">Office / Station</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-400">Loading Directory...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-12 text-gray-400">No employees found.</td></tr>
                            ) : (
                                currentItems.map(emp => (
                                    <tr key={emp.id} className="hover:bg-green-50/40 transition-colors duration-150 group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#006A4E] to-[#047857] text-white flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white">
                                                    {emp.first_name?.[0]}{emp.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{emp.first_name} {emp.last_name}</div>
                                                    <div className="text-xs text-gray-500 font-medium">
                                                        {emp.designation?.title || 'Unknown'} {/* Should fix "Unknown" */}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 font-mono text-xs text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">{emp.nid_number}</span></td>
                                        <td className="px-6 py-3"><div className="flex items-center gap-2 text-xs font-semibold text-gray-600"><FaBuilding className="text-gray-400" /> {emp.office?.name || 'Unassigned'}</div></td>
                                        <td className="px-6 py-3 text-center"><Badge type={emp.status === 'active' ? 'success' : 'danger'}>{emp.status}</Badge></td>
                                        <td className="px-6 py-3 text-right">
                                            <button onClick={() => navigate(`/employees/${emp.id}`)} className="text-gray-400 hover:text-[#006A4E] font-bold text-xs flex items-center justify-end gap-2 ml-auto">
                                                <FaEye /> View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 rounded-b-xl">
                    <span className="text-xs text-gray-500 font-medium pl-2">Page <span className="text-gray-900 font-bold">{currentPage}</span> of {totalPages || 1}</span>
                    <div className="flex gap-2">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-1.5 bg-white border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">Next</button>
                    </div>
                </div>
            </Card>

            {/* Add Employee Modal (Keep existing logic) */}
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Register New Employee">
               {/* ... (Keep your form logic here) ... */}
               <form onSubmit={handleAddSubmit} className="space-y-5">
                    {/* ... Form Inputs ... */}
                    {/* NOTE: I am not repeating the full form HTML to save space, stick to what you had! */}
                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-3">
                        <FaIdCard className="text-blue-600 mt-1" />
                        <div>
                            <p className="text-xs font-bold text-blue-800 uppercase">Important</p>
                            <p className="text-xs text-blue-700">Ensure NID is accurate. This cannot be changed easily later.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">First Name</label>
                            <input className="w-full border-gray-300 rounded-lg focus:ring-[#006A4E] focus:border-[#006A4E]" value={newEmp.first_name} onChange={e => setNewEmp({...newEmp, first_name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Last Name</label>
                            <input className="w-full border-gray-300 rounded-lg focus:ring-[#006A4E] focus:border-[#006A4E]" value={newEmp.last_name} onChange={e => setNewEmp({...newEmp, last_name: e.target.value})} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">National ID (NID)</label>
                        <input className="w-full border-gray-300 rounded-lg focus:ring-[#006A4E] focus:border-[#006A4E] font-mono" value={newEmp.nid_number} onChange={e => setNewEmp({...newEmp, nid_number: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Designation</label>
                            <select className="w-full border-gray-300 rounded-lg focus:ring-[#006A4E] focus:border-[#006A4E] py-2.5" value={newEmp.designation_id} onChange={e => { const d = designations.find(x => x.id == e.target.value); setNewEmp({...newEmp, designation_id: e.target.value, current_salary: d?.basic_salary || ''})}} required>
                                <option value="">Select Role...</option>
                                {designations.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Salary</label>
                            <input type="number" className="w-full border-gray-300 rounded-lg" value={newEmp.current_salary} onChange={e => setNewEmp({...newEmp, current_salary: e.target.value})} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Office</label>
                        <select className="w-full border-gray-300 rounded-lg py-2.5" value={newEmp.office_id} onChange={e => setNewEmp({...newEmp, office_id: e.target.value})} required>
                            <option value="">Select Office...</option>
                            {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>

                    <button className="w-full bg-[#006A4E] text-white py-3 rounded-lg font-bold">Create Record</button>
               </form>
            </Modal>
        </div>
    );
};

export default EmployeeDirectory;