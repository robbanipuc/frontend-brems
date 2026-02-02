import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentCheckIcon,
  CheckIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { profileRequestService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Alert,
  LoadingScreen,
  ConfirmModal,
} from '@/components/common';
import { formatDate, getFullName, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const ProfileRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const permissions = usePermissions();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [processModal, setProcessModal] = useState({
    open: false,
    approve: null,
  });

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await profileRequestService.getById(id);
      setRequest(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (approve) => {
    try {
      setProcessing(true);
      await profileRequestService.process(id, {
        is_approved: approve,
        admin_note: adminNote,
      });
      toast.success(approve ? 'Request approved' : 'Request rejected');
      setProcessModal({ open: false, approve: null });
      setAdminNote('');
      fetchRequest();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      await profileRequestService.downloadReport(id);
      toast.success('Report downloaded');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const canProcess =
    permissions.canProcessRequests &&
    request?.status === 'pending' &&
    request?.employee_id !== currentUser?.employee_id;

  if (loading) {
    return <LoadingScreen message='Loading request...' />;
  }

  if (error || !request) {
    return (
      <div className='p-8'>
        <Alert variant='error' title='Error'>
          {error || 'Request not found'}
        </Alert>
        <Button
          className='mt-4'
          onClick={() => navigate('/profile-requests')}
          icon={ArrowLeftIcon}
        >
          Back to Requests
        </Button>
      </div>
    );
  }

  const isApproved = request.status === 'processed' && request.is_approved;
  const isRejected =
    request.status === 'processed' && request.is_approved === false;

  return (
    <div className='space-y-6'>
      <PageHeader
        title={`Request #${request.id}`}
        subtitle={request.request_type}
        breadcrumbs={[
          { label: 'Profile Requests', href: '/profile-requests' },
          { label: `#${request.id}` },
        ]}
        actions={
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={() => navigate('/profile-requests')}
              icon={ArrowLeftIcon}
            >
              Back
            </Button>
            {request.status === 'processed' && (
              <Button
                variant='outline'
                icon={ArrowDownTrayIcon}
                onClick={handleDownloadReport}
              >
                Download Report
              </Button>
            )}
            {canProcess && (
              <>
                <Button
                  variant='success'
                  icon={CheckIcon}
                  onClick={() => setProcessModal({ open: true, approve: true })}
                >
                  Approve
                </Button>
                <Button
                  variant='error'
                  icon={XMarkIcon}
                  onClick={() =>
                    setProcessModal({ open: true, approve: false })
                  }
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <h3 className='text-sm font-medium text-gray-500 mb-4'>
            Request details
          </h3>
          <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <dt className='text-sm text-gray-500'>Employee</dt>
              <dd className='mt-1 font-medium text-gray-900'>
                {request.employee
                  ? getFullName(
                      request.employee.first_name,
                      request.employee.last_name
                    )
                  : '-'}
              </dd>
            </div>
            <div>
              <dt className='text-sm text-gray-500'>Type</dt>
              <dd className='mt-1 text-gray-900'>
                {request.request_type || '-'}
              </dd>
            </div>
            <div>
              <dt className='text-sm text-gray-500'>Status</dt>
              <dd className='mt-1'>
                <Badge
                  variant={
                    request.status === 'pending'
                      ? 'warning'
                      : isApproved
                      ? 'success'
                      : 'error'
                  }
                >
                  {request.status === 'pending'
                    ? 'Pending'
                    : isApproved
                    ? 'Approved'
                    : 'Rejected'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className='text-sm text-gray-500'>Submitted</dt>
              <dd className='mt-1 text-gray-900'>
                {formatDate(request.created_at)}
              </dd>
            </div>
            {request.reviewed_at && (
              <>
                <div>
                  <dt className='text-sm text-gray-500'>Reviewed at</dt>
                  <dd className='mt-1 text-gray-900'>
                    {formatDate(request.reviewed_at)}
                  </dd>
                </div>
                <div>
                  <dt className='text-sm text-gray-500'>Reviewed by</dt>
                  <dd className='mt-1 text-gray-900'>
                    {request.reviewed_by_user?.name ||
                      request.reviewedBy?.name ||
                      '-'}
                  </dd>
                </div>
              </>
            )}
          </dl>
          {request.details && (
            <div className='mt-4'>
              <dt className='text-sm text-gray-500'>Details</dt>
              <dd className='mt-1 text-gray-900 whitespace-pre-wrap'>
                {request.details}
              </dd>
            </div>
          )}
          {request.admin_note && (
            <div className='mt-4'>
              <dt className='text-sm text-gray-500'>Admin note</dt>
              <dd className='mt-1 text-gray-900 whitespace-pre-wrap'>
                {request.admin_note}
              </dd>
            </div>
          )}
          {canProcess && (
            <div className='mt-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Admin note (optional)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder='Add a note for the employee...'
                rows={3}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-primary-500 focus:border-primary-500'
              />
            </div>
          )}
        </Card>

        <Card>
          <h3 className='text-sm font-medium text-gray-500 mb-4'>
            Proposed changes
          </h3>
          <pre className='text-xs bg-gray-50 p-4 rounded-lg overflow-auto max-h-96'>
            {JSON.stringify(request.proposed_changes || {}, null, 2)}
          </pre>
        </Card>
      </div>

      <ConfirmModal
        isOpen={processModal.open}
        onClose={() => setProcessModal({ open: false, approve: null })}
        title={processModal.approve ? 'Approve request?' : 'Reject request?'}
        message={
          processModal.approve
            ? 'The proposed changes will be applied to the employee profile.'
            : 'The request will be marked as rejected. No changes will be applied.'
        }
        confirmText={processModal.approve ? 'Approve' : 'Reject'}
        variant={processModal.approve ? 'success' : 'danger'}
        onConfirm={() => handleProcess(processModal.approve)}
        loading={processing}
      />
    </div>
  );
};

export default ProfileRequestDetail;
