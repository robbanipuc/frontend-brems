import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  UserGroupIcon,
  KeyIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { userService, officeService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Table,
  Avatar,
  SearchInput,
  Select,
  Alert,
  EmptyState,
  ConfirmModal,
} from '@/components/common';
import { ROLE_LABELS, ROLE_COLORS } from '@/utils/constants';
import { getFullName, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const UserList = () => {
  const { user: currentUser } = useAuth();
  const permissions = usePermissions();
  const [users, setUsers] = useState([]);
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [officeFilter, setOfficeFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [resetModal, setResetModal] = useState({ open: false, user: null });
  const [toggleModal, setToggleModal] = useState({ open: false, user: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOffices();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, officeFilter, activeFilter]);

  const fetchOffices = async () => {
    try {
      const data = await officeService.getTree();
      setOffices(data);
    } catch (err) {
      console.error('Failed to load offices', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (officeFilter) params.office_id = officeFilter;
      if (activeFilter !== '') params.is_active = activeFilter === 'true';
      const data = await userService.getAll(params);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (newPassword) => {
    if (!resetModal.user) return;
    try {
      setActionLoading(true);
      await userService.resetPassword(resetModal.user.id, newPassword);
      toast.success('Password reset successfully');
      setResetModal({ open: false, user: null });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (!toggleModal.user) return;
    try {
      setActionLoading(true);
      await userService.toggleActive(toggleModal.user.id);
      toast.success(
        toggleModal.user.is_active ? 'User deactivated' : 'User activated'
      );
      setToggleModal({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const flattenOffices = (items, list = []) => {
    items?.forEach((o) => {
      list.push({ id: o.id, name: o.name, code: o.code });
      if (o.children?.length) flattenOffices(o.children, list);
    });
    return list;
  };

  const officeList = flattenOffices(offices);

  const columns = [
    {
      key: 'user',
      header: 'User',
      render: (_, row) => (
        <div className='flex items-center gap-3'>
          <Avatar name={row.name} size='sm' />
          <div>
            <Link
              to={`/users/${row.id}`}
              className='font-medium text-gray-900 hover:text-primary-600'
            >
              {row.name}
            </Link>
            <p className='text-sm text-gray-500'>{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (_, row) => (
        <Badge className={ROLE_COLORS[row.role] || 'bg-gray-100 text-gray-800'}>
          {ROLE_LABELS[row.role] || row.role}
        </Badge>
      ),
    },
    {
      key: 'office',
      header: 'Office',
      render: (_, row) => row.office?.name || '-',
    },
    {
      key: 'employee',
      header: 'Employee',
      render: (_, row) =>
        row.employee
          ? getFullName(row.employee.first_name, row.employee.last_name)
          : '-',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (_, row) => (
        <Badge variant={row.is_active ? 'success' : 'error'}>
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className='flex items-center gap-1'>
          <Link to={`/users/${row.id}`}>
            <Button variant='ghost' size='sm' iconOnly icon={EyeIcon} />
          </Link>
          {row.id !== currentUser?.id && permissions.canEditUser && (
            <>
              <Button
                variant='ghost'
                size='sm'
                iconOnly
                icon={KeyIcon}
                onClick={() => setResetModal({ open: true, user: row })}
              />
              <Button
                variant='ghost'
                size='sm'
                iconOnly
                icon={NoSymbolIcon}
                onClick={() => setToggleModal({ open: true, user: row })}
              />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Users'
        subtitle='Manage system users and roles'
        actions={
          permissions.canCreateUser ? (
            <Button
              icon={PlusIcon}
              disabled
              title='User creation can be added later'
            >
              Add User
            </Button>
          ) : null
        }
      />

      <Card>
        <div className='p-4 border-b border-gray-200 space-y-4'>
          <div className='flex flex-wrap gap-4'>
            <SearchInput
              placeholder='Search by name or email...'
              value={search}
              onChange={setSearch}
              className='max-w-xs'
            />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className='w-40'
              placeholder='All roles'
              options={[
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'office_admin', label: 'Office Admin' },
                { value: 'verified_user', label: 'Verified User' },
              ]}
            />
            <Select
              value={officeFilter === '' ? '' : String(officeFilter)}
              onChange={(e) => setOfficeFilter(e.target.value)}
              className='w-48'
              placeholder='All offices'
              options={officeList.map((o) => ({
                value: String(o.id),
                label: o.name,
              }))}
            />
            <Select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className='w-32'
              placeholder='All'
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
            />
          </div>
        </div>

        {error && (
          <div className='p-4'>
            <Alert variant='error' onDismiss={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {loading ? (
          <div className='p-12 text-center text-gray-500'>Loading users...</div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={UserGroupIcon}
            title='No users found'
            description='Try adjusting your filters or add a new user.'
          />
        ) : (
          <Table columns={columns} data={users} />
        )}
      </Card>

      <ConfirmModal
        isOpen={toggleModal.open}
        onClose={() => setToggleModal({ open: false, user: null })}
        title={
          toggleModal.user?.is_active ? 'Deactivate user?' : 'Activate user?'
        }
        message={
          toggleModal.user?.is_active
            ? `Deactivating ${toggleModal.user?.name} will revoke their access.`
            : `Activate ${toggleModal.user?.name} to allow login again.`
        }
        confirmText={toggleModal.user?.is_active ? 'Deactivate' : 'Activate'}
        variant='danger'
        onConfirm={handleToggleActive}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={resetModal.open}
        onClose={() => setResetModal({ open: false, user: null })}
        title='Reset password'
        message={`Reset password for ${resetModal.user?.name}. They will need to use the new password on next login.`}
        confirmText='Reset'
        onConfirm={() => {
          const newPass = prompt('Enter new password (min 6 characters):');
          if (newPass && newPass.length >= 6) {
            handleResetPassword(newPass);
          } else if (newPass !== null) {
            toast.error('Password must be at least 6 characters');
          }
        }}
        loading={actionLoading}
      />
    </div>
  );
};

export default UserList;
