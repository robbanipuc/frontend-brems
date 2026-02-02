import { Link } from 'react-router-dom';
import {
  Cog6ToothIcon,
  KeyIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { PageHeader, Card } from '@/components/common';

const Settings = () => {
  return (
    <div className='space-y-6'>
      <PageHeader title='Settings' subtitle='Manage your account settings' />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl'>
        <Link to='/my-profile'>
          <Card className='p-6 hover:border-primary-300 transition-colors cursor-pointer'>
            <div className='flex items-center gap-4'>
              <div className='p-3 rounded-lg bg-primary-100'>
                <UserCircleIcon className='w-6 h-6 text-primary-600' />
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>Profile</h3>
                <p className='text-sm text-gray-500'>
                  View and edit your profile information
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to='/settings/password'>
          <Card className='p-6 hover:border-primary-300 transition-colors cursor-pointer'>
            <div className='flex items-center gap-4'>
              <div className='p-3 rounded-lg bg-primary-100'>
                <KeyIcon className='w-6 h-6 text-primary-600' />
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>Change Password</h3>
                <p className='text-sm text-gray-500'>
                  Update your account password
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
