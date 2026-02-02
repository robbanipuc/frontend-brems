import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  PencilSquareIcon,
  DocumentPlusIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { usePermissions } from '@/hooks/usePermissions';
import { formService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Alert,
  EmptyState,
  ConfirmModal,
} from '@/components/common';
import { formatDate, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const FormList = () => {
  const permissions = usePermissions();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, form: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formService.getAll();
      setForms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (form) => {
    try {
      await formService.toggleActive(form.id);
      toast.success(form.is_active ? 'Form deactivated' : 'Form activated');
      fetchForms();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.form) return;
    try {
      setDeleting(true);
      await formService.delete(deleteModal.form.id);
      toast.success('Form deleted');
      setDeleteModal({ open: false, form: null });
      fetchForms();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Forms'
        subtitle='View and fill forms'
        actions={
          permissions.canCreateForm && (
            <Link to='/forms/create'>
              <Button icon={PlusIcon}>Create Form</Button>
            </Link>
          )
        }
      />

      {error && (
        <Alert variant='error' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className='p-12 text-center text-gray-500'>Loading forms...</div>
      ) : forms.length === 0 ? (
        <Card>
          <EmptyState
            icon={ClipboardDocumentListIcon}
            title='No forms'
            description='There are no forms to display.'
            actions={
              permissions.canCreateForm && (
                <Link to='/forms/create'>
                  <Button icon={PlusIcon}>Create Form</Button>
                </Link>
              )
            }
          />
        </Card>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {forms.map((form) => (
            <Card key={form.id} className='p-6'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0 flex-1'>
                  <h3 className='font-medium text-gray-900 truncate'>
                    {form.title}
                  </h3>
                  {form.description && (
                    <p className='mt-1 text-sm text-gray-500 line-clamp-2'>
                      {form.description}
                    </p>
                  )}
                  <div className='mt-3 flex items-center gap-2'>
                    <Badge variant={form.is_active ? 'success' : 'warning'}>
                      {form.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {form.submissions_count != null && (
                      <span className='text-xs text-gray-500'>
                        {form.submissions_count} submissions
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className='mt-4 flex flex-wrap gap-2'>
                {form.is_active &&
                  permissions.canSubmitForm &&
                  !form.user_submitted && (
                    <Link to={`/forms/${form.id}/fill`}>
                      <Button
                        variant='primary'
                        size='sm'
                        icon={DocumentPlusIcon}
                      >
                        Fill
                      </Button>
                    </Link>
                  )}
                {form.user_submitted && <Badge variant='info'>Submitted</Badge>}
                <Link to={`/forms/${form.id}/fill`}>
                  <Button variant='ghost' size='sm' icon={EyeIcon}>
                    View
                  </Button>
                </Link>
                {permissions.canCreateForm && (
                  <>
                    <Link to={`/forms/${form.id}/edit`}>
                      <Button
                        variant='ghost'
                        size='sm'
                        icon={PencilSquareIcon}
                      />
                    </Link>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleToggleActive(form)}
                    >
                      {form.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      icon={TrashIcon}
                      onClick={() => setDeleteModal({ open: true, form })}
                    />
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, form: null })}
        title='Delete form?'
        message={`Delete "${deleteModal.form?.title}"? Forms with submissions cannot be deleted.`}
        confirmText='Delete'
        variant='danger'
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default FormList;
