import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { profileRequestService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Textarea,
  Alert,
} from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const REQUEST_TYPES = [
  'Personal Information Update',
  'Address Update',
  'Family Information Update',
  'Academic Record Update',
  'Document Update',
  'Other',
];

const SubmitRequest = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    request_type: '',
    details: '',
    proposed_changes: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.request_type) {
      toast.error('Please select a request type');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await profileRequestService.submit(
        {
          request_type: formData.request_type,
          details: formData.details,
          proposed_changes: formData.proposed_changes,
        },
        {}
      );
      toast.success('Request submitted successfully');
      navigate('/my-requests');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Submit Profile Request'
        subtitle='Request changes to your profile information'
        breadcrumbs={[
          { label: 'My Requests', href: '/my-requests' },
          { label: 'Submit Request' },
        ]}
        actions={
          <Button
            variant='outline'
            onClick={() => navigate('/my-requests')}
            icon={ArrowLeftIcon}
          >
            Back
          </Button>
        }
      />

      {error && (
        <Alert variant='error' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card className='max-w-2xl'>
        <form onSubmit={handleSubmit} className='space-y-6 p-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Request type *
            </label>
            <select
              value={formData.request_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  request_type: e.target.value,
                }))
              }
              className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-primary-500 focus:border-primary-500'
              required
            >
              <option value=''>Select type</option>
              {REQUEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Details
            </label>
            <Textarea
              value={formData.details}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, details: e.target.value }))
              }
              placeholder='Describe the changes you are requesting...'
              rows={5}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Proposed changes (JSON, optional)
            </label>
            <Textarea
              value={
                typeof formData.proposed_changes === 'object'
                  ? JSON.stringify(formData.proposed_changes, null, 2)
                  : formData.proposed_changes
              }
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value || '{}');
                  setFormData((prev) => ({
                    ...prev,
                    proposed_changes: parsed,
                  }));
                } catch {
                  setFormData((prev) => ({ ...prev, proposed_changes: {} }));
                }
              }}
              placeholder='{"personal_info": {"phone": "..."}}'
              rows={6}
              className='font-mono text-sm'
            />
            <p className='mt-1 text-xs text-gray-500'>
              Leave as empty object if you only described changes in Details.
              For file uploads, use the full request form in employee profile.
            </p>
          </div>

          <div className='flex gap-3'>
            <Button type='submit' icon={PaperAirplaneIcon} loading={submitting}>
              Submit Request
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/my-requests')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SubmitRequest;
