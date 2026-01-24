import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { FaEye, FaSearch, FaFilter, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
        first_name: '',
        last_name: '',
        nid_number: '',
        designation: '',
        current_salary: '',
        current_office_id: ''
    });

    // Filters
    const [search, setSearch] = useState('');
    const [officeFilter, setOfficeFilter] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const navigate = useNavigate();

    // 1. Fetch All Data (Employees, Offices, Designations)
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
        try {
            await api.post('/employees', newEmp);
            alert("Employee Added Successfully!");
            setAddModalOpen(false);
            setNewEmp({ first_name: '', last_name: '', nid_number: '', designation: '', current_salary: '', current_office_id: '' });
            loadData(); // Refresh list
        } catch (e) {
            alert("Failed to add employee. NID might be duplicate.");
        }
    };

    // 3. Filter Logic
    useEffect(() => {
        let result = employees;

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(e => 
                e.first_name.toLowerCase().includes(lowerSearch) || 
                e.last_name.toLowerCase().includes(lowerSearch) ||
                e.nid_number.includes(lowerSearch) ||
                e.designation.toLowerCase().includes(lowerSearch)
            );
        }

        if (officeFilter) {
            result = result.filter(e => e.current_office_id === parseInt(officeFilter));
        }

        setFilteredData(result);
        setCurrentPage(1); 
    }, [search, officeFilter, employees]);

    // Pagination Logic
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Employee Directory</h1>
                    <div className="text-sm text-gray-500">Total Records: <span className="font-bold text-railway-green">{filteredData.length}</span></div>
                </div>
                {/* ADD EMPLOYEE BUTTON */}
                <button 
                    onClick={() => setAddModalOpen(true)}
                    className="bg-railway-green text-white px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-railway-dark transition flex items-center gap-2"
                >
                    <FaUserPlus /> Add Employee
                </button>
            </div>

            <Card>
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="relative w-64">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input 
                            className="pl-10 w-full" 
                            placeholder="Search by Name, NID..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 items-center">
                        <FaFilter className="text-gray-400" />
                        <select className="w-48 text-sm bg-white" value={officeFilter} onChange={e => setOfficeFilter(e.target.value)}>
                            <option value="">All Offices</option>
                            {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>

                    {/* Rows Per Page */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Show:</span>
                        <select 
                            className="w-20 p-1 bg-white" 
                            value={itemsPerPage} 
                            onChange={e => setItemsPerPage(parseInt(e.target.value))}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-xs uppercase font-bold text-gray-500">
                            <tr>
                                <th className="px-6 py-3">ID / NID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Designation</th>
                                <th className="px-6 py-3">Office</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? <tr><td colSpan="6" className="text-center py-10">Loading...</td></tr> : 
                             currentItems.map(emp => (
                                <tr key={emp.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-3 font-mono text-xs">{emp.nid_number}</td>
                                    <td className="px-6 py-3 font-bold text-gray-800">{emp.first_name} {emp.last_name}</td>
                                    <td className="px-6 py-3">{emp.designation}</td>
                                    <td className="px-6 py-3">{emp.office?.name || '-'}</td>
                                    <td className="px-6 py-3">
                                        {emp.is_verified ? (
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold border ${emp.status==='active'?'bg-green-50 text-green-700 border-green-200':'bg-red-50 text-red-700 border-red-200'}`}>
                                                {emp.status.toUpperCase()}
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 flex items-center w-fit gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                                UNVERIFIED
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <button 
                                            onClick={() => window.open(`/employees/${emp.id}`, '_blank')}
                                            className="text-railway-green hover:underline font-bold text-xs flex items-center justify-end gap-1"
                                        >
                                            <FaEye /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >Prev</button>
                    <span className="px-3 py-1 text-sm font-bold text-gray-600">Page {currentPage} of {totalPages}</span>
                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >Next</button>
                </div>
            </Card>

            {/* --- ADD EMPLOYEE MODAL --- */}
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Register New Employee">
                <form onSubmit={handleAddSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                            <input className="w-full" value={newEmp.first_name} onChange={e => setNewEmp({...newEmp, first_name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                            <input className="w-full" value={newEmp.last_name} onChange={e => setNewEmp({...newEmp, last_name: e.target.value})} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">National ID (NID)</label>
                        <input className="w-full" value={newEmp.nid_number} onChange={e => setNewEmp({...newEmp, nid_number: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Designation</label>
                            <select 
                                className="w-full" 
                                value={newEmp.designation} 
                                onChange={e => {
                                    const des = designations.find(d => d.title === e.target.value);
                                    setNewEmp({...newEmp, designation: e.target.value, current_salary: des ? des.basic_salary : ''})
                                }} 
                                required
                            >
                                <option value="">Select Role...</option>
                                {designations.map(d => <option key={d.id} value={d.title}>{d.title}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Salary</label>
                            <input type="number" className="w-full" value={newEmp.current_salary} onChange={e => setNewEmp({...newEmp, current_salary: e.target.value})} required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Assigned Office</label>
                        <select className="w-full" value={newEmp.current_office_id} onChange={e => setNewEmp({...newEmp, current_office_id: e.target.value})} required>
                            <option value="">Select Office...</option>
                            {offices.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-railway-green text-white py-3 rounded-lg font-bold hover:bg-railway-dark transition mt-2">
                        Create Employee Record
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default EmployeeDirectory;