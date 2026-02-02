import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import authService from '@/services/authService';
import { PageHeader, Card, Button, Input, Alert } from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.new_password_confirmation) {
      toast.error('New passwords do not match');
      return;
    }
    if (formData.new_password.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await authService.changePassword(
        formData.current_password,
        formData.new_password,
        formData.new_password_confirmation
      );
      toast.success('Password changed successfully');
      navigate('/settings');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Change Password'
        subtitle='Update your account password'
        breadcrumbs={[
          { label: 'Settings', href: '/settings' },
          { label: 'Change Password' },
        ]}
        actions={
          <Button
            variant='outline'
            onClick={() => navigate('/settings')}
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

      <Card className='max-w-md p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Current password *
            </label>
            <Input
              type='password'
              value={formData.current_password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  current_password: e.target.value,
                }))
              }
              placeholder='Enter current password'
              required
              autoComplete='current-password'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              New password *
            </label>
            <Input
              type='password'
              value={formData.new_password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  new_password: e.target.value,
                }))
              }
              placeholder='At least 6 characters'
              required
              minLength={6}
              autoComplete='new-password'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Confirm new password *
            </label>
            <Input
              type='password'
              value={formData.new_password_confirmation}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  new_password_confirmation: e.target.value,
                }))
              }
              placeholder='Confirm new password'
              required
              minLength={6}
              autoComplete='new-password'
            />
          </div>
          <div className='flex gap-3 pt-2'>
            <Button type='submit' loading={submitting}>
              Change Password
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/settings')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
