import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { formService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Table,
  Alert,
  EmptyState,
} from '@/components/common';
import { SUBMISSION_STATUS_COLORS } from '@/utils/constants';
import { formatDate, getErrorMessage } from '@/utils/helpers';

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMySubmissions();
  }, []);

  const fetchMySubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formService.getMySubmissions();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (_, row) => (
        <span className='font-medium text-gray-900'>#{row.id}</span>
      ),
    },
    {
      key: 'form',
      header: 'Form',
      render: (_, row) => row.form?.title ?? '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => (
        <Badge
          className={
            SUBMISSION_STATUS_COLORS[row.status] || 'bg-gray-100 text-gray-800'
          }
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Submitted',
      render: (_, row) => formatDate(row.created_at),
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='My Submissions'
        subtitle='View your form submissions'
        breadcrumbs={[
          { label: 'Forms', href: '/forms' },
          { label: 'My Submissions' },
        ]}
      />

      {error && (
        <Alert variant='error' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        {loading ? (
          <div className='p-12 text-center text-gray-500'>
            Loading your submissions...
          </div>
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={ClipboardDocumentListIcon}
            title='No submissions yet'
            description='You have not submitted any forms yet.'
            action={
              <Link to='/forms'>
                <Button>Browse Forms</Button>
              </Link>
            }
          />
        ) : (
          <Table columns={columns} data={submissions} />
        )}
      </Card>
    </div>
  );
};

export default MySubmissions;
