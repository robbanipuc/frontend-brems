import { useState } from 'react';
import { Input, Select, Checkbox } from '@/components/common';
import { DIVISIONS } from '@/utils/constants';

const AddressSection = ({ data, onChange }) => {
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const handleAddressChange = (type, field, value) => {
    const newAddresses = {
      ...data,
      [type]: { ...data[type], [field]: value },
    };

    // If same as permanent is checked and we're editing permanent, copy to present
    if (sameAsPermanent && type === 'permanent') {
      newAddresses.present = { ...newAddresses.permanent };
    }

    onChange(newAddresses);
  };

  const handleSameAsPermanent = (checked) => {
    setSameAsPermanent(checked);
    if (checked) {
      onChange({
        ...data,
        present: { ...data.permanent },
      });
    }
  };

  const divisionOptions = DIVISIONS.map(d => ({ value: d, label: d }));

  const AddressFields = ({ type, label, disabled = false }) => (
    <div>
      <h4 className="font-medium text-gray-900 mb-4">{label}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Select
          label="Division"
          value={data[type].division}
          onChange={(e) => handleAddressChange(type, 'division', e.target.value)}
          options={divisionOptions}
          placeholder="Select division"
          disabled={disabled}
        />
        <Input
          label="District"
          value={data[type].district}
          onChange={(e) => handleAddressChange(type, 'district', e.target.value)}
          placeholder="e.g., Dhaka"
          disabled={disabled}
        />
        <Input
          label="Upazila/Thana"
          value={data[type].upazila}
          onChange={(e) => handleAddressChange(type, 'upazila', e.target.value)}
          placeholder="e.g., Dhanmondi"
          disabled={disabled}
        />
        <Input
          label="Post Office"
          value={data[type].post_office}
          onChange={(e) => handleAddressChange(type, 'post_office', e.target.value)}
          placeholder="e.g., Dhanmondi"
          disabled={disabled}
        />
        <Input
          label="House No / Road"
          value={data[type].house_no}
          onChange={(e) => handleAddressChange(type, 'house_no', e.target.value)}
          placeholder="e.g., House 10, Road 5"
          disabled={disabled}
        />
        <Input
          label="Village / Area"
          value={data[type].village_road}
          onChange={(e) => handleAddressChange(type, 'village_road', e.target.value)}
          placeholder="e.g., Mirpur DOHS"
          disabled={disabled}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8">
      <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>

      {/* Permanent Address */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <AddressFields type="permanent" label="Permanent Address" />
      </div>

      {/* Same as Permanent Checkbox */}
      <div className="flex items-center">
        <Checkbox
          label="Present address is same as permanent address"
          checked={sameAsPermanent}
          onChange={(e) => handleSameAsPermanent(e.target.checked)}
        />
      </div>

      {/* Present Address */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <AddressFields 
          type="present" 
          label="Present Address" 
          disabled={sameAsPermanent}
        />
      </div>
    </div>
  );
};

export default AddressSection;