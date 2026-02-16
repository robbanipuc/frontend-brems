import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { officeService } from '@/services';
import {
  PageHeader,
  Card,
  Select,
  Alert,
  LoadingScreen,
  Button,
} from '@/components/common';
import { getErrorMessage } from '@/utils/helpers';

const VacantPostsReport = () => {
  const [offices, setOffices] = useState([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    officeService.getManaged().then(setOffices).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedOfficeId) {
      fetchVacantPosts();
    } else {
      setData(null);
    }
  }, [selectedOfficeId]);

  const fetchVacantPosts = async () => {
    if (!selectedOfficeId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await officeService.getVacantPosts(selectedOfficeId);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title='Vacant Posts (Sanctioned Strength)'
        subtitle='View total sanctioned posts, posted, and vacant per designation for an office'
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Reports', href: '/reports' },
          { label: 'Vacant Posts' },
        ]}
      />

      <Card className='mb-6'>
        <div className='p-4 border-b border-gray-200 flex flex-wrap items-end gap-4'>
          <Select
            label='Office'
            value={selectedOfficeId}
            onChange={(e) => setSelectedOfficeId(e.target.value)}
            options={[
              { value: '', label: 'Select office' },
              ...offices.map((o) => ({
                value: o.id,
                label: `${o.name} (${o.code})`,
              })),
            ]}
            placeholder='Select office'
            className='min-w-[280px]'
          />
          {data && selectedOfficeId && (
            <Link to={`/offices/${selectedOfficeId}/edit`}>
              <Button variant='outline' size='sm'>
                Edit office & posts
              </Button>
            </Link>
          )}
        </div>
      </Card>

      {error && (
        <Alert variant='error' className='mb-6' dismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && <LoadingScreen message='Loading vacant posts...' />}

      {!loading && selectedOfficeId && data && (
        <Card>
          <div className='p-4 border-b border-gray-200 flex items-center gap-2'>
            <BuildingOfficeIcon className='w-5 h-5 text-gray-500' />
            <h2 className='text-lg font-semibold text-gray-900'>
              {data.office?.name} ({data.office?.code})
            </h2>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    Designation Name
                  </th>
                  <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                    Total Post
                  </th>
                  <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                    Posted
                  </th>
                  <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase'>
                    Vacant post
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.rows.map((row) => (
                  <tr key={row.designation_id} className='hover:bg-gray-50'>
                    <td className='px-4 py-3 text-sm text-gray-900'>{row.designation_name}</td>
                    <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                      {row.total_posts}
                    </td>
                    <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                      {row.posted}
                    </td>
                    <td className='px-4 py-3 text-sm text-right'>
                      <span
                        className={
                          row.vacant > 0 ? 'font-medium text-amber-600' : 'text-gray-500'
                        }
                      >
                        {row.vacant}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className='bg-gray-100 font-semibold'>
                  <td className='px-4 py-3 text-sm text-gray-900'>Total</td>
                  <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                    {data.totals?.total_posts ?? 0}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-900 text-right'>
                    {data.totals?.posted ?? 0}
                  </td>
                  <td className='px-4 py-3 text-sm text-right'>
                    <span className='text-amber-600'>
                      {data.totals?.vacant ?? 0}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && selectedOfficeId && !data?.rows?.length && !error && (
        <Card>
          <div className='p-8 text-center text-gray-500'>
            No designations found for this office. Add designations for this office (or global
            designations) first. To set sanctioned posts, edit the office.
          </div>
        </Card>
      )}
    </div>
  );
};

export default VacantPostsReport;
