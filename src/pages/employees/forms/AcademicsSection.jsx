import { useState } from 'react';
import { Input, Select, Button } from '@/components/common';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { EXAM_NAMES } from '@/utils/constants';

const AcademicsSection = ({ data = [], onChange }) => {
  const addRecord = () => {
    onChange([
      ...(Array.isArray(data) ? data : []),
      { exam_name: '', institute: '', passing_year: '', result: '' },
    ]);
  };

  const updateRecord = (index, field, value) => {
    const list = [...(Array.isArray(data) ? data : [])];
    list[index] = { ...list[index], [field]: value };
    onChange(list);
  };

  const removeRecord = (index) => {
    const list = [...(Array.isArray(data) ? data : [])];
    list.splice(index, 1);
    onChange(list);
  };

  const list = Array.isArray(data) ? data : [];

  return (
    <div className='p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Academic Qualifications
        </h3>
        <Button
          type='button'
          variant='outline'
          size='sm'
          icon={PlusIcon}
          onClick={addRecord}
        >
          Add
        </Button>
      </div>
      <div className='space-y-4'>
        {list.map((record, index) => (
          <div
            key={index}
            className='p-4 border border-gray-200 rounded-lg space-y-4'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Select
                label='Exam'
                value={record.exam_name}
                onChange={(e) =>
                  updateRecord(index, 'exam_name', e.target.value)
                }
                options={EXAM_NAMES}
                placeholder='Select exam'
              />
              <Input
                label='Institute'
                value={record.institute}
                onChange={(e) =>
                  updateRecord(index, 'institute', e.target.value)
                }
                placeholder='Institute name'
              />
              <Input
                label='Passing Year'
                value={record.passing_year}
                onChange={(e) =>
                  updateRecord(index, 'passing_year', e.target.value)
                }
                placeholder='e.g., 2010'
              />
              <Input
                label='Result'
                value={record.result}
                onChange={(e) => updateRecord(index, 'result', e.target.value)}
                placeholder='e.g., GPA 5.00'
              />
            </div>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              icon={TrashIcon}
              onClick={() => removeRecord(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicsSection;
