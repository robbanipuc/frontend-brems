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
import { formatCurrency } from '@/utils/helpers';

const StatsGrid = ({ counts, loading }) => {
  const stats = [
    {
      title: 'Total Employees',
      value: counts?.total_employees || 0,
      icon: UsersIcon,
      iconColor: 'bg-blue-100 text-blue-600',
      href: '/employees',
    },
    {
      title: 'Active Employees',
      value: counts?.active_employees || 0,
      icon: CheckBadgeIcon,
      iconColor: 'bg-green-100 text-green-600',
      href: '/employees?status=active',
    },
    {
      title: 'Unverified',
      value: counts?.unverified_employees || 0,
      icon: ExclamationCircleIcon,
      iconColor: 'bg-yellow-100 text-yellow-600',
      href: '/employees?is_verified=false',
    },
    {
      title: 'Pending Requests',
      value: counts?.pending_requests || 0,
      icon: DocumentCheckIcon,
      iconColor: 'bg-purple-100 text-purple-600',
      href: '/profile-requests',
    },
    {
      title: 'Offices',
      value: counts?.offices || 0,
      icon: BuildingOfficeIcon,
      iconColor: 'bg-indigo-100 text-indigo-600',
      href: '/offices',
    },
    {
      title: 'Designations',
      value: counts?.designations || 0,
      icon: BriefcaseIcon,
      iconColor: 'bg-pink-100 text-pink-600',
      href: '/designations',
    },
    {
      title: 'Released',
      value: counts?.released_employees || 0,
      icon: ArrowRightOnRectangleIcon,
      iconColor: 'bg-orange-100 text-orange-600',
      href: '/employees/released',
    },
    {
      title: 'Retired',
      value: counts?.retired_employees || 0,
      icon: UserPlusIcon,
      iconColor: 'bg-gray-100 text-gray-600',
      href: '/employees?status=retired',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value.toLocaleString()}
          icon={stat.icon}
          iconColor={stat.iconColor}
          loading={loading}
          onClick={() => window.location.href = stat.href}
        />
      ))}
    </div>
  );
};

export default StatsGrid;