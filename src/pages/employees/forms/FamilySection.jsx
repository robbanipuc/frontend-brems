import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Input, Select, DatePicker, Button, Checkbox, Alert } from '@/components/common';
import { GENDER_OPTIONS } from '@/utils/constants';

const FamilySection = ({ data, onChange, employeeGender, maxSpouses }) => {
  const handleParentChange = (parent, field, value) => {
    onChange({
      ...data,
      [parent]: { ...data[parent], [field]: value },
    });
  };

  const handleSpouseChange = (index, field, value) => {
    const newSpouses = [...data.spouses];
    newSpouses[index] = { ...newSpouses[index], [field]: value };
    onChange({ ...data, spouses: newSpouses });
  };

  const addSpouse = () => {
    if (data.spouses.length >= maxSpouses) {
      return;
    }
    onChange({
      ...data,
      spouses: [
        ...data.spouses,
        { 
          name: '', 
          name_bn: '', 
          nid: '', 
          dob: '', 
          occupation: '', 
          is_alive: true, 
          is_active_marriage: true 
        },
      ],
    });
  };

  const removeSpouse = (index) => {
    const newSpouses = data.spouses.filter((_, i) => i !== index);
    onChange({ ...data, spouses: newSpouses });
  };

  const handleChildChange = (index, field, value) => {
    const newChildren = [...data.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    onChange({ ...data, children: newChildren });
  };

  const addChild = () => {
    onChange({
      ...data,
      children: [
        ...data.children,
        { 
          name: '', 
          name_bn: '', 
          gender: '', 
          dob: '', 
          is_alive: true 
        },
      ],
    });
  };

  const removeChild = (index) => {
    const newChildren = data.children.filter((_, i) => i !== index);
    onChange({ ...data, children: newChildren });
  };

  const activeSpouseCount = data.spouses.filter(s => s.is_active_marriage).length;
  const canAddMoreSpouses = data.spouses.length < maxSpouses;

  return (
    <div className="p-6 space-y-8">
      {/* Father */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Father's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Name"
            value={data.father.name}
            onChange={(e) => handleParentChange('father', 'name', e.target.value)}
            placeholder="Father's full name"
          />
          <Input
            label="Name (Bangla)"
            value={data.father.name_bn}
            onChange={(e) => handleParentChange('father', 'name_bn', e.target.value)}
            placeholder="বাবার নাম"
            className="font-bangla"
          />
          <Input
            label="NID"
            value={data.father.nid}
            onChange={(e) => handleParentChange('father', 'nid', e.target.value)}
            placeholder="NID number"
          />
          <DatePicker
            label="Date of Birth"
            value={data.father.dob}
            onChange={(e) => handleParentChange('father', 'dob', e.target.value)}
          />
          <Input
            label="Occupation"
            value={data.father.occupation}
            onChange={(e) => handleParentChange('father', 'occupation', e.target.value)}
            placeholder="e.g., Retired, Business"
          />
          <div className="flex items-center pt-7">
            <Checkbox
              label="Is Alive"
              checked={data.father.is_alive}
              onChange={(e) => handleParentChange('father', 'is_alive', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Mother */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mother's Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Name"
            value={data.mother.name}
            onChange={(e) => handleParentChange('mother', 'name', e.target.value)}
            placeholder="Mother's full name"
          />
          <Input
            label="Name (Bangla)"
            value={data.mother.name_bn}
            onChange={(e) => handleParentChange('mother', 'name_bn', e.target.value)}
            placeholder="মায়ের নাম"
            className="font-bangla"
          />
          <Input
            label="NID"
            value={data.mother.nid}
            onChange={(e) => handleParentChange('mother', 'nid', e.target.value)}
            placeholder="NID number"
          />
          <DatePicker
            label="Date of Birth"
            value={data.mother.dob}
            onChange={(e) => handleParentChange('mother', 'dob', e.target.value)}
          />
          <Input
            label="Occupation"
            value={data.mother.occupation}
            onChange={(e) => handleParentChange('mother', 'occupation', e.target.value)}
            placeholder="e.g., Housewife, Teacher"
          />
          <div className="flex items-center pt-7">
            <Checkbox
              label="Is Alive"
              checked={data.mother.is_alive}
              onChange={(e) => handleParentChange('mother', 'is_alive', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Spouses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Spouse Information</h3>
            <p className="text-sm text-gray-500">
              {activeSpouseCount} of {maxSpouses} active spouse(s) allowed
              {employeeGender === 'male' && maxSpouses > 1 && ' (as per Islamic law for male employees)'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={PlusIcon}
            onClick={addSpouse}
            disabled={!canAddMoreSpouses}
          >
            Add Spouse
          </Button>
        </div>

        {!canAddMoreSpouses && data.spouses.length > 0 && (
          <Alert variant="info" className="mb-4">
            Maximum number of spouses ({maxSpouses}) has been reached.
          </Alert>
        )}

        {data.spouses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No spouse information added</p>
            <Button
              variant="outline"
              size="sm"
              icon={PlusIcon}
              onClick={addSpouse}
              className="mt-2"
            >
              Add Spouse
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.spouses.map((spouse, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">
                    Spouse {index + 1}
                    {spouse.is_active_marriage && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Active Marriage
                      </span>
                    )}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={TrashIcon}
                    onClick={() => removeSpouse(index)}
                    className="text-red-500 hover:text-red-700"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    value={spouse.name}
                    onChange={(e) => handleSpouseChange(index, 'name', e.target.value)}
                    placeholder="Spouse's full name"
                  />
                  <Input
                    label="Name (Bangla)"
                    value={spouse.name_bn}
                    onChange={(e) => handleSpouseChange(index, 'name_bn', e.target.value)}
                    placeholder="স্বামী/স্ত্রীর নাম"
                    className="font-bangla"
                  />
                  <Input
                    label="NID"
                    value={spouse.nid}
                    onChange={(e) => handleSpouseChange(index, 'nid', e.target.value)}
                    placeholder="NID number"
                  />
                  <DatePicker
                    label="Date of Birth"
                    value={spouse.dob}
                    onChange={(e) => handleSpouseChange(index, 'dob', e.target.value)}
                  />
                  <Input
                    label="Occupation"
                    value={spouse.occupation}
                    onChange={(e) => handleSpouseChange(index, 'occupation', e.target.value)}
                    placeholder="e.g., Housewife, Teacher"
                  />
                  <div className="flex items-center gap-6 pt-7">
                    <Checkbox
                      label="Alive"
                      checked={spouse.is_alive}
                      onChange={(e) => handleSpouseChange(index, 'is_alive', e.target.checked)}
                    />
                    <Checkbox
                      label="Active Marriage"
                      checked={spouse.is_active_marriage}
                      onChange={(e) => handleSpouseChange(index, 'is_active_marriage', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Children */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Children Information</h3>
            <p className="text-sm text-gray-500">
              {data.children.length} child(ren) added
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={PlusIcon}
            onClick={addChild}
          >
            Add Child
          </Button>
        </div>

        {data.children.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No children information added</p>
            <Button
              variant="outline"
              size="sm"
              icon={PlusIcon}
              onClick={addChild}
              className="mt-2"
            >
              Add Child
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {data.children.map((child, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-900">Child {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={TrashIcon}
                    onClick={() => removeChild(index)}
                    className="text-red-500 hover:text-red-700"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input
                    label="Name"
                    value={child.name}
                    onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                    placeholder="Child's full name"
                    required
                  />
                  <Input
                    label="Name (Bangla)"
                    value={child.name_bn}
                    onChange={(e) => handleChildChange(index, 'name_bn', e.target.value)}
                    placeholder="সন্তানের নাম"
                    className="font-bangla"
                  />
                  <Select
                    label="Gender"
                    value={child.gender}
                    onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                    ]}
                    placeholder="Select gender"
                    required
                  />
                  <DatePicker
                    label="Date of Birth"
                    value={child.dob}
                    onChange={(e) => handleChildChange(index, 'dob', e.target.value)}
                  />
                  <div className="flex items-center pt-7">
                    <Checkbox
                      label="Is Alive"
                      checked={child.is_alive}
                      onChange={(e) => handleChildChange(index, 'is_alive', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilySection;