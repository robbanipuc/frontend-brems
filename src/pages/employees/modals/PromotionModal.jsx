import { useState, useEffect } from 'react';
import { employeeService, designationService } from '@/services';
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
import { formatCurrency, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const PromotionModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [formData, setFormData] = useState({
    new_designation_id: '',
    promotion_date: new Date().toISOString().split('T')[0],
    order_number: '',
    remarks: '',
  });
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchDesignations();
    }
  }, [isOpen]);

  const fetchDesignations = async () => {
    try {
      const data = await designationService.getAll({ sort_by_grade: true });
      // Filter out current designation
      const filteredDesignations = data.filter(d => d.id !== employee?.designation_id);
      setDesignations(filteredDesignations);
    } catch (err) {
      console.error('Failed to fetch designations:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    // Update selected designation for preview
    if (name === 'new_designation_id') {
      const designation = designations.find(d => d.id === parseInt(value));
      setSelectedDesignation(designation);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.new_designation_id) {
      newErrors.new_designation_id = 'New designation is required';
    }
    if (!formData.promotion_date) {
      newErrors.promotion_date = 'Promotion date is required';
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

      await employeeService.promote(employee.id, payload);
      toast.success('Employee promoted successfully');
      onSuccess?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      new_designation_id: '',
      promotion_date: new Date().toISOString().split('T')[0],
      order_number: '',
      remarks: '',
    });
    setAttachment(null);
    setSelectedDesignation(null);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Promote Employee"
      description={`Promote ${employee?.first_name} ${employee?.last_name} to a new designation`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Designation Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Current Designation</p>
            <p className="mt-1 font-medium text-gray-900">{employee?.designation?.title || 'N/A'}</p>
            <p className="text-sm text-gray-500">
              Grade: {employee?.designation?.grade || 'N/A'} • 
              Salary: {employee?.designation?.salary_range ? `৳${employee.designation.salary_range}` : '-'}
            </p>
          </div>

          {selectedDesignation && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-600 uppercase tracking-wide">New Designation</p>
              <p className="mt-1 font-medium text-green-900">{selectedDesignation.title}</p>
              <p className="text-sm text-green-700">
                Grade: {selectedDesignation.grade} • 
                Salary: {selectedDesignation?.salary_range ? `৳${selectedDesignation.salary_range}` : '-'}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="New Designation"
            name="new_designation_id"
            value={formData.new_designation_id}
            onChange={handleChange}
            options={designations.map(d => ({ 
              value: d.id, 
              label: `${d.title} (Grade: ${d.grade})` 
            }))}
            error={errors.new_designation_id}
            required
            placeholder="Select new designation"
          />

          <DatePicker
            label="Promotion Date"
            name="promotion_date"
            value={formData.promotion_date}
            onChange={handleChange}
            error={errors.promotion_date}
            required
          />

          <Input
            label="Order Number"
            name="order_number"
            value={formData.order_number}
            onChange={handleChange}
            placeholder="e.g., PR-2024-001"
          />
        </div>

        <Textarea
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Optional remarks about the promotion..."
          rows={3}
        />

        <FileUpload
          label="Attachment (Promotion Order)"
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
          <Button type="submit" variant="success" loading={loading}>
            Promote Employee
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PromotionModal;