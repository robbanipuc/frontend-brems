import { useState, useEffect } from 'react';
import { DocumentTextIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { punishmentService } from '@/services';
import { Button, Card, EmptyState, Spinner } from '@/components/common';
import { formatDate, getErrorMessage } from '@/utils/helpers';
import { PUNISHMENT_TYPES } from '@/utils/constants';
import AddPunishmentModal from '../modals/AddPunishmentModal';

const PunishmentsTab = ({ employee, canManage, onAddSuccess }) => {
  const [punishments, setPunishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const fetchPunishments = async () => {
    if (!employee?.id) {
      setLoading(false);
      setPunishments([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await punishmentService.getByEmployee(employee.id);
      setPunishments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPunishments();
  }, [employee?.id]);

  const handleAddSuccess = () => {
    fetchPunishments();
    onAddSuccess?.();
    setAddModalOpen(false);
  };

  const getTypeLabel = (type) => {
    if (!type) return '—';
    if (!Array.isArray(PUNISHMENT_TYPES)) return String(type).replace(/_/g, ' ');
    const option = PUNISHMENT_TYPES.find((t) => t.value === type);
    return option?.label || String(type).replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <EmptyState
          icon={ExclamationTriangleIcon}
          title="Failed to load punishments"
          description={error}
        />
      </div>
    );
  }

  const list = Array.isArray(punishments) ? punishments : [];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Punishment Records</h3>
        {canManage && (
          <Button
            size="sm"
            onClick={() => setAddModalOpen(true)}
          >
            Add Punishment
          </Button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={DocumentTextIcon}
          title="No punishment records"
          description="Punishment orders will appear here when added by office admin."
          action={
            canManage && (
              <Button onClick={() => setAddModalOpen(true)}>
                Add Punishment
              </Button>
            )
          }
        />
      ) : (
        <ul className="space-y-4">
          {list.map((p) => (
            <li key={p.id}>
              <Card className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {getTypeLabel(p.punishment_type)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Order date: {formatDate(p.order_date)}
                    </p>
                    {p.created_by && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Recorded by: {p.created_by?.name ?? '—'}
                      </p>
                    )}
                    {p.comment && (
                      <p className="text-sm text-gray-600 mt-2">{p.comment}</p>
                    )}
                  </div>
                  {p.order_copy_url && (
                    <a
                      href={p.order_copy_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline shrink-0"
                    >
                      <DocumentTextIcon className="w-4 h-4" />
                      View order copy
                    </a>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {addModalOpen && (
        <AddPunishmentModal
          isOpen={true}
          onClose={() => setAddModalOpen(false)}
          employee={employee}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
};

export default PunishmentsTab;
