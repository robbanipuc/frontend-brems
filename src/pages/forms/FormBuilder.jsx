import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { formService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Textarea,
  Alert,
  LoadingScreen,
} from '@/components/common';
import { FORM_FIELD_TYPES } from '@/utils/constants';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'create';
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    is_active: true,
    fields: [],
  });

  useEffect(() => {
    if (isEdit) fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formService.getById(id);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        is_active: data.is_active ?? true,
        fields: (data.fields || []).map((f) => ({
          id: f.id,
          label: f.label,
          type: f.type,
          options: f.options || [],
          required: f.required ?? true,
          order: f.order ?? 0,
        })),
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const addField = () => {
    setFormData((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          label: '',
          type: 'text',
          options: [],
          required: true,
          order: prev.fields.length,
        },
      ],
    }));
  };

  const updateField = (index, updates) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.map((f, i) =>
        i === index ? { ...f, ...updates } : f
      ),
    }));
  };

  const removeField = (index) => {
    setFormData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (formData.fields.length === 0) {
      toast.error('Add at least one field');
      return;
    }
    if (formData.fields.some((f) => !f.label?.trim())) {
      toast.error('All fields must have a label');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const payload = {
        title: formData.title,
        description: formData.description || null,
        is_active: formData.is_active,
        fields: formData.fields.map((f, i) => ({
          label: f.label,
          type: f.type,
          options: f.options,
          required: f.required,
          order: i,
        })),
      };
      if (isEdit) {
        await formService.update(id, payload);
        toast.success('Form updated');
      } else {
        await formService.create(payload);
        toast.success('Form created');
      }
      navigate('/forms');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen message='Loading form...' />;
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? 'Edit Form' : 'Create Form'}
        subtitle={isEdit ? formData.title : 'Build a new form'}
        breadcrumbs={[
          { label: 'Forms', href: '/forms' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
        actions={
          <Button
            variant='outline'
            onClick={() => navigate('/forms')}
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

      <form onSubmit={handleSubmit} className='space-y-6'>
        <Card className='p-6'>
          <h3 className='text-sm font-medium text-gray-700 mb-4'>
            Form details
          </h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder='Form title'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Optional description'
                rows={3}
              />
            </div>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
                className='rounded border-gray-300'
              />
              <span className='text-sm text-gray-700'>
                Active (accept submissions)
              </span>
            </label>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-sm font-medium text-gray-700'>Fields</h3>
            <Button
              type='button'
              variant='outline'
              size='sm'
              icon={PlusIcon}
              onClick={addField}
            >
              Add field
            </Button>
          </div>
          <div className='space-y-4'>
            {formData.fields.map((field, index) => (
              <div
                key={index}
                className='flex flex-wrap items-start gap-4 rounded-lg border border-gray-200 p-4'
              >
                <div className='flex-1 min-w-[200px]'>
                  <Input
                    value={field.label}
                    onChange={(e) =>
                      updateField(index, { label: e.target.value })
                    }
                    placeholder='Field label'
                  />
                </div>
                <select
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value })}
                  className='rounded-lg border border-gray-300 px-3 py-2 text-sm'
                >
                  {FORM_FIELD_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={field.required}
                    onChange={(e) =>
                      updateField(index, { required: e.target.checked })
                    }
                    className='rounded border-gray-300'
                  />
                  <span className='text-sm'>Required</span>
                </label>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  icon={TrashIcon}
                  onClick={() => removeField(index)}
                />
              </div>
            ))}
          </div>
        </Card>

        <div className='flex gap-3'>
          <Button type='submit' loading={saving}>
            {isEdit ? 'Update Form' : 'Create Form'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => navigate('/forms')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;
