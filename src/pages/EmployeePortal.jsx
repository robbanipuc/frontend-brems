import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Modal, Form, Badge, Table } from 'react-bootstrap';
import { FaCamera, FaEdit } from 'react-icons/fa';

const EmployeePortal = () => {
    const [employee, setEmployee] = useState(null);
    const [myRequests, setMyRequests] = useState([]);
    
    // Edit States
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [proofFile, setProofFile] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);

    const navigate = useNavigate();

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const empRes = await api.get(`/employees/${user.employee_id}`);
            setEmployee(empRes.data);
            
            // Initializing edit form with current data
            setEditForm({
                first_name: empRes.data.first_name,
                last_name: empRes.data.last_name,
                phone: empRes.data.phone || '',
                address: empRes.data.address || ''
            });

            // Fetch Requests (Optional/Mock for now)
            try {
                const reqRes = await api.get('/profile-requests');
                setMyRequests(reqRes.data.filter(r => r.employee_id === user.employee_id));
            } catch(e) {}
        } catch (error) { console.error("Error"); }
    };

    // 1. Upload Profile Photo
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            await api.post(`/employees/${employee.id}/photo`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Photo Updated!");
            fetchData();
        } catch(e) { alert("Photo upload failed"); }
    };

    // 2. Request Profile Change
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('details', "Employee requested profile update.");
        formData.append('changes', JSON.stringify(editForm)); // Send changes as JSON string
        if(proofFile) {
            formData.append('attachment', proofFile);
        }

        try {
            await api.post('/profile-requests', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Request sent to Admin! Wait for approval.");
            setShowEditModal(false);
            fetchData();
        } catch(e) { alert("Failed to send request"); }
    };

    const getPhotoUrl = (path) => path ? `http://127.0.0.1:8000/storage/${path}` : null;

    if (!employee) return <div>Loading...</div>;

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-4 shadow-sm border-start border-5 border-success">
                <div><h2 className="mb-0 fw-bold">My Portal</h2><p className="text-muted mb-0">Manage your profile</p></div>
                <Button variant="danger" onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</Button>
            </div>

            <div className="row">
                {/* PROFILE CARD */}
                <div className="col-md-5">
                    <Card className="shadow-sm border-0">
                        <Card.Body className="text-center pt-4">
                            <div className="position-relative d-inline-block mb-3">
                                {employee.profile_picture ? (
                                     <img src={getPhotoUrl(employee.profile_picture)} className="rounded-circle" width="120" height="120" style={{objectFit:'cover'}}/>
                                ) : (
                                     <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width:120, height:120, fontSize:'3rem'}}>👤</div>
                                )}
                                <label className="position-absolute bottom-0 end-0 bg-dark text-white rounded-circle p-2" style={{cursor:'pointer'}}>
                                    <FaCamera size={14}/>
                                    <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
                                </label>
                            </div>

                            <h4>{employee.first_name} {employee.last_name}</h4>
                            <p className="text-success fw-bold">{employee.designation}</p>
                            
                            <div className="text-start bg-light p-3 rounded mt-3">
                                <p className="mb-1"><strong>Phone:</strong> {employee.phone || 'N/A'}</p>
                                <p className="mb-1"><strong>Address:</strong> {employee.address || 'N/A'}</p>
                                <p className="mb-0"><strong>Status:</strong> <Badge bg="success">{employee.status}</Badge></p>
                            </div>

                            <Button variant="outline-primary" className="w-100 mt-3" onClick={() => setShowEditModal(true)}>
                                <FaEdit className="me-2"/> Edit Profile Information
                            </Button>
                        </Card.Body>
                    </Card>
                </div>

                {/* REQUEST STATUS */}
                <div className="col-md-7">
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white fw-bold">Update Requests</Card.Header>
                        <Table hover className="mb-0">
                            <thead><tr><th>Type</th><th>Status</th><th>Note</th></tr></thead>
                            <tbody>
                                {myRequests.map(r => (
                                    <tr key={r.id}>
                                        <td>Profile Update</td>
                                        <td>
                                            {r.status === 'approved' && <Badge bg="success">Approved</Badge>}
                                            {r.status === 'pending' && <Badge bg="secondary">Pending</Badge>}
                                            {r.status === 'rejected' && <Badge bg="danger">Rejected</Badge>}
                                        </td>
                                        <td><small>{r.admin_note}</small></td>
                                    </tr>
                                ))}
                                {myRequests.length === 0 && <tr><td colSpan="3" className="text-center py-3">No pending requests</td></tr>}
                            </tbody>
                        </Table>
                    </Card>
                </div>
            </div>

            {/* EDIT MODAL */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <div className="row mb-2">
                            <div className="col">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} />
                            </div>
                            <div className="col">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control value={editForm.last_name} onChange={e => setEditForm({...editForm, last_name: e.target.value})} />
                            </div>
                        </div>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control className="mb-2" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                        
                        <Form.Label>Address</Form.Label>
                        <Form.Control as="textarea" className="mb-3" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />

                        <div className="mb-3 border p-3 rounded bg-light">
                            <Form.Label className="fw-bold">Attach Proof Document</Form.Label>
                            <p className="text-muted small mb-2">Required for verification (NID Scan, Utility Bill, etc.)</p>
                            <Form.Control type="file" onChange={e => setProofFile(e.target.files[0])} />
                        </div>

                        <Button type="submit" variant="primary" className="w-100">Submit for Approval</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default EmployeePortal;