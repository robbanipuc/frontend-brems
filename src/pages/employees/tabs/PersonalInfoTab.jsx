import { Card } from '@/components/common';
import { formatDate } from '@/utils/helpers';

const InfoRow = ({ label, value, className = '' }) => (
  <div className={`py-3 sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
      {value || '-'}
    </dd>
  </div>
);

const PersonalInfoTab = ({ employee }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
      
      <dl className="divide-y divide-gray-200">
        <InfoRow label="Full Name (English)" value={`${employee.first_name} ${employee.last_name}`} />
        <InfoRow label="Full Name (Bangla)" value={employee.name_bn} />
        <InfoRow label="NID Number" value={employee.nid_number} />
        <InfoRow label="Date of Birth" value={formatDate(employee.dob)} />
        <InfoRow label="Gender" value={employee.gender ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1) : '-'} />
        <InfoRow label="Religion" value={employee.religion} />
        <InfoRow label="Blood Group" value={employee.blood_group} />
        <InfoRow label="Marital Status" value={employee.marital_status} />
        <InfoRow label="Phone" value={employee.phone} />
        <InfoRow label="Place of Birth" value={employee.place_of_birth} />
        <InfoRow label="Height" value={employee.height} />
        <InfoRow label="Passport Number" value={employee.passport} />
        <InfoRow label="Birth Registration No" value={employee.birth_reg} />
      </dl>
    </div>
  );
};

export default PersonalInfoTab;