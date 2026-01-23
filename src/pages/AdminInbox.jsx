import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { Table, Badge, Button, Form, Modal, Card } from 'react-bootstrap';
import { FaFileDownload, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';

const AdminInbox = () => {
    const [requests, setRequests] = useState([]);
    const [selectedReq, setSelectedReq] = useState(null);
    const [adminNote, setAdminNote] = useState('');

    // Fetch Requests
    const fetchRequests = async () => {
        try { const res = await api.get('/profile-requests'); setRequests(res.data); } catch(e){}
    };
    useEffect(() => { fetchRequests(); }, []);

    // Handle Traffic Light Actions
    const updateStatus = async (status) => {
        if(!window.confirm(`Mark this request as ${status.toUpperCase()}?`)) return;
        try {
            await api.put(`/profile-requests/${selectedReq.id}`, { status, admin_note: adminNote });
            alert(`Request ${status}!`);
            setSelectedReq(null);
            fetchRequests();
        } catch (e) { alert("Error updating status"); }
    };

    // Helper to get Attachment URL
    const getFileUrl = (path) => `http://127.0.0.1:8000/storage/${path}`;

    // Helper to render Status Badge
    const getBadge = (status) => {
        if(status === 'approved') return <Badge bg="success">🟢 Approved</Badge>;
        if(status === 'reviewing') return <Badge bg="warning" text="dark">🟡 Reviewing</Badge>;
        if(status === 'rejected') return <Badge bg="danger">🔴 Rejected</Badge>;
        return <Badge bg="secondary">⚪ Pending</Badge>;
    };

    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-dark">📥 Request Inbox</h3>
                <Button variant="outline-secondary" onClick={fetchRequests}><FaSearch/> Refresh</Button>
            </div>

            <Card className="shadow-sm border-0">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light">
                        <tr>
                            <th>Employee</th>
                            <th>Request Type</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(r => (
                            <tr key={r.id}>
                                <td className="fw-bold">{r.employee?.first_name} {r.employee?.last_name}</td>
                                <td>{r.request_type}</td>
                                <td><small className="text-muted">{new Date(r.created_at).toLocaleDateString()}</small></td>
                                <td>{getBadge(r.status)}</td>
                                <td className="text-end">
                                    {(r.status === 'pending' || r.status === 'reviewing') ? (
                                        <Button size="sm" variant="primary" onClick={() => setSelectedReq(r)}>Review Case</Button>
                                    ) : <span className="text-muted small">Closed</span>}
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && <tr><td colSpan="5" className="text-center p-5 text-muted">Inbox is empty.</td></tr>}
                    </tbody>
                </Table>
            </Card>

            {/* --- REVIEW MODAL --- */}
            <Modal show={selectedReq !== null} onHide={() => setSelectedReq(null)} size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title>Review Request #{selectedReq?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        {/* LEFT: Details */}
                        <div className="col-md-7 border-end">
                            <h6 className="text-muted text-uppercase small fw-bold">Request Summary</h6>
                            <p className="mb-4">{selectedReq?.details}</p>

                            <h6 className="text-muted text-uppercase small fw-bold">Proposed Changes</h6>
                            {selectedReq?.proposed_changes ? (
                                <Table size="sm" bordered className="mt-2">
                                    <thead className="bg-light"><tr><th>Field</th><th>New Value</th></tr></thead>
                                    <tbody>
                                        {Object.entries(selectedReq.proposed_changes).map(([key, val]) => (
                                            val && <tr key={key}><td className="text-capitalize">{key.replace('_', ' ')}</td><td className="fw-bold text-primary">{val}</td></tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : <p className="text-muted small">No structured data changes.</p>}
                        </div>

                        {/* RIGHT: Proof & Actions */}
                        <div className="col-md-5 ps-4">
                            <h6 className="text-muted text-uppercase small fw-bold mb-3">Proof Document</h6>
                            {selectedReq?.attachment ? (
                                <div className="mb-4 p-3 bg-light rounded text-center border">
                                    <a href={getFileUrl(selectedReq.attachment)} target="_blank" rel="noreferrer" className="btn btn-outline-dark btn-sm">
                                        <FaFileDownload className="me-2"/> View Attachment
                                    </a>
                                </div>
                            ) : (
                                <div className="alert alert-warning small">No proof attached.</div>
                            )}

                            <hr />
                            <Form.Group className="mb-3">
                                <Form.Label>Admin Note / Feedback</Form.Label>
                                <Form.Control as="textarea" rows={2} placeholder="Reason for rejection or approval note..." onChange={e => setAdminNote(e.target.value)} />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="warning" onClick={() => updateStatus('reviewing')}>🟡 Mark as Reviewing</Button>
                                <div className="d-flex gap-2">
                                    <Button variant="danger" className="flex-fill" onClick={() => updateStatus('rejected')}><FaTimes/> Reject</Button>
                                    <Button variant="success" className="flex-fill" onClick={() => updateStatus('approved')}><FaCheck/> Approve</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

export default AdminInbox;