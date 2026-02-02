import { useState, useEffect } from 'react';
import { employeeService, officeService } from '@/services';
import {
  Modal,
  Button,
  Input,
  Textarea,
  DatePicker,
  Select,
  FileUpload,
  Alert,
} from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const TransferModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [formData, setFormData] = useState({
    to_office_id: '',
    transfer_date: new Date().toISOString().split('T')[0],
    order_number: '',
    remarks: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchOffices();
    }
  }, [isOpen]);

  const fetchOffices = async () => {
    try {
      const data = await officeService.getManaged();
      // Filter out current office
      const filteredOffices = data.filter(o => o.id !== employee?.current_office_id);
      setOffices(filteredOffices);
    } catch (err) {
      console.error('Failed to fetch offices:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.to_office_id) {
      newErrors.to_office_id = 'Destination office is required';
    }
    if (!formData.transfer_date) {
      newErrors.transfer_date = 'Transfer date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        attachment: attachment,
      };

      await employeeService.transfer(employee.id, payload);
      toast.success('Employee transferred successfully');
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      to_office_id: '',
      transfer_date: new Date().toISOString().split('T')[0],
      order_number: '',
      remarks: '',
    });
    setAttachment(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Transfer Employee"
      description={`Transfer ${employee?.first_name} ${employee?.last_name} to a new office`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Office Info */}
        <Alert variant="info">
          <strong>Current Office:</strong> {employee?.office?.name || 'N/A'}
          {employee?.status === 'released' && (
            <span className="ml-2 text-yellow-600">(Released)</span>
          )}
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Destination Office"
            name="to_office_id"
            value={formData.to_office_id}
            onChange={handleChange}
            options={offices.map(o => ({ value: o.id, label: `${o.name} (${o.code})` }))}
            error={errors.to_office_id}
            required
            placeholder="Select destination office"
          />

          <DatePicker
            label="Transfer Date"
            name="transfer_date"
            value={formData.transfer_date}
            onChange={handleChange}
            error={errors.transfer_date}
            required
          />

          <Input
            label="Order Number"
            name="order_number"
            value={formData.order_number}
            onChange={handleChange}
            placeholder="e.g., TR-2024-001"
          />
        </div>

        <Textarea
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Optional remarks about the transfer..."
          rows={3}
        />

        <FileUpload
          label="Attachment (Transfer Order)"
          accept="application/pdf,image/jpeg,image/jpg,image/png"
          maxSize={5 * 1024 * 1024}
          value={attachment}
          onChange={setAttachment}
          onRemove={() => setAttachment(null)}
          hint="PDF, JPG, PNG up to 5MB"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Transfer Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransferModal;