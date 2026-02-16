import { useState } from 'react';
import { punishmentService } from '@/services';
import {
  Modal,
  Button,
  Textarea,
  DatePicker,
  Select,
  FileUpload,
} from '@/components/common';
import { PUNISHMENT_TYPES } from '@/utils/constants';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const PUNISHMENT_OPTIONS = Array.isArray(PUNISHMENT_TYPES)
  ? PUNISHMENT_TYPES.map((t) => ({ value: t.value, label: t.label }))
  : [];

const AddPunishmentModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    order_date: new Date().toISOString().split('T')[0],
    punishment_type: '',
    comment: '',
  });
  const [orderCopyFile, setOrderCopyFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.order_date) newErrors.order_date = 'Order date is required';
    if (!formData.punishment_type) newErrors.punishment_type = 'Punishment type is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        employee_id: employee.id,
        order_date: formData.order_date,
        punishment_type: formData.punishment_type,
        comment: formData.comment || null,
        order_copy: orderCopyFile || undefined,
      };
      await punishmentService.create(payload);
      toast.success('Punishment record added successfully');
      handleClose();
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      order_date: new Date().toISOString().split('T')[0],
      punishment_type: '',
      comment: '',
    });
    setOrderCopyFile(null);
    setErrors({});
    onClose();
  };

  const typeOptions = PUNISHMENT_OPTIONS.length ? PUNISHMENT_OPTIONS : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Punishment"
      description={employee ? `Record a punishment for ${employee.first_name} ${employee.last_name}` : 'Record a punishment'}
      size="md"
    >
      {!employee ? (
        <p className="text-sm text-gray-500">Employee data is not available. Please close and try again.</p>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-4">
        <DatePicker
          label="Order Date"
          name="order_date"
          value={formData.order_date}
          onChange={handleChange}
          error={errors.order_date}
          required
        />

        <Select
          label="Punishment Type"
          name="punishment_type"
          value={formData.punishment_type}
          onChange={handleChange}
          options={typeOptions}
          placeholder="Select punishment type"
          error={errors.punishment_type}
          required
        />

        <FileUpload
          label="Order Copy (PDF / Image)"
          name="order_copy"
          accept=".pdf,.jpg,.jpeg,.png"
          value={orderCopyFile}
          onChange={(file) => {
            setOrderCopyFile(file);
            setErrors((prev) => ({ ...prev, order_copy: '' }));
          }}
          error={errors.order_copy}
          hint="PDF or image, max 5MB"
        />

        <Textarea
          label="Comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          placeholder="Optional remarks or details..."
          rows={3}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Punishment
          </Button>
        </div>
      </form>
      )}
    </Modal>
  );
};

export default AddPunishmentModal;
