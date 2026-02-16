import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { dashboardService } from '@/services';
import { PageHeader, Alert } from '@/components/common';
import {
  StatsGrid,
  ActivityFeed,
  PendingItemsCard,
  OfficeStatsChart,
  QuickActions,
} from '@/components/dashboard';
import { getErrorMessage } from '@/utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboard();
      setData(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t('dashboard.welcomeBack', { name: user?.name?.split(' ')[0] || '' })}
        subtitle={t('dashboard.subtitle')}
      />

      {error && (
        <Alert
          variant='error'
          className='mb-6'
          dismissible
          onDismiss={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <StatsGrid counts={data?.counts} loading={loading} />

      {/* Main Content Grid */}
      <div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column - 2/3 width */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Office Stats Chart */}
          <OfficeStatsChart
            officeStats={data?.office_stats}
            loading={loading}
          />

          {/* Activity Feed */}
          <ActivityFeed activities={data?.activity} loading={loading} />
        </div>

        {/* Right Column - 1/3 width */}
        <div className='space-y-8'>
          {/* Quick Actions */}
          <QuickActions />

          {/* Pending Items */}
          <PendingItemsCard
            pendingItems={data?.pending_items}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
