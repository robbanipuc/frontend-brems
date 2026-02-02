import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  EyeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { profileRequestService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Table,
  Alert,
  EmptyState,
} from '@/components/common';
import { formatDate, getErrorMessage } from '@/utils/helpers';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileRequestService.getMyRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (_, row) => (
        <Link
          to={`/profile-requests/${row.id}`}
          className='font-medium text-primary-600 hover:underline'
        >
          #{row.id}
        </Link>
      ),
    },
    {
      key: 'request_type',
      header: 'Type',
      render: (_, row) => row.request_type || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => (
        <Badge
          variant={
            row.status === 'pending'
              ? 'warning'
              : row.is_approved
              ? 'success'
              : 'error'
          }
        >
          {row.status === 'pending'
            ? 'Pending'
            : row.is_approved
            ? 'Approved'
            : 'Rejected'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Submitted',
      render: (_, row) => formatDate(row.created_at),
    },
    {
      key: 'actions',
      header: '',
      render: (_, row) => (
        <Link to={`/profile-requests/${row.id}`}>
          <Button variant='ghost' size='sm' iconOnly icon={EyeIcon} />
        </Link>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='My Profile Requests'
        subtitle='View and track your profile update requests'
        actions={
          <Link to='/submit-request'>
            <Button icon={PlusIcon}>Submit Request</Button>
          </Link>
        }
      />

      {error && (
        <Alert variant='error' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        {loading ? (
          <div className='p-12 text-center text-gray-500'>
            Loading your requests...
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={DocumentTextIcon}
            title='No requests yet'
            description='Submit a profile update request to get started.'
            actions={
              <Link to='/submit-request'>
                <Button icon={PlusIcon}>Submit Request</Button>
              </Link>
            }
          />
        ) : (
          <Table columns={columns} data={requests} />
        )}
      </Card>
    </div>
  );
};

export default MyRequests;
