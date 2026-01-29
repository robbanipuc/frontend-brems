import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressSelector = ({ label, value, onChange }) => {
    // Lists
    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    // Safety check for value
    const safeValue = value || { division: '', district: '', upazila: '', post_office: '', road: '', house: '' };

    // API Base URL from your screenshot
    const BASE_URL = "https://bdopenapi.vercel.app/api/geo";

    // 1. Fetch Divisions on Load
    useEffect(() => {
        const fetchDivisions = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/divisions`);
                // API returns { data: [...] }
                setDivisions(res.data.data || []); 
            } catch (error) {
                console.error("Failed to load divisions", error);
            }
        };
        fetchDivisions();
    }, []);

    // 2. Fetch Districts when Division Name changes
    useEffect(() => {
        // Reset dependent fields if division changes
        if (!safeValue.division) {
            setDistricts([]);
            return;
        }

        // Find the ID of the selected Division Name
        const selectedDivObj = divisions.find(d => d.name === safeValue.division);

        if (selectedDivObj) {
            axios.get(`${BASE_URL}/districts/${selectedDivObj.id}`)
                .then(res => setDistricts(res.data.data || []))
                .catch(e => console.error(e));
        }
    }, [safeValue.division, divisions]);

    // 3. Fetch Upazilas when District Name changes
    useEffect(() => {
        if (!safeValue.district) {
            setUpazilas([]);
            return;
        }

        // Find the ID of the selected District Name
        const selectedDistObj = districts.find(d => d.name === safeValue.district);

        if (selectedDistObj) {
            axios.get(`${BASE_URL}/upazilas/${selectedDistObj.id}`)
                .then(res => setUpazilas(res.data.data || []))
                .catch(e => console.error(e));
        }
    }, [safeValue.district, districts]);

    // Handler
    const handleChange = (field, val) => {
        let newData = { ...safeValue, [field]: val };

        // Reset child fields if parent changes
        if (field === 'division') {
            newData.district = '';
            newData.upazila = '';
        } else if (field === 'district') {
            newData.upazila = '';
        }

        onChange(newData);
    };

    // Styles
    const labelClass = "block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide";
    const inputClass = "w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#006A4E] focus:border-[#006A4E] block p-2.5";

    return (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
            <h4 className="font-bold text-[#006A4E] text-sm mb-4 uppercase flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="w-1 h-4 bg-[#006A4E] rounded"></span> {label}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Division */}
                <div>
                    <label className={labelClass}>Division</label>
                    <select 
                        className={inputClass} 
                        value={safeValue.division} 
                        onChange={e => handleChange('division', e.target.value)}
                    >
                        <option value="">Select Division</option>
                        {divisions.map((div) => (
                            <option key={div.id} value={div.name}>{div.name}</option>
                        ))}
                    </select>
                </div>

                {/* District */}
                <div>
                    <label className={labelClass}>District</label>
                    <select 
                        className={inputClass} 
                        value={safeValue.district} 
                        onChange={e => handleChange('district', e.target.value)} 
                        disabled={!safeValue.division}
                    >
                        <option value="">{districts.length ? 'Select District' : 'Select Division First'}</option>
                        {districts.map((dist) => (
                            <option key={dist.id} value={dist.name}>{dist.name}</option>
                        ))}
                    </select>
                </div>

                {/* Upazila */}
                <div>
                    <label className={labelClass}>Upazila/Thana</label>
                    <select 
                        className={inputClass} 
                        value={safeValue.upazila} 
                        onChange={e => handleChange('upazila', e.target.value)} 
                        disabled={!safeValue.district}
                    >
                        <option value="">{upazilas.length ? 'Select Upazila' : 'Select District First'}</option>
                        {upazilas.map((upa) => (
                            <option key={upa.id} value={upa.name}>{upa.name}</option>
                        ))}
                    </select>
                </div>

                {/* Manual Inputs */}
                <div>
                    <label className={labelClass}>Post Office</label>
                    <input type="text" className={inputClass} value={safeValue.post_office} onChange={e => handleChange('post_office', e.target.value)} />
                </div>
                <div>
                    <label className={labelClass}>Village / Road No</label>
                    <input type="text" className={inputClass} value={safeValue.road} onChange={e => handleChange('road', e.target.value)} />
                </div>
                <div>
                    <label className={labelClass}>House No / Name</label>
                    <input type="text" className={inputClass} value={safeValue.house} onChange={e => handleChange('house', e.target.value)} />
                </div>
            </div>
        </div>
    );
};

export default AddressSelector;