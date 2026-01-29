import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
    FaUsers, FaMapMarkedAlt, FaGraduationCap, 
    FaSave, FaArrowLeft, FaPlus, FaTrash, FaInfoCircle 
} from 'react-icons/fa';
import AddressSelector from '../components/pims/AddressSelector'; // Ensure you created this component

const EmployeeEditProfile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('family');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // --- 1. FAMILY STATE ---
    const [family, setFamily] = useState({
        father: { name_en: '', name_bn: '', nid: '', dob: '', occupation: '' },
        mother: { name_en: '', name_bn: '', nid: '', dob: '', occupation: '' },
        spouses: [], 
        children: [] 
    });

    // --- 2. ADDRESS STATE ---
    const [presentAddr, setPresentAddr] = useState({ 
        division: '', district: '', upazila: '', post_office: '', road: '', house: '' 
    });
    const [permAddr, setPermAddr] = useState({ 
        division: '', district: '', upazila: '', post_office: '', road: '', house: '' 
    });
    const [sameAsPresent, setSameAsPresent] = useState(false);

    // --- 3. ACADEMIC STATE ---
    const [academics, setAcademics] = useState([]);
    const [academicFiles, setAcademicFiles] = useState({}); // Key: index, Value: File Object

    // --- INITIAL DATA FETCH ---
    useEffect(() => {
        const fetchProfile = async () => {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (!userData) { navigate('/login'); return; }
            
            setUser(userData);

            try {
                const res = await api.get(`/employees/${userData.employee_id}`);
                const data = res.data;

                // Load Family Info
                if (data.family_info) {
                    // Merge defaults to avoid undefined errors
                    setFamily(prev => ({ ...prev, ...data.family_info }));
                }

                // Load Address Info
                if (data.address_info) {
                    setPresentAddr(data.address_info.present || { division: '', district: '', upazila: '', post_office: '', road: '', house: '' });
                    setPermAddr(data.address_info.permanent || { division: '', district: '', upazila: '', post_office: '', road: '', house: '' });
                }

                // Load Academics (from relational table)
                if (data.academics && Array.isArray(data.academics)) {
                    setAcademics(data.academics);
                }
            } catch (e) {
                console.error("Failed to load profile data", e);
            }
        };
        fetchProfile();
    }, [navigate]);

    // --- HELPER FUNCTIONS ---

    // Family Helpers
    const addSpouse = () => setFamily({ ...family, spouses: [...family.spouses, { name: '', dob: '', nid: '', occupation: '' }] });
    const removeSpouse = (index) => {
        const list = [...family.spouses];
        list.splice(index, 1);
        setFamily({ ...family, spouses: list });
    };

    const addChild = () => setFamily({ ...family, children: [...family.children, { name: '', dob: '', nid: '', gender: '' }] });
    const removeChild = (index) => {
        const list = [...family.children];
        list.splice(index, 1);
        setFamily({ ...family, children: list });
    };

    // Academic Helpers
    const addEducation = () => setAcademics([...academics, { exam_name: '', institute: '', passing_year: '', result: '', result_type: '', subject: '' }]);
    const removeEducation = (index) => {
        const list = [...academics];
        list.splice(index, 1);
        setAcademics(list);
        
        // Also remove associated file from state if exists
        const newFiles = { ...academicFiles };
        delete newFiles[index];
        setAcademicFiles(newFiles);
    };

    const handleAcademicChange = (index, field, value) => {
        const updated = [...academics];
        updated[index][field] = value;
        setAcademics(updated);
    };

    // --- SUBMIT HANDLER ---
    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        const formData = new FormData();

        // 1. JSON Payloads (Safety Checks)
        // Ensure we are not sending null/undefined
        formData.append('family_info', JSON.stringify(family || {}));
        
        const addressData = {
            present: presentAddr || {},
            permanent: sameAsPresent ? (presentAddr || {}) : (permAddr || {})
        };
        formData.append('address_info', JSON.stringify(addressData));
        formData.append('academics', JSON.stringify(academics || []));

        // 2. File Uploads
        Object.keys(academicFiles).forEach(key => {
            if(academicFiles[key]) {
                formData.append(`academic_files[${key}]`, academicFiles[key]);
            }
        });

        try {
            await api.post(`/employees/${user.employee_id}/update-full`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("✅ PIMS Data Updated Successfully!");
            navigate('/portal');
        } catch (e) {
            console.error("Save Error:", e.response ? e.response.data : e);
            alert("Failed to save data. " + (e.response?.data?.message || "Check network."));
        } finally {
            setLoading(false);
        }
    };
    // Common Input Style
    const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#006A4E] focus:ring-1 focus:ring-[#006A4E] transition-colors";
    const labelClass = "block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide";

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-24">
            
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#006A4E]">Personal Information Management</h1>
                    <p className="text-sm text-gray-500">Update your family, address, and academic records.</p>
                </div>
                <button 
                    onClick={() => navigate('/portal')} 
                    className="flex items-center text-gray-500 hover:text-[#006A4E] font-bold text-sm transition-colors group"
                >
                    <div className="p-2 bg-white border border-gray-200 rounded-full mr-2 group-hover:border-[#006A4E]">
                        <FaArrowLeft className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    Back to Portal
                </button>
            </div>

            {/* --- TAB NAVIGATION --- */}
            <div className="grid grid-cols-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-x divide-gray-100">
                <button 
                    onClick={() => setActiveTab('family')} 
                    className={`py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'family' ? 'bg-[#006A4E] text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                    <FaUsers /> Family Info
                </button>
                <button 
                    onClick={() => setActiveTab('address')} 
                    className={`py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'address' ? 'bg-[#006A4E] text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                    <FaMapMarkedAlt /> Address Info
                </button>
                <button 
                    onClick={() => setActiveTab('academic')} 
                    className={`py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'academic' ? 'bg-[#006A4E] text-white' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                    <FaGraduationCap /> Education
                </button>
            </div>

            {/* --- TAB CONTENT --- */}
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
                
                {/* 1. FAMILY TAB */}
                {activeTab === 'family' && (
                    <div className="space-y-8 animate-fade-in">
                        
                        {/* Father */}
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                            <h3 className="text-[#006A4E] font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-[#006A4E] rounded-full"></span> Father's Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Name (English)</label>
                                    <input className={inputClass} value={family.father.name_en} onChange={e => setFamily({...family, father: {...family.father, name_en: e.target.value}})} />
                                </div>
                                <div>
                                    <label className={labelClass}>Name (Bangla)</label>
                                    <input className={inputClass} value={family.father.name_bn} onChange={e => setFamily({...family, father: {...family.father, name_bn: e.target.value}})} />
                                </div>
                                <div>
                                    <label className={labelClass}>National ID</label>
                                    <input className={inputClass} value={family.father.nid} onChange={e => setFamily({...family, father: {...family.father, nid: e.target.value}})} />
                                </div>
                                <div>
                                    <label className={labelClass}>Date of Birth</label>
                                    <input type="date" className={inputClass} value={family.father.dob} onChange={e => setFamily({...family, father: {...family.father, dob: e.target.value}})} />
                                </div>
                            </div>
                        </div>

                        {/* Mother */}
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                            <h3 className="text-[#006A4E] font-bold text-lg mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-[#006A4E] rounded-full"></span> Mother's Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Name (English)</label>
                                    <input className={inputClass} value={family.mother.name_en} onChange={e => setFamily({...family, mother: {...family.mother, name_en: e.target.value}})} />
                                </div>
                                <div>
                                    <label className={labelClass}>Name (Bangla)</label>
                                    <input className={inputClass} value={family.mother.name_bn} onChange={e => setFamily({...family, mother: {...family.mother, name_bn: e.target.value}})} />
                                </div>
                                <div>
                                    <label className={labelClass}>National ID</label>
                                    <input className={inputClass} value={family.mother.nid} onChange={e => setFamily({...family, mother: {...family.mother, nid: e.target.value}})} />
                                </div>
                                <div>
                                    <label className={labelClass}>Date of Birth</label>
                                    <input type="date" className={inputClass} value={family.mother.dob} onChange={e => setFamily({...family, mother: {...family.mother, dob: e.target.value}})} />
                                </div>
                            </div>
                        </div>

                        {/* Spouses */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[#006A4E] font-bold text-lg flex items-center gap-2">
                                    <span className="w-1 h-5 bg-[#006A4E] rounded-full"></span> Spouse Details
                                </h3>
                                <button onClick={addSpouse} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold border border-blue-200 hover:bg-blue-100 flex items-center gap-1">
                                    <FaPlus /> Add Spouse
                                </button>
                            </div>
                            {family.spouses.map((spouse, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Name</label>
                                        <input className={inputClass} value={spouse.name} onChange={e => {const s = [...family.spouses]; s[i].name = e.target.value; setFamily({...family, spouses: s})}} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>NID</label>
                                        <input className={inputClass} value={spouse.nid} onChange={e => {const s = [...family.spouses]; s[i].nid = e.target.value; setFamily({...family, spouses: s})}} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Occupation</label>
                                        <input className={inputClass} value={spouse.occupation} onChange={e => {const s = [...family.spouses]; s[i].occupation = e.target.value; setFamily({...family, spouses: s})}} />
                                    </div>
                                    <div className="md:col-span-1 flex items-end">
                                        <button onClick={() => removeSpouse(i)} className="w-full bg-red-50 text-red-500 border border-red-200 p-2 rounded hover:bg-red-100 transition"><FaTrash className="mx-auto" /></button>
                                    </div>
                                </div>
                            ))}
                            {family.spouses.length === 0 && <p className="text-xs text-gray-400 italic">No spouse added.</p>}
                        </div>

                        {/* Children */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[#006A4E] font-bold text-lg flex items-center gap-2">
                                    <span className="w-1 h-5 bg-[#006A4E] rounded-full"></span> Children Details
                                </h3>
                                <button onClick={addChild} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold border border-blue-200 hover:bg-blue-100 flex items-center gap-1">
                                    <FaPlus /> Add Child
                                </button>
                            </div>
                            {family.children.map((child, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200 relative group">
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Child Name</label>
                                        <input className={inputClass} value={child.name} onChange={e => {const c = [...family.children]; c[i].name = e.target.value; setFamily({...family, children: c})}} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Date of Birth</label>
                                        <input type="date" className={inputClass} value={child.dob} onChange={e => {const c = [...family.children]; c[i].dob = e.target.value; setFamily({...family, children: c})}} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={labelClass}>Gender</label>
                                        <select className={inputClass} value={child.gender} onChange={e => {const c = [...family.children]; c[i].gender = e.target.value; setFamily({...family, children: c})}}>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-1 flex items-end">
                                        <button onClick={() => removeChild(i)} className="w-full bg-red-50 text-red-500 border border-red-200 p-2 rounded hover:bg-red-100 transition"><FaTrash className="mx-auto" /></button>
                                    </div>
                                </div>
                            ))}
                            {family.children.length === 0 && <p className="text-xs text-gray-400 italic">No children added.</p>}
                        </div>

                    </div>
                )}

                {/* 2. ADDRESS TAB */}
                {activeTab === 'address' && (
                    <div className="space-y-6 animate-fade-in">
                        
                        <AddressSelector label="Present Address" value={presentAddr} onChange={setPresentAddr} />

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-3">
                            <input 
                                type="checkbox" 
                                id="sameAddr" 
                                className="w-5 h-5 text-[#006A4E] rounded focus:ring-[#006A4E]"
                                checked={sameAsPresent} 
                                onChange={e => setSameAsPresent(e.target.checked)} 
                            />
                            <label htmlFor="sameAddr" className="text-sm font-bold text-blue-900 cursor-pointer select-none">
                                Permanent Address is same as Present Address
                            </label>
                        </div>

                        {!sameAsPresent && (
                            <AddressSelector label="Permanent Address" value={permAddr} onChange={setPermAddr} />
                        )}

                    </div>
                )}

                {/* 3. ACADEMIC TAB */}
                {activeTab === 'academic' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center">
                             <div>
                                <h3 className="text-[#006A4E] font-bold text-lg">Academic Qualifications</h3>
                                <p className="text-xs text-gray-500">Add all relevant degrees. Upload certificates if available.</p>
                             </div>
                             <button onClick={addEducation} className="bg-[#006A4E] text-white text-xs px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-[#047857] flex items-center gap-2">
                                <FaPlus /> Add Qualification
                             </button>
                        </div>
                        
                        {academics.map((row, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg relative">
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Examination</label>
                                    <select className={inputClass} value={row.exam_name} onChange={e => handleAcademicChange(i, 'exam_name', e.target.value)}>
                                        <option value="">Select Exam</option>
                                        <option value="SSC">SSC / Dakhil</option>
                                        <option value="HSC">HSC / Alim</option>
                                        <option value="Bachelor">Bachelor (Honors)</option>
                                        <option value="Masters">Masters</option>
                                        <option value="Diploma">Diploma</option>
                                    </select>
                                </div>
                                <div className="md:col-span-3">
                                    <label className={labelClass}>Institute / Board</label>
                                    <input className={inputClass} placeholder="School/College/University" value={row.institute} onChange={e => handleAcademicChange(i, 'institute', e.target.value)} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Passing Year</label>
                                    <input className={inputClass} type="number" placeholder="YYYY" value={row.passing_year} onChange={e => handleAcademicChange(i, 'passing_year', e.target.value)} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Result (GPA/Class)</label>
                                    <input className={inputClass} placeholder="e.g. 5.00" value={row.result} onChange={e => handleAcademicChange(i, 'result', e.target.value)} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Certificate</label>
                                    <input type="file" className="block w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => setAcademicFiles({...academicFiles, [i]: e.target.files[0]})} />
                                    {row.certificate_path && !academicFiles[i] && <span className="text-[10px] text-green-600 font-bold block mt-1">✓ File on record</span>}
                                </div>
                                <div className="md:col-span-1 flex items-end">
                                    <button onClick={() => removeEducation(i)} className="w-full bg-white text-red-500 border border-gray-200 p-2 rounded hover:bg-red-50 transition shadow-sm"><FaTrash className="mx-auto" /></button>
                                </div>
                            </div>
                        ))}

                        {academics.length === 0 && (
                            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <FaGraduationCap className="mx-auto text-4xl text-gray-300 mb-2" />
                                <p className="text-gray-400 font-medium">No academic records added yet.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* --- BOTTOM ACTION BAR --- */}
            <div className="fixed bottom-0 left-0 right-0 lg:pl-64 z-40">
                <div className="bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded border border-yellow-200 hidden md:flex">
                        <FaInfoCircle />
                        <span className="text-xs font-bold">Ensure all information is accurate before saving.</span>
                    </div>
                    
                    <div className="flex gap-4 w-full md:w-auto">
                        <button 
                            onClick={() => navigate('/portal')}
                            className="flex-1 md:flex-none px-6 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition border border-transparent"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="flex-1 md:flex-none bg-[#006A4E] text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-green-900/20 hover:bg-[#047857] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> Saving...</>
                            ) : (
                                <><FaSave /> Save Changes</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EmployeeEditProfile;