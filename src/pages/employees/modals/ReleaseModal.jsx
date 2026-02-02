import { useState } from 'react';
import { employeeService } from '@/services';
import { Modal, Button, Input, Textarea, DatePicker } from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const ReleaseModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    release_date: new Date().toISOString().split('T')[0],
    remarks: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.release_date) {
      newErrors.release_date = 'Release date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await employeeService.release(employee.id, formData);
      toast.success('Employee released for transfer');
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      release_date: new Date().toISOString().split('T')[0],
      remarks: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Release Employee for Transfer"
      description={`Release ${employee?.first_name} ${employee?.last_name} from their current office for transfer`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <DatePicker
          label="Release Date"
          name="release_date"
          value={formData.release_date}
          onChange={handleChange}
          error={errors.release_date}
          required
          max={new Date().toISOString().split('T')[0]}
        />

        <Textarea
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Optional remarks about the release..."
          rows={3}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <strong>Note:</strong> Once released, the employee will be available for transfer
          to other offices. They will appear in the "Released Employees" list until they
          are transferred to a new office.
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="warning" loading={loading}>
            Release Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReleaseModal;