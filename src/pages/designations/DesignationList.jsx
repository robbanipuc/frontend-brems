import { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { usePermissions } from '@/hooks/usePermissions';
import { designationService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Table,
  Alert,
  Modal,
  Input,
  Textarea,
  ConfirmModal,
  SearchInput,
} from '@/components/common';
import { formatCurrency, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const DesignationList = () => {
  const permissions = usePermissions();

  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal states
  const [editModal, setEditModal] = useState({
    open: false,
    designation: null,
  });
  const [viewModal, setViewModal] = useState({
    open: false,
    designation: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    designation: null,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: '',
    title_bn: '',
    grade: '',
    salary_min: '',
    salary_max: '',
    method_of_recruitment: '',
    qualifications: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await designationService.getAll({ sort_by_grade: true });
      setDesignations(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (designation) => {
    setFormData({
      title: designation?.title || '',
      title_bn: designation?.title_bn || '',
      grade: designation?.grade || '',
      salary_min: designation?.salary_min || '',
      salary_max: designation?.salary_max || '',
      method_of_recruitment: designation?.method_of_recruitment || '',
      qualifications: designation?.qualifications || '',
    });
    setFormErrors({});
    setEditModal({ open: true, designation });
  };

  const handleView = (designation) => {
    setViewModal({ open: true, designation });
  };

  const handleDelete = (designation) => {
    setDeleteModal({ open: true, designation });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validate
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.grade.trim()) errors.grade = 'Grade is required';
    if (!formData.salary_min) errors.salary_min = 'Minimum salary is required';
    if (!formData.salary_max) errors.salary_max = 'Maximum salary is required';
    if (
      formData.salary_min &&
      formData.salary_max &&
      parseFloat(formData.salary_max) < parseFloat(formData.salary_min)
    ) {
      errors.salary_max = 'Maximum salary must be greater than or equal to minimum';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Treat numeric-only grade as Grade-{number}
    let grade = formData.grade.trim();
    if (/^\d+$/.test(grade)) {
      grade = `Grade-${grade}`;
    }
    const payload = { ...formData, grade };

    try {
      setSaving(true);
      if (editModal.designation) {
        await designationService.update(editModal.designation.id, payload);
        toast.success('Designation updated successfully');
      } else {
        await designationService.create(payload);
        toast.success('Designation created successfully');
      }
      setEditModal({ open: false, designation: null });
      fetchDesignations();
    } catch (err) {
      toast.error(getErrorMessage(err));
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await designationService.delete(deleteModal.designation.id);
      toast.success('Designation deleted successfully');
      setDeleteModal({ open: false, designation: null });
      fetchDesignations();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const formatSalaryRange = (min, max) => {
    if (!min && !max) return '-';
    if (min === max) return formatCurrency(min);
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  };

  const filteredDesignations = search
    ? designations.filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.grade.toLowerCase().includes(search.toLowerCase())
      )
    : designations;

  const columns = [
    {
      key: 'title',
      header: 'Designation',
      sortable: true,
      render: (value, designation) => (
        <div>
          <p className='font-medium text-gray-900'>{value}</p>
          {designation.title_bn && (
            <p className='text-sm text-gray-500 font-bangla'>
              {designation.title_bn}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'grade',
      header: 'Grade',
      sortable: true,
      sortAs: 'number',
      render: (value) => <Badge variant='info'>{value}</Badge>,
    },
    {
      key: 'salary_range',
      header: 'Salary Range (BDT)',
      sortable: false,
      align: 'right',
      render: (_, designation) => (
        <span className='font-medium'>
          {formatSalaryRange(designation.salary_min, designation.salary_max)}
        </span>
      ),
    },
    {
      key: 'employees_count',
      header: 'Employees',
      sortable: true,
      align: 'center',
      render: (value) => <span className='text-gray-600'>{value || 0}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (_, designation) => (
        <div className='flex items-center justify-end gap-1'>
          <Button
            variant='ghost'
            size='sm'
            iconOnly
            icon={EyeIcon}
            onClick={() => handleView(designation)}
            title='View Details'
          />
          {permissions.canEditDesignation && (
            <Button
              variant='ghost'
              size='sm'
              iconOnly
              icon={PencilSquareIcon}
              onClick={() => handleEdit(designation)}
              title='Edit'
            />
          )}
          {permissions.canDeleteDesignation && (
            <Button
              variant='ghost'
              size='sm'
              iconOnly
              icon={TrashIcon}
              onClick={() => handleDelete(designation)}
              className='text-red-500 hover:text-red-700'
              disabled={designation.employees_count > 0}
              title='Delete'
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title='Designations'
        subtitle={`${designations.length} designations configured`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Designations' },
        ]}
        actions={
          permissions.canCreateDesignation && (
            <Button icon={PlusIcon} onClick={() => handleEdit(null)}>
              Add Designation
            </Button>
          )
        }
      />

      {error && (
        <Alert
          variant='error'
          className='mb-6'
          dismissible
          onDismiss={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Card>
        {/* Search */}
        <div className='p-4 border-b border-gray-200'>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder='Search designations...'
            className='w-64'
          />
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={filteredDesignations}
          loading={loading}
          emptyMessage='No designations found'
          emptyDescription='Get started by creating your first designation'
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, designation: null })}
        title={
          editModal.designation ? 'Edit Designation' : 'Create Designation'
        }
        size='lg'
      >
        <form onSubmit={handleSave} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Title (English)'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={formErrors.title}
              required
              placeholder='e.g., Assistant Station Master'
            />
            <Input
              label='Title (Bangla)'
              value={formData.title_bn}
              onChange={(e) =>
                setFormData({ ...formData, title_bn: e.target.value })
              }
              placeholder='সহকারী স্টেশন মাস্টার'
              className='font-bangla'
            />
          </div>

          <Input
            label='Grade'
            value={formData.grade}
            onChange={(e) =>
              setFormData({ ...formData, grade: e.target.value })
            }
            error={formErrors.grade}
            required
            placeholder='e.g., Grade-9 or just 9'
          />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Minimum Salary (BDT)'
              type='number'
              value={formData.salary_min}
              onChange={(e) =>
                setFormData({ ...formData, salary_min: e.target.value })
              }
              error={formErrors.salary_min}
              required
              placeholder='e.g., 22000'
              min='0'
            />
            <Input
              label='Maximum Salary (BDT)'
              type='number'
              value={formData.salary_max}
              onChange={(e) =>
                setFormData({ ...formData, salary_max: e.target.value })
              }
              error={formErrors.salary_max}
              required
              placeholder='e.g., 53060'
              min='0'
            />
          </div>

          <Textarea
            label='Method of Recruitment'
            value={formData.method_of_recruitment}
            onChange={(e) =>
              setFormData({ ...formData, method_of_recruitment: e.target.value })
            }
            error={formErrors.method_of_recruitment}
            placeholder='e.g., Direct recruitment through PSC / By promotion from...'
            rows={3}
          />

          <Textarea
            label='Qualifications'
            value={formData.qualifications}
            onChange={(e) =>
              setFormData({ ...formData, qualifications: e.target.value })
            }
            error={formErrors.qualifications}
            placeholder='e.g., Bachelor degree in relevant field with minimum 3 years experience...'
            rows={3}
          />

          <div className='flex justify-end gap-3 pt-4 border-t'>
            <Button
              variant='outline'
              onClick={() => setEditModal({ open: false, designation: null })}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type='submit' loading={saving}>
              {editModal.designation ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, designation: null })}
        title='Designation Details'
        size='lg'
      >
        {viewModal.designation && (
          <div className='space-y-6'>
            {/* Basic Info */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Title (English)
                </label>
                <p className='mt-1 text-gray-900'>
                  {viewModal.designation.title}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Title (Bangla)
                </label>
                <p className='mt-1 text-gray-900 font-bangla'>
                  {viewModal.designation.title_bn || '-'}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Grade
                </label>
                <p className='mt-1'>
                  <Badge variant='info'>{viewModal.designation.grade}</Badge>
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Salary Range (BDT)
                </label>
                <p className='mt-1 text-gray-900 font-medium'>
                  {formatSalaryRange(
                    viewModal.designation.salary_min,
                    viewModal.designation.salary_max
                  )}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Total Employees
                </label>
                <p className='mt-1 text-gray-900'>
                  {viewModal.designation.employees_count || 0}
                </p>
              </div>
            </div>

            {/* Method of Recruitment */}
            <div>
              <label className='text-sm font-medium text-gray-500'>
                Method of Recruitment
              </label>
              <p className='mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg'>
                {viewModal.designation.method_of_recruitment || 'Not specified'}
              </p>
            </div>

            {/* Qualifications */}
            <div>
              <label className='text-sm font-medium text-gray-500'>
                Qualifications
              </label>
              <p className='mt-1 text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg'>
                {viewModal.designation.qualifications || 'Not specified'}
              </p>
            </div>

            <div className='flex justify-end pt-4 border-t'>
              <Button
                variant='outline'
                onClick={() => setViewModal({ open: false, designation: null })}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, designation: null })}
        onConfirm={handleConfirmDelete}
        title='Delete Designation'
        message={
          deleteModal.designation?.employees_count > 0
            ? `Cannot delete "${deleteModal.designation?.title}" because it has ${deleteModal.designation?.employees_count} employees assigned. Please reassign them first.`
            : `Are you sure you want to delete "${deleteModal.designation?.title}"? This action cannot be undone.`
        }
        confirmText='Delete'
        variant='danger'
        loading={deleting}
      />
    </div>
  );
};

export default DesignationList;