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
import { useLanguage } from '@/context/LanguageContext';
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
  const { t } = useLanguage();
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
  }, []);

  useEffect(() => {
    if (formData.office_id) {
      fetchDesignationsByOffice(formData.office_id);
    } else {
      setDesignations([]);
    }
  }, [formData.office_id]);

  const fetchOffices = async () => {
    try {
      const data = await officeService.getManaged();
      setOffices(data);
    } catch (err) {
      console.error('Failed to fetch offices:', err);
    }
  };

  const fetchDesignationsByOffice = async (officeId) => {
    if (!officeId) return;
    try {
      const data = await designationService.getAll({ office_id: officeId });
      setDesignations(data);
    } catch (err) {
      console.error('Failed to fetch designations:', err);
      setDesignations([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // When office changes, clear designation so user must pick one valid for the new office
      if (name === 'office_id') {
        next.designation_id = '';
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = t('employee.firstNameRequired');
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = t('employee.lastNameRequired');
    }
    if (!formData.nid_number.trim()) {
      newErrors.nid_number = t('employee.nidRequired');
    } else if (!/^\d{10,17}$/.test(formData.nid_number)) {
      newErrors.nid_number = t('employee.nidInvalid');
    }
    if (!formData.designation_id) {
      newErrors.designation_id = t('employee.designationRequired');
    }
    if (!formData.office_id) {
      newErrors.office_id = t('employee.officeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('employee.fixErrors'));
      return;
    }

    try {
      setLoading(true);
      const result = await employeeService.create(formData);
      toast.success(t('employee.createdSuccess'));
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
        title={t('employee.addNew')}
        subtitle={t('employee.createNewRecord')}
        breadcrumbs={[
          { label: t('nav.Dashboard'), href: '/dashboard' },
          { label: t('nav.Employees'), href: '/employees' },
          { label: t('nav.Add Employee') },
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <Card.Header>
              <Card.Title>{t('employee.basicInfo')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Input
                  label={t('employee.firstName')}
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={errors.first_name}
                  required
                  placeholder={t('employee.enterFirstName')}
                />
                <Input
                  label={t('employee.lastName')}
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name}
                  required
                  placeholder={t('employee.enterLastName')}
                />
                <Input
                  label={t('employee.nameBangla')}
                  name="name_bn"
                  value={formData.name_bn}
                  onChange={handleChange}
                  placeholder={t('employee.nameBanglaPlaceholder')}
                  className="font-bangla"
                />
                <Input
                  label={t('employee.nidNumber')}
                  name="nid_number"
                  value={formData.nid_number}
                  onChange={handleChange}
                  error={errors.nid_number}
                  required
                  placeholder={t('employee.enterNid')}
                />
                <Input
                  label={t('employee.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                />
                <DatePicker
                  label={t('employee.dateOfBirth')}
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
              <Card.Title>{t('employee.personalDetails')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Select
                  label={t('employee.gender')}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={GENDER_OPTIONS}
                  placeholder={t('employee.selectGender')}
                />
                <Select
                  label={t('employee.religion')}
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  options={RELIGION_OPTIONS}
                  placeholder={t('employee.selectReligion')}
                />
                <Select
                  label={t('employee.bloodGroup')}
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  options={BLOOD_GROUP_OPTIONS}
                  placeholder={t('employee.selectBloodGroup')}
                />
                <Select
                  label={t('employee.maritalStatus')}
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  options={MARITAL_STATUS_OPTIONS}
                  placeholder={t('employee.selectMaritalStatus')}
                />
                <Input
                  label={t('employee.placeOfBirth')}
                  name="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={handleChange}
                  placeholder={t('employee.enterPlaceOfBirth')}
                />
                <Input
                  label={t('employee.height')}
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder={t('employee.heightPlaceholder')}
                />
                <Input
                  label={t('employee.passportNumber')}
                  name="passport"
                  value={formData.passport}
                  onChange={handleChange}
                  placeholder={t('employee.enterPassport')}
                />
                <Input
                  label={t('employee.birthRegNo')}
                  name="birth_reg"
                  value={formData.birth_reg}
                  onChange={handleChange}
                  placeholder={t('employee.enterBirthReg')}
                />
              </div>
            </Card.Body>
          </Card>

          {/* Employment Information */}
          <Card>
            <Card.Header>
              <Card.Title>{t('employee.employmentInfo')}</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Select
                  label={`${t('employee.office')} *`}
                  name="office_id"
                  value={formData.office_id}
                  onChange={handleChange}
                  options={offices.map(o => ({ 
                    value: o.id, 
                    label: `${o.name} (${o.code})` 
                  }))}
                  error={errors.office_id}
                  required
                  placeholder={t('employee.selectOfficeFirst')}
                />
                <Select
                  label={`${t('employee.designation')} *`}
                  name="designation_id"
                  value={formData.designation_id}
                  onChange={handleChange}
                  options={designations.map(d => ({ 
                    value: d.id, 
                    label: `${d.title} (Grade: ${d.grade})` 
                  }))}
                  error={errors.designation_id}
                  required
                  placeholder={formData.office_id ? t('employee.selectDesignation') : t('employee.selectOfficeFirst')}
                  disabled={!formData.office_id}
                />
                <Select
                  label={t('employee.cadreNonCadre')}
                  name="cadre_type"
                  value={formData.cadre_type}
                  onChange={handleChange}
                  options={CADRE_OPTIONS}
                  placeholder={t('employee.selectIfApplicable')}
                />
                <Input
                  label={t('employee.batchNo')}
                  name="batch_no"
                  value={formData.batch_no}
                  onChange={handleChange}
                  placeholder={t('employee.enterBatchNumber')}
                />
                <DatePicker
                  label={t('employee.joiningDate')}
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
              {t('common.Cancel')}
            </Button>
            <Button type="submit" loading={loading}>
              {t('employee.createEmployee')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;