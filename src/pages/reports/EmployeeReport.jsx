import { useState, useEffect } from 'react';
import { ChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { reportService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  StatsCard,
  Alert,
  LoadingScreen,
} from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const EmployeeReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportService.getEmployeeStatistics();
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setExporting(true);
      await reportService.exportStatisticsPdf();
      toast.success('Report downloaded');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message='Loading report...' />;
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Employee Statistics Report' />
        <Alert variant='error' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Employee Statistics Report'
        subtitle='Overview of employee demographics and distribution'
        actions={
          <Button
            variant='outline'
            icon={ArrowDownTrayIcon}
            onClick={handleExportPdf}
            loading={exporting}
          >
            Export PDF
          </Button>
        }
      />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Employees'
          value={data?.total_employees ?? 0}
          icon={ChartBarIcon}
        />
        <StatsCard
          title='Active Employees'
          value={data?.active_employees ?? 0}
          icon={ChartBarIcon}
        />
        <StatsCard
          title='Verified'
          value={data?.verification_status?.verified ?? 0}
          icon={ChartBarIcon}
        />
        <StatsCard
          title='Unverified'
          value={data?.verification_status?.unverified ?? 0}
          icon={ChartBarIcon}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {data?.by_gender && Object.keys(data.by_gender).length > 0 && (
          <Card className='p-6'>
            <h3 className='text-sm font-medium text-gray-700 mb-4'>
              By Gender
            </h3>
            <ul className='space-y-2'>
              {Object.entries(data.by_gender).map(([key, count]) => (
                <li key={key} className='flex justify-between'>
                  <span className='capitalize'>{key}</span>
                  <span className='font-medium'>{count}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {data?.by_office && data.by_office.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-sm font-medium text-gray-700 mb-4'>
              By Office (Top 15)
            </h3>
            <ul className='space-y-2 max-h-64 overflow-y-auto'>
              {data.by_office.map((item, i) => (
                <li key={i} className='flex justify-between'>
                  <span>{item.name}</span>
                  <span className='font-medium'>{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {data?.by_designation && data.by_designation.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-sm font-medium text-gray-700 mb-4'>
              By Designation (Top 15)
            </h3>
            <ul className='space-y-2 max-h-64 overflow-y-auto'>
              {data.by_designation.map((item, i) => (
                <li key={i} className='flex justify-between'>
                  <span>{item.title}</span>
                  <span className='font-medium'>{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
        {data?.joining_trends && data.joining_trends.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-sm font-medium text-gray-700 mb-4'>
              Joining Trends (Last 12 Months)
            </h3>
            <ul className='space-y-2'>
              {data.joining_trends.slice(-6).map((item, i) => (
                <li key={i} className='flex justify-between'>
                  <span>{item.month}</span>
                  <span className='font-medium'>{item.count}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EmployeeReport;
