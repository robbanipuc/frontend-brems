import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService, officeService, designationService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  DatePicker,
  Alert,
} from '@/components/common';
import {
  GENDER_OPTIONS,
  RELIGION_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  CADRE_OPTIONS,
} from '@/utils/constants';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    name_bn: '',
    nid_number: '',
    designation_id: '',
    office_id: '',
    phone: '',
    gender: '',
    dob: '',
    religion: '',
    blood_group: '',
    marital_status: '',
    place_of_birth: '',
    height: '',
    passport: '',
    birth_reg: '',
    joining_date: new Date().toISOString().split('T')[0],
    cadre_type: '',
    batch_no: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchOffices();
    fetchDesignations();
  }, []);

  const fetchOffices = async () => {
    try {
      const data = await officeService.getManaged();
      setOffices(data);
    } catch (err) {
      console.error('Failed to fetch offices:', err);
    }
  };

  const fetchDesignations = async () => {
    try {
      const data = await designationService.getAll();
      setDesignations(data);
    } catch (err) {
      console.error('Failed to fetch designations:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    if (!formData.nid_number.trim()) {
      newErrors.nid_number = 'NID number is required';
    } else if (!/^\d{10,17}$/.test(formData.nid_number)) {
      newErrors.nid_number = 'NID must be 10-17 digits';
    }
    if (!formData.designation_id) {
      newErrors.designation_id = 'Designation is required';
    }
    if (!formData.office_id) {
      newErrors.office_id = 'Office is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setLoading(true);
      const result = await employeeService.create(formData);
      toast.success('Employee created successfully');
      navigate(`/employees/${result.employee.id}`);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add New Employee"
        subtitle="Create a new employee record"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Employees', href: '/employees' },
          { label: 'Add Employee' },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <Card.Title>Basic Information</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={errors.first_name}
                  required
                  placeholder="Enter first name"
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name}
                  required
                  placeholder="Enter last name"
                />
                <Input
                  label="Name (Bangla)"
                  name="name_bn"
                  value={formData.name_bn}
                  onChange={handleChange}
                  placeholder="বাংলায় নাম"
                  className="font-bangla"
                />
                <Input
                  label="NID Number"
                  name="nid_number"
                  value={formData.nid_number}
                  onChange={handleChange}
                  error={errors.nid_number}
                  required
                  placeholder="Enter NID number"
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                />
                <DatePicker
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Personal Details */}
          <Card>
            <Card.Header>
              <Card.Title>Personal Details</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={GENDER_OPTIONS}
                  placeholder="Select gender"
                />
                <Select
                  label="Religion"
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  options={RELIGION_OPTIONS}
                  placeholder="Select religion"
                />
                <Select
                  label="Blood Group"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  options={BLOOD_GROUP_OPTIONS}
                  placeholder="Select blood group"
                />
                <Select
                  label="Marital Status"
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  options={MARITAL_STATUS_OPTIONS}
                  placeholder="Select marital status"
                />
                <Input
                  label="Place of Birth"
                  name="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={handleChange}
                  placeholder="Enter place of birth"
                />
                <Input
                  label="Height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="e.g., 5.8"
                />
                <Input
                  label="Passport Number"
                  name="passport"
                  value={formData.passport}
                  onChange={handleChange}
                  placeholder="Enter passport number"
                />
                <Input
                  label="Birth Registration No"
                  name="birth_reg"
                  value={formData.birth_reg}
                  onChange={handleChange}
                  placeholder="Enter birth registration number"
                />
              </div>
            </Card.Body>
          </Card>

          {/* Employment Information */}
          <Card>
            <Card.Header>
              <Card.Title>Employment Information</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Select
                  label="Designation"
                  name="designation_id"
                  value={formData.designation_id}
                  onChange={handleChange}
                  options={designations.map(d => ({ 
                    value: d.id, 
                    label: `${d.title} (Grade: ${d.grade})` 
                  }))}
                  error={errors.designation_id}
                  required
                  placeholder="Select designation"
                />
                <Select
                  label="Office"
                  name="office_id"
                  value={formData.office_id}
                  onChange={handleChange}
                  options={offices.map(o => ({ 
                    value: o.id, 
                    label: `${o.name} (${o.code})` 
                  }))}
                  error={errors.office_id}
                  required
                  placeholder="Select office"
                />
                <Select
                  label="Cadre / Non-cadre"
                  name="cadre_type"
                  value={formData.cadre_type}
                  onChange={handleChange}
                  options={CADRE_OPTIONS}
                  placeholder="Select if applicable"
                />
                <Input
                  label="Batch No. (if available)"
                  name="batch_no"
                  value={formData.batch_no}
                  onChange={handleChange}
                  placeholder="Enter batch number"
                />
                <DatePicker
                  label="Joining Date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleChange}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/employees')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Employee
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;