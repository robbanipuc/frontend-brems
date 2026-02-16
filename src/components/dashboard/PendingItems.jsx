import { Link } from 'react-router-dom';
import {
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Card, Badge, Button, EmptyState } from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/utils/helpers';

const PendingItemsCard = ({ pendingItems, loading }) => {
  const { t } = useLanguage();
  const { profile_requests = [], unverified_employees = [] } = pendingItems || {};

  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>{t('dashboard.pendingItems')}</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded" />
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  }

  const hasItems = profile_requests.length > 0 || unverified_employees.length > 0;

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('dashboard.pendingItems')}</Card.Title>
      </Card.Header>
      <Card.Body className="p-0">
        {!hasItems ? (
          <div className="p-6">
            <EmptyState
              icon={DocumentCheckIcon}
              title={t('dashboard.allCaughtUp')}
              description={t('dashboard.noPendingItems')}
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {/* Profile Requests */}
            {profile_requests.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <DocumentCheckIcon className="w-4 h-4 text-purple-500" />
                    {t('dashboard.profileRequestsSection')}
                  </h4>
                  <Badge variant="purple">{profile_requests.length}</Badge>
                </div>
                <ul className="space-y-2">
                  {profile_requests.slice(0, 3).map((request) => (
                    <li key={request.id}>
                      <Link
                        to={`/profile-requests/${request.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {request.employee_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.request_type}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(request.submitted_at)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {profile_requests.length > 3 && (
                  <Link
                    to="/profile-requests"
                    className="mt-3 flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    {t('dashboard.viewAllRequests', { count: profile_requests.length })}
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}

            {/* Unverified Employees */}
            {unverified_employees.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                    {t('dashboard.unverifiedEmployees')}
                  </h4>
                  <Badge variant="warning">{unverified_employees.length}</Badge>
                </div>
                <ul className="space-y-2">
                  {unverified_employees.slice(0, 3).map((employee) => (
                    <li key={employee.id}>
                      <Link
                        to={`/employees/${employee.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {employee.employee_name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {employee.designation} • {employee.office}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(employee.joined_at)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {unverified_employees.length > 3 && (
                  <Link
                    to="/employees?is_verified=false"
                    className="mt-3 flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                  >
                    {t('dashboard.viewAllEmployees', { count: unverified_employees.length })}
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PendingItemsCard;