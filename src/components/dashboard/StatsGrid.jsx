import {
  UsersIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  DocumentCheckIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { StatsCard } from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';

const StatsGrid = ({ counts, loading }) => {
  const { t } = useLanguage();
  const stats = [
    {
      titleKey: 'dashboard.totalEmployees',
      value: counts?.total_employees || 0,
      icon: UsersIcon,
      iconColor: 'bg-blue-100 text-blue-600',
      href: '/employees',
    },
    {
      titleKey: 'dashboard.activeEmployees',
      value: counts?.active_employees || 0,
      icon: CheckBadgeIcon,
      iconColor: 'bg-green-100 text-green-600',
      href: '/employees?status=active',
    },
    {
      titleKey: 'dashboard.unverified',
      value: counts?.unverified_employees || 0,
      icon: ExclamationCircleIcon,
      iconColor: 'bg-yellow-100 text-yellow-600',
      href: '/employees?is_verified=false',
    },
    {
      titleKey: 'dashboard.pendingRequests',
      value: counts?.pending_requests || 0,
      icon: DocumentCheckIcon,
      iconColor: 'bg-purple-100 text-purple-600',
      href: '/profile-requests',
    },
    {
      titleKey: 'dashboard.offices',
      value: counts?.offices || 0,
      icon: BuildingOfficeIcon,
      iconColor: 'bg-indigo-100 text-indigo-600',
      href: '/offices',
    },
    {
      titleKey: 'dashboard.designations',
      value: counts?.designations || 0,
      icon: BriefcaseIcon,
      iconColor: 'bg-pink-100 text-pink-600',
      href: '/designations',
    },
    {
      titleKey: 'dashboard.released',
      value: counts?.released_employees || 0,
      icon: ArrowRightOnRectangleIcon,
      iconColor: 'bg-orange-100 text-orange-600',
      href: '/employees/released',
    },
    {
      titleKey: 'dashboard.retired',
      value: counts?.retired_employees || 0,
      icon: UserPlusIcon,
      iconColor: 'bg-gray-100 text-gray-600',
      href: '/employees?status=retired',
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {stats.map((stat) => (
        <StatsCard
          key={stat.titleKey}
          title={t(stat.titleKey)}
          value={stat.value.toLocaleString()}
          icon={stat.icon}
          iconColor={stat.iconColor}
          loading={loading}
          onClick={() => (window.location.href = stat.href)}
        />
      ))}
    </div>
  );
};

export default StatsGrid;
