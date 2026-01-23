import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Modal, Button, Form, Badge, InputGroup } from 'react-bootstrap';
import { FaSearch, FaUserCircle, FaCamera } from 'react-icons/fa';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(''); // Search State

    // Modals
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Fetch Data with Search
    const fetchEmployees = async (searchTerm = '') => {
        setLoading(true);
        try {
            const res = await api.get(`/employees?search=${searchTerm}`);
            setEmployees(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchEmployees(); }, []);

    // Search Handler (Debounce could be added here)
    const handleSearch = (e) => {
        setSearch(e.target.value);
        fetchEmployees(e.target.value);
    };

    // View Profile
    const handleViewProfile = async (id) => {
        const res = await api.get(`/employees/${id}`);
        setSelectedEmployee(res.data);
        setShowProfileModal(true);
    };

    // Helper to show Image
    const getPhotoUrl = (path) => path ? `http://127.0.0.1:8000/storage/${path}` : null;

    return (
        <Layout>
            <div className="container-fluid">
                
                {/* 1. HEADER & SEARCH */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold text-dark mb-0">Operational Staff</h3>
                        <small className="text-muted">Manage personnel, search records, and verify profiles.</small>
                    </div>
                    {/* Add Button logic from previous code here if needed */}
                </div>

                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-body p-2">
                        <InputGroup>
                            <InputGroup.Text className="bg-white border-0"><FaSearch className="text-muted"/></InputGroup.Text>
                            <Form.Control 
                                placeholder="Search by Name, NID, or Designation..." 
                                className="border-0 shadow-none"
                                value={search}
                                onChange={handleSearch}
                            />
                        </InputGroup>
                    </div>
                </div>

                {/* 2. EMPLOYEE LIST */}
                <div className="card shadow-sm border-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Employee</th>
                                <th>Designation</th>
                                <th>Contact</th>
                                <th>Status</th>
                                <th className="text-end pe-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id} style={{cursor:'pointer'}} onClick={() => handleViewProfile(emp.id)}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center">
                                            {emp.profile_picture ? (
                                                <img src={getPhotoUrl(emp.profile_picture)} className="rounded-circle me-3" width="40" height="40" style={{objectFit:'cover'}} />
                                            ) : (
                                                <div className="bg-light rounded-circle me-3 d-flex align-items-center justify-content-center" style={{width:40, height:40}}><FaUserCircle size={24} className="text-secondary"/></div>
                                            )}
                                            <div>
                                                <div className="fw-bold text-dark">{emp.first_name} {emp.last_name}</div>
                                                <small className="text-muted">NID: {emp.nid_number}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge bg-light text-dark border">{emp.designation}</span></td>
                                    <td><small>{emp.email || 'N/A'}</small></td>
                                    <td>{emp.is_verified ? <Badge bg="success">Verified</Badge> : <Badge bg="warning" text="dark">Pending</Badge>}</td>
                                    <td className="text-end pe-4">
                                        <Button variant="light" size="sm" className="border">View Profile</Button>
                                    </td>
                                </tr>
                            ))}
                            {employees.length === 0 && <tr><td colSpan="5" className="text-center p-5 text-muted">No employees found matching "{search}"</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. PROFILE DETAILS MODAL */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
                <Modal.Header closeButton><Modal.Title>Employee Profile</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedEmployee && (
                        <div className="row">
                            <div className="col-md-4 text-center border-end">
                                <div className="mb-3 position-relative d-inline-block">
                                    {selectedEmployee.profile_picture ? (
                                        <img src={getPhotoUrl(selectedEmployee.profile_picture)} className="rounded-circle shadow-sm" width="120" height="120" style={{objectFit:'cover'}} />
                                    ) : (
                                        <FaUserCircle size={100} className="text-muted" />
                                    )}
                                </div>
                                <h5>{selectedEmployee.first_name} {selectedEmployee.last_name}</h5>
                                <p className="text-primary fw-bold">{selectedEmployee.designation}</p>
                                <Badge bg="dark">{selectedEmployee.status}</Badge>
                            </div>
                            <div className="col-md-8 ps-4">
                                <h6 className="text-muted text-uppercase small fw-bold mb-3">Personal Information</h6>
                                <div className="row mb-2">
                                    <div className="col-4 text-muted">NID Number</div>
                                    <div className="col-8 fw-bold">{selectedEmployee.nid_number}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-4 text-muted">Phone/Email</div>
                                    <div className="col-8">{selectedEmployee.phone || '-'} / {selectedEmployee.email || '-'}</div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-4 text-muted">Current Salary</div>
                                    <div className="col-8">{selectedEmployee.current_salary} BDT</div>
                                </div>
                                
                                <hr />
                                <h6 className="text-muted text-uppercase small fw-bold mb-3">Service Record</h6>
                                <p>Currently posted at: <strong>{selectedEmployee.office?.name}</strong></p>
                                {/* Add Timeline logic here if needed */}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowProfileModal(false)}>Close</Button>
                    <Button variant="primary">Edit (Admin)</Button>
                </Modal.Footer>
            </Modal>
        </Layout>
    );
};

export default Dashboard;