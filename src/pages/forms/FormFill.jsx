import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { formService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Textarea,
  Alert,
  LoadingScreen,
  FileUpload,
} from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const FormFill = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await formService.getById(id);
      setForm(data);
      const initial = {};
      (data.fields || []).forEach((f) => {
        initial[f.id] = '';
      });
      setValues(initial);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const setFieldValue = (fieldId, value) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const setFieldFile = (fieldId, file) => {
    setFiles((prev) => ({ ...prev, [fieldId]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    const required = (form.fields || []).filter((f) => f.required);
    const missing = required.filter((f) => {
      const v = values[f.id];
      if (f.type === 'file') return !files[f.id] && !v;
      return v === '' || v == null;
    });
    if (missing.length > 0) {
      toast.error(
        `Please fill required fields: ${missing.map((m) => m.label).join(', ')}`
      );
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const formData = new FormData();
      Object.entries(values).forEach(([fieldId, value]) => {
        if (value !== '' && value != null) {
          formData.append(`data[${fieldId}]`, value);
        }
      });
      Object.entries(files).forEach(([fieldId, file]) => {
        if (file) {
          formData.append(`files[${fieldId}]`, file);
        }
      });
      await formService.submit(form.id, values, files);
      toast.success('Form submitted successfully');
      navigate('/forms/my-submissions');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message='Loading form...' />;
  }

  if (error || !form) {
    return (
      <div className='p-8'>
        <Alert variant='error' title='Error'>
          {error || 'Form not found'}
        </Alert>
        <Button
          className='mt-4'
          onClick={() => navigate('/forms')}
          icon={ArrowLeftIcon}
        >
          Back to Forms
        </Button>
      </div>
    );
  }

  if (form.user_submitted) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title={form.title}
          subtitle='You have already submitted this form.'
        />
        <Card className='p-6'>
          <p className='text-gray-600'>Your submission was received.</p>
          <Button
            className='mt-4'
            variant='outline'
            onClick={() => navigate('/forms')}
          >
            Back to Forms
          </Button>
        </Card>
      </div>
    );
  }

  if (!form.is_active) {
    return (
      <div className='space-y-6'>
        <PageHeader title={form.title} />
        <Alert variant='warning' title='Form inactive'>
          This form is not currently accepting submissions.
        </Alert>
        <Button
          variant='outline'
          onClick={() => navigate('/forms')}
          icon={ArrowLeftIcon}
        >
          Back to Forms
        </Button>
      </div>
    );
  }

  const renderField = (field) => {
    const value = values[field.id];
    const setValue = (v) => setFieldValue(field.id, v);
    const common = { required: field.required };
    switch (field.type) {
      case 'number':
        return (
          <Input
            type='number'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            {...common}
          />
        );
      case 'date':
        return (
          <Input
            type='date'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            {...common}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            {...common}
          />
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required={field.required}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-primary-500 focus:border-primary-500'
          >
            <option value=''>Select...</option>
            {(field.options || []).map((opt, i) => (
              <option key={i} value={typeof opt === 'object' ? opt.value : opt}>
                {typeof opt === 'object' ? opt.label : opt}
              </option>
            ))}
          </select>
        );
      case 'file':
        return (
          <FileUpload
            accept='image/*,.pdf'
            onChange={(file) => setFieldFile(field.id, file)}
            {...common}
          />
        );
      case 'checkbox':
        return (
          <input
            type='checkbox'
            checked={value === true || value === '1'}
            onChange={(e) => setValue(e.target.checked)}
            className='rounded border-gray-300'
          />
        );
      case 'radio':
        return (
          <div className='space-y-2'>
            {(field.options || []).map((opt, i) => {
              const optVal = typeof opt === 'object' ? opt.value : opt;
              const optLabel = typeof opt === 'object' ? opt.label : opt;
              return (
                <label key={i} className='flex items-center gap-2'>
                  <input
                    type='radio'
                    name={`field_${field.id}`}
                    value={optVal}
                    checked={value === optVal}
                    onChange={() => setValue(optVal)}
                  />
                  <span>{optLabel}</span>
                </label>
              );
            })}
          </div>
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${field.label}`}
            {...common}
          />
        );
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title={form.title}
        subtitle={form.description}
        breadcrumbs={[
          { label: 'Forms', href: '/forms' },
          { label: form.title },
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

      <form onSubmit={handleSubmit}>
        <Card className='p-6'>
          <div className='space-y-6'>
            {(form.fields || [])
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((field) => (
                <div key={field.id}>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    {field.label}
                    {field.required && <span className='text-red-500'> *</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
          </div>
          <div className='mt-6 flex gap-3'>
            <Button type='submit' icon={PaperAirplaneIcon} loading={submitting}>
              Submit
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/forms')}
            >
              Cancel
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default FormFill;
