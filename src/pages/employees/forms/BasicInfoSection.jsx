import { Input, Select, DatePicker } from '@/components/common';
import {
  GENDER_OPTIONS,
  RELIGION_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  CADRE_OPTIONS,
} from '@/utils/constants';

const BasicInfoSection = ({ data, onChange, errors }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            label="First Name"
            name="first_name"
            value={data.first_name}
            onChange={onChange}
            error={errors?.first_name}
            required
          />
          <Input
            label="Last Name"
            name="last_name"
            value={data.last_name}
            onChange={onChange}
            error={errors?.last_name}
            required
          />
          <Input
            label="Name (Bangla)"
            name="name_bn"
            value={data.name_bn}
            onChange={onChange}
            className="font-bangla"
          />
          <Input
            label="NID Number"
            name="nid_number"
            value={data.nid_number}
            onChange={onChange}
            error={errors?.nid_number}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={data.phone}
            onChange={onChange}
          />
          <DatePicker
            label="Date of Birth"
            name="dob"
            value={data.dob}
            onChange={onChange}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select
            label="Gender"
            name="gender"
            value={data.gender}
            onChange={onChange}
            options={GENDER_OPTIONS}
          />
          <Select
            label="Religion"
            name="religion"
            value={data.religion}
            onChange={onChange}
            options={RELIGION_OPTIONS}
          />
          <Select
            label="Blood Group"
            name="blood_group"
            value={data.blood_group}
            onChange={onChange}
            options={BLOOD_GROUP_OPTIONS}
          />
          <Select
            label="Marital Status"
            name="marital_status"
            value={data.marital_status}
            onChange={onChange}
            options={MARITAL_STATUS_OPTIONS}
          />
          <Input
            label="Place of Birth"
            name="place_of_birth"
            value={data.place_of_birth}
            onChange={onChange}
          />
          <Input
            label="Height"
            name="height"
            value={data.height}
            onChange={onChange}
          />
          <Input
            label="Passport Number"
            name="passport"
            value={data.passport}
            onChange={onChange}
          />
          <Input
            label="Birth Registration No"
            name="birth_reg"
            value={data.birth_reg}
            onChange={onChange}
          />
          <Select
            label="Cadre / Non-cadre"
            name="cadre_type"
            value={data.cadre_type}
            onChange={onChange}
            options={CADRE_OPTIONS}
            placeholder="Select if applicable"
          />
          <Input
            label="Batch No. (if available)"
            name="batch_no"
            value={data.batch_no}
            onChange={onChange}
            placeholder="Enter batch number"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;