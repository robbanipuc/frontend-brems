import { BriefcaseIcon, BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/common';
import { formatDate, formatCurrency } from '@/utils/helpers';

const EmploymentTab = ({ employee }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Employment Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Position */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BriefcaseIcon className="w-5 h-5 text-gray-400" />
            Current Position
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Designation:</dt>
              <dd className="text-gray-900 font-medium">{employee.designation?.title || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Grade:</dt>
              <dd className="text-gray-900">{employee.designation?.grade || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Basic Salary:</dt>
              <dd className="text-gray-900 font-medium">
                {employee.designation?.salary_range ? `৳${employee.designation.salary_range}` : '-'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Current Office */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
            Current Office
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Office:</dt>
              <dd className="text-gray-900 font-medium">{employee.office?.name || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Code:</dt>
              <dd className="text-gray-900">{employee.office?.code || '-'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Location:</dt>
              <dd className="text-gray-900">{employee.office?.location || '-'}</dd>
            </div>
          </dl>
        </div>

        {/* Employment Dates */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            Important Dates
          </h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Joining Date:</dt>
              <dd className="text-gray-900">{formatDate(employee.joining_date)}</dd>
            </div>
            {employee.released_at && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Released Date:</dt>
                <dd className="text-gray-900">{formatDate(employee.released_at)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Status:</dt>
              <dd>
                <Badge variant={
                  employee.status === 'active' ? 'success' :
                  employee.status === 'released' ? 'warning' : 'default'
                }>
                  {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>

        {/* Statistics */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Career Statistics</h4>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Total Transfers:</dt>
              <dd className="text-gray-900 font-medium">{employee.transfers?.length || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Total Promotions:</dt>
              <dd className="text-gray-900 font-medium">{employee.promotions?.length || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Verification:</dt>
              <dd>
                <Badge variant={employee.is_verified ? 'success' : 'warning'}>
                  {employee.is_verified ? 'Verified' : 'Pending'}
                </Badge>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default EmploymentTab;