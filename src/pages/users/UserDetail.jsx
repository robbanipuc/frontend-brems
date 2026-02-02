import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  UserCircleIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  KeyIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { userService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Avatar,
  Alert,
  LoadingScreen,
} from '@/components/common';
import { ROLE_LABELS, ROLE_COLORS } from '@/utils/constants';
import { getFullName, formatDate, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const permissions = usePermissions();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getById(id);
      setUser(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    const newPass = prompt('Enter new password (min 6 characters):');
    if (newPass && newPass.length >= 6) {
      setActionLoading(true);
      userService
        .resetPassword(id, newPass)
        .then(() => {
          toast.success('Password reset successfully');
        })
        .catch((err) => toast.error(getErrorMessage(err)))
        .finally(() => setActionLoading(false));
    } else if (newPass !== null) {
      toast.error('Password must be at least 6 characters');
    }
  };

  const handleToggleActive = async () => {
    try {
      setActionLoading(true);
      await userService.toggleActive(id);
      toast.success(user?.is_active ? 'User deactivated' : 'User activated');
      fetchUser();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const isSelf = currentUser?.id === parseInt(id, 10);

  if (loading) {
    return <LoadingScreen message='Loading user...' />;
  }

  if (error || !user) {
    return (
      <div className='p-8'>
        <Alert variant='error' title='Error'>
          {error || 'User not found'}
        </Alert>
        <Button
          className='mt-4'
          onClick={() => navigate('/users')}
          icon={ArrowLeftIcon}
        >
          Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={user.name}
        subtitle={user.email}
        breadcrumbs={[{ label: 'Users', href: '/users' }, { label: user.name }]}
        actions={
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => navigate('/users')}
              icon={ArrowLeftIcon}
            >
              Back
            </Button>
            {!isSelf && permissions.canEditUser && (
              <>
                <Button
                  variant='outline'
                  icon={KeyIcon}
                  onClick={handleResetPassword}
                  loading={actionLoading}
                >
                  Reset Password
                </Button>
                <Button
                  variant={user.is_active ? 'error' : 'primary'}
                  icon={NoSymbolIcon}
                  onClick={handleToggleActive}
                  loading={actionLoading}
                >
                  {user.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-1'>
          <div className='flex flex-col items-center p-6'>
            <Avatar name={user.name} size='xl' />
            <h2 className='mt-4 text-lg font-semibold text-gray-900'>
              {user.name}
            </h2>
            <p className='text-sm text-gray-500'>{user.email}</p>
            <Badge
              className={`mt-2 ${
                ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {ROLE_LABELS[user.role] || user.role}
            </Badge>
            <Badge
              variant={user.is_active ? 'success' : 'error'}
              className='mt-2'
            >
              {user.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </Card>

        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <h3 className='text-sm font-medium text-gray-500 mb-4'>Details</h3>
            <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <dt className='text-sm text-gray-500'>Name</dt>
                <dd className='mt-1 font-medium text-gray-900'>{user.name}</dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Email</dt>
                <dd className='mt-1 text-gray-900'>{user.email}</dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Role</dt>
                <dd className='mt-1'>
                  <Badge
                    className={
                      ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-800'
                    }
                  >
                    {ROLE_LABELS[user.role] || user.role}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Office</dt>
                <dd className='mt-1 text-gray-900'>
                  {user.office ? (
                    <Link
                      to={`/offices/${user.office.id}`}
                      className='text-primary-600 hover:underline'
                    >
                      {user.office.name}
                    </Link>
                  ) : (
                    '-'
                  )}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Linked Employee</dt>
                <dd className='mt-1 text-gray-900'>
                  {user.employee ? (
                    <Link
                      to={`/employees/${user.employee.id}`}
                      className='text-primary-600 hover:underline'
                    >
                      {getFullName(
                        user.employee.first_name,
                        user.employee.last_name
                      )}
                      {user.employee.designation &&
                        ` (${user.employee.designation.title})`}
                    </Link>
                  ) : (
                    '-'
                  )}
                </dd>
              </div>
              <div>
                <dt className='text-sm text-gray-500'>Status</dt>
                <dd className='mt-1'>
                  <Badge variant={user.is_active ? 'success' : 'error'}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
