import { Link } from 'react-router-dom';
import {
  ArrowsRightLeftIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Card, Badge, EmptyState } from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate, getRelativeTime } from '@/utils/helpers';

const iconMap = {
  transfer: ArrowsRightLeftIcon,
  promotion: ArrowTrendingUpIcon,
  request_approved: CheckCircleIcon,
  request_rejected: XCircleIcon,
};

const colorMap = {
  transfer: 'bg-blue-100 text-blue-600',
  promotion: 'bg-green-100 text-green-600',
  request_approved: 'bg-green-100 text-green-600',
  request_rejected: 'bg-red-100 text-red-600',
};

const ActivityFeed = ({ activities = [], loading }) => {
  const { t } = useLanguage();
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>{t('dashboard.recentActivity')}</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex gap-4 animate-pulse'>
                <div className='w-10 h-10 bg-gray-200 rounded-full' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-3/4' />
                  <div className='h-3 bg-gray-200 rounded w-1/2' />
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('dashboard.recentActivity')}</Card.Title>
      </Card.Header>
      <Card.Body className='p-0'>
        {activities.length === 0 ? (
          <div className='p-6'>
            <EmptyState
              icon={ClockIcon}
              title={t('dashboard.noRecentActivity')}
              description={t('dashboard.noRecentActivityDesc')}
            />
          </div>
        ) : (
          <ul className='divide-y divide-gray-200'>
            {activities.map((activity, index) => {
              const Icon = iconMap[activity.type] || ClockIcon;
              const colorClass =
                colorMap[activity.type] || 'bg-gray-100 text-gray-600';

              return (
                <li
                  key={index}
                  className='px-6 py-4 hover:bg-gray-50 transition-colors'
                >
                  <div className='flex gap-4'>
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
                    >
                      <Icon className='w-5 h-5' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900'>
                        {activity.title}
                      </p>
                      <p className='text-sm text-gray-500 line-clamp-2'>
                        {activity.description}
                      </p>
                      <div className='mt-1 flex items-center gap-2'>
                        <span className='text-xs text-gray-400'>
                          {getRelativeTime(activity.date)}
                        </span>
                        {activity.employee_id && (
                          <Link
                            to={`/employees/${activity.employee_id}`}
                            className='text-xs text-primary-600 hover:text-primary-700'
                          >
                            {t('dashboard.viewEmployee')}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card.Body>
    </Card>
  );
};

export default ActivityFeed;
