import { useState, useEffect } from 'react';
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
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

const TransferReport = () => {
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
      const result = await reportService.getTransferReport();
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
      await reportService.exportTransfersPdf();
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
        <PageHeader title='Transfer Report' />
        <Alert variant='error' onDismiss={() => setError(null)}>
          {error}
        </Alert>
      </div>
    );
  }

  const summary = data?.summary ?? {};
  const transfers = data?.transfers ?? [];

  const columns = [
    {
      key: 'transfer_date',
      header: 'Date',
      render: (_, row) => formatDate(row.transfer_date),
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
      key: 'from',
      header: 'From Office',
      render: (_, row) => row.from_office?.name ?? '-',
    },
    {
      key: 'to',
      header: 'To Office',
      render: (_, row) => row.to_office?.name ?? '-',
    },
  ];

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Transfer Report'
        subtitle='Transfer history and statistics'
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
          title='Total Transfers'
          value={summary.total_transfers ?? 0}
          icon={ArrowPathIcon}
        />
        <StatsCard
          title='Transfers In'
          value={summary.transfers_in ?? 0}
          icon={ArrowPathIcon}
        />
        <StatsCard
          title='Initial Postings'
          value={summary.initial_postings ?? 0}
          icon={ArrowPathIcon}
        />
        <StatsCard
          title='Unique Employees'
          value={summary.unique_employees ?? 0}
          icon={ArrowPathIcon}
        />
      </div>

      <Card>
        <h3 className='p-4 text-sm font-medium text-gray-700 border-b border-gray-200'>
          Transfer List
        </h3>
        {transfers.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            No transfers found
          </div>
        ) : (
          <Table columns={columns} data={transfers} />
        )}
      </Card>
    </div>
  );
};

export default TransferReport;
