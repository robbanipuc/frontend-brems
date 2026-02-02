import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { reportService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  StatsCard,
  Table,
  Badge,
  Alert,
  LoadingScreen,
} from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';
import toast from 'react-hot-toast';

const OfficeReport = () => {
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
      const result = await reportService.getOfficeReport();
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
      await reportService.exportOfficesPdf();
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
        <PageHeader title='Office Report' />
        <Alert variant='error' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      </div>
    );
  }

  const summary = data?.summary ?? {};
  const offices = data?.offices ?? [];

  const columns = [
    {
      key: 'name',
      header: 'Office',
      render: (_, row) => (
        <Link
          to={`/offices/${row.id}`}
          className='font-medium text-primary-600 hover:underline'
        >
          {row.name}
        </Link>
      ),
    },
    { key: 'code', header: 'Code', render: (_, row) => row.code ?? '-' },
    {
      key: 'total_employees',
      header: 'Employees',
      render: (_, row) => row.total_employees ?? 0,
    },
    {
      key: 'has_admin',
      header: 'Admin',
      render: (_, row) => (
        <Badge variant={row.has_admin ? 'success' : 'warning'}>
          {row.has_admin ? 'Yes' : 'No'}
        </Badge>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Office Report'
        subtitle='Office directory and employee distribution'
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
          title='Total Offices'
          value={summary.total_offices ?? 0}
          icon={BuildingOfficeIcon}
        />
        <StatsCard
          title='With Admin'
          value={summary.offices_with_admin ?? 0}
          icon={BuildingOfficeIcon}
        />
        <StatsCard
          title='Without Admin'
          value={summary.offices_without_admin ?? 0}
          icon={BuildingOfficeIcon}
        />
        <StatsCard
          title='Total Employees'
          value={summary.total_employees ?? 0}
          icon={BuildingOfficeIcon}
        />
      </div>

      <Card>
        <h3 className='p-4 text-sm font-medium text-gray-700 border-b border-gray-200'>
          Office List
        </h3>
        {offices.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>No offices found</div>
        ) : (
          <Table columns={columns} data={offices} />
        )}
      </Card>
    </div>
  );
};

export default OfficeReport;
