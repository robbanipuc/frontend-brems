import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { FaUsers, FaBuilding, FaClipboardList, FaUserTie, FaArrowUp } from 'react-icons/fa';

const Dashboard = () => {
    const [stats, setStats] = useState({ 
        employees: 0, 
        offices: 0, 
        requests: 0, 
        designations: 0 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                // Fetch all data in parallel for speed
                const [emp, off, req, des] = await Promise.all([
                    api.get('/employees'),
                    api.get('/offices'),
                    api.get('/profile-requests'),
                    api.get('/designations')
                ]);

                setStats({
                    employees: emp.data.length,
                    offices: off.data.length,
                    requests: req.data.filter(r => r.status === 'pending').length,
                    designations: des.data.length
                });
            } catch (e) { 
                console.error("Dashboard data fetch failed", e); 
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    // Helper Component for the Top Cards
    const StatCard = ({ title, count, icon: Icon, colorClass, subText }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClass} text-white`}>
                    <Icon size={20} />
                </div>
                {/* Optional Percentage Badge */}
                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <FaArrowUp className="mr-1" size={10} /> Live
                </span>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{loading ? '...' : count}</h3>
                <p className="text-xs text-gray-400 mt-2">{subText}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* 1. Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Overview of Bangladesh Railway HR System</p>
            </div>

            {/* 2. Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Employees" 
                    count={stats.employees} 
                    icon={FaUsers} 
                    colorClass="bg-blue-600"
                    subText="Active across all stations"
                />
                <StatCard 
                    title="Offices & Stations" 
                    count={stats.offices} 
                    icon={FaBuilding} 
                    colorClass="bg-indigo-600"
                    subText="Network locations"
                />
                <StatCard 
                    title="Pending Requests" 
                    count={stats.requests} 
                    icon={FaClipboardList} 
                    colorClass="bg-railway-red"
                    subText="Requiring approval"
                />
                <StatCard 
                    title="Designations" 
                    count={stats.designations} 
                    icon={FaUserTie} 
                    colorClass="bg-railway-green"
                    subText="Job roles configured"
                />
            </div>

            {/* 3. Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Quick Actions / Notices */}
                <Card className="lg:col-span-2">
                    <CardHeader title="System Notices" subtitle="Important updates for administrators" />
                    <CardBody>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-md">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-blue-700 font-bold">Annual Audit Period</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        Please ensure all employee transfer records and designations are updated before the 30th of this month for the annual government audit.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="border border-gray-100 rounded-lg p-8 text-center">
                            <div className="text-gray-400 text-sm">No other critical alerts at this time.</div>
                            <button className="mt-4 text-railway-green text-sm font-semibold hover:underline">
                                View System Logs
                            </button>
                        </div>
                    </CardBody>
                </Card>

                {/* Right: Server Status */}
                <Card className="h-fit">
                    <CardHeader title="System Status" />
                    <CardBody className="space-y-5">
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                            <span className="text-sm text-gray-600 font-medium">Database</span>
                            <span className="text-green-700 font-bold bg-green-100 px-2.5 py-0.5 rounded-full text-xs border border-green-200">Connected</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                            <span className="text-sm text-gray-600 font-medium">API Latency</span>
                            <span className="text-gray-800 font-mono text-xs">24ms</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                            <span className="text-sm text-gray-600 font-medium">Storage</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-railway-green h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="text-xs text-gray-400 text-center">Last synced: Just now</p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;