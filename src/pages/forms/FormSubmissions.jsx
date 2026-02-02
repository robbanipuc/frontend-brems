import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { formService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Table,
  Select,
  Alert,
  EmptyState,
  Pagination,
} from '@/components/common';
import { SUBMISSION_STATUS_COLORS, DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { formatDate, getFullName, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const FormSubmissions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [submissions, setSubmissions] = useState([]);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get('status') || ''
  );
  const [formFilter, setFormFilter] = useState(
    searchParams.get('form_id') || ''
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: DEFAULT_PAGE_SIZE,
    current_page: 1,
    last_page: 1,
  });
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [page, statusFilter, formFilter]);

  const fetchForms = async () => {
    try {
      const data = await formService.getAll();
      setForms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load forms', err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { page, per_page: DEFAULT_PAGE_SIZE };
      if (statusFilter) params.status = statusFilter;
      if (formFilter) params.form_id = formFilter;
      const data = await formService.getSubmissions(params);
      const list = data.data ?? data;
      setSubmissions(Array.isArray(list) ? list : []);
      setPagination({
        total: data.total ?? list?.length ?? 0,
        per_page: data.per_page ?? DEFAULT_PAGE_SIZE,
        current_page: data.current_page ?? 1,
        last_page: data.last_page ?? 1,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (submissionId, status) => {
    try {
      setUpdating(submissionId);
      await formService.updateSubmissionStatus(submissionId, status);
      toast.success('Status updated');
      fetchSubmissions();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdating(null);
    }
  };

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === '' || v == null) next.delete(k);
      else next.set(k, String(v));
    });
    setSearchParams(next);
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
      key: 'employee',
      header: 'Employee',
      render: (_, row) =>
        row.employee
          ? getFullName(row.employee.first_name, row.employee.last_name)
          : '-',
    },
    {
      key: 'office',
      header: 'Office',
      render: (_, row) => row.employee?.office?.name ?? '-',
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
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className='flex items-center gap-1'>
          {row.status === 'pending' && (
            <>
              <Button
                variant='ghost'
                size='sm'
                icon={CheckIcon}
                onClick={() => updateStatus(row.id, 'approved')}
                loading={updating === row.id}
              />
              <Button
                variant='ghost'
                size='sm'
                icon={XMarkIcon}
                onClick={() => updateStatus(row.id, 'rejected')}
                loading={updating === row.id}
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
        title='Form Submissions'
        subtitle='Review and process form submissions'
        breadcrumbs={[
          { label: 'Forms', href: '/forms' },
          { label: 'Submissions' },
        ]}
      />

      <Card>
        <div className='p-4 border-b border-gray-200 flex flex-wrap gap-4'>
          <Select
            value={formFilter}
            onChange={(e) => {
              setFormFilter(e.target.value);
              setPage(1);
              updateParams({ form_id: e.target.value, page: '1' });
            }}
            className='w-48'
          >
            <option value=''>All forms</option>
            {forms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title}
              </option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
              updateParams({ status: e.target.value, page: '1' });
            }}
            className='w-40'
          >
            <option value=''>All statuses</option>
            <option value='pending'>Pending</option>
            <option value='approved'>Approved</option>
            <option value='rejected'>Rejected</option>
          </Select>
        </div>

        {error && (
          <div className='p-4'>
            <Alert variant='error' onDismiss={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {loading ? (
          <div className='p-12 text-center text-gray-500'>
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={ClipboardDocumentListIcon}
            title='No submissions'
            description='There are no form submissions to display.'
          />
        ) : (
          <>
            <Table columns={columns} data={submissions} />
            {pagination.last_page > 1 && (
              <div className='p-4 border-t border-gray-200'>
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.last_page}
                  onPageChange={(p) => {
                    setPage(p);
                    updateParams({ page: String(p) });
                  }}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default FormSubmissions;
