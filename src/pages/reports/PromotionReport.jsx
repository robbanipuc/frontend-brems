import { useState, useEffect } from 'react';
import { TrophyIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { reportService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  StatsCard,
  Table,
  Alert,
  LoadingScreen,
} from '@/components/common';
import { formatDate, getFullName, getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const PromotionReport = () => {
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
      const result = await reportService.getPromotionReport();
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
      await reportService.exportPromotionsPdf();
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
        <PageHeader title='Promotion Report' />
        <Alert variant='error' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      </div>
    );
  }

  const summary = data?.summary ?? {};
  const promotions = data?.promotions ?? [];

  const columns = [
    {
      key: 'promotion_date',
      header: 'Date',
      render: (_, row) => formatDate(row.promotion_date),
    },
    {
      key: 'employee',
      header: 'Employee',
      render: (_, row) =>
        row.employee
          ? getFullName(row.employee.first_name, row.employee.last_name)
          : '-',
    },
    {
      key: 'designation',
      header: 'New Designation',
      render: (_, row) => row.new_designation?.title ?? '-',
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (_, row) => row.new_designation?.grade ?? '-',
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Promotion Report'
        subtitle='Promotion history and statistics'
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

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <StatsCard
          title='Total Promotions'
          value={summary.total_promotions ?? 0}
          icon={TrophyIcon}
        />
        <StatsCard
          title='Unique Employees'
          value={summary.unique_employees ?? 0}
          icon={TrophyIcon}
        />
        <StatsCard
          title='Designations'
          value={summary.unique_designations ?? 0}
          icon={TrophyIcon}
        />
      </div>

      <Card>
        <h3 className='p-4 text-sm font-medium text-gray-700 border-b border-gray-200'>
          Promotion List
        </h3>
        {promotions.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            No promotions found
          </div>
        ) : (
          <Table columns={columns} data={promotions} />
        )}
      </Card>
    </div>
  );
};

export default PromotionReport;
