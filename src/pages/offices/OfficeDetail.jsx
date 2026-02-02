import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  MapPinIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { usePermissions } from '@/hooks/usePermissions';
import { officeService } from '@/services';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Avatar,
  Alert,
  LoadingScreen,
  EmptyState,
  Table,
} from '@/components/common';
import { formatDate, getErrorMessage } from '@/utils/helpers';

const OfficeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const permissions = usePermissions();

  const [office, setOffice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOffice();
  }, [id]);

  const fetchOffice = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await officeService.getById(id);
      setOffice(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading office details..." />;
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="error" title="Error loading office">
          {error}
        </Alert>
        <Button className="mt-4" onClick={() => navigate('/offices')}>
          Back to Offices
        </Button>
      </div>
    );
  }

  if (!office) {
    return (
      <div className="p-8">
        <Alert variant="error" title="Office not found">
          The requested office could not be found.
        </Alert>
        <Button className="mt-4" onClick={() => navigate('/offices')}>
          Back to Offices
        </Button>
      </div>
    );
  }

  const employeeColumns = [
    {
      key: 'name',
      header: 'Employee',
      render: (_, employee) => (
        <div className="flex items-center gap-3">
          <Avatar
            name={`${employee.first_name} ${employee.last_name}`}
            size="sm"
          />
          <div>
            <Link
              to={`/employees/${employee.id}`}
              className="font-medium text-gray-900 hover:text-primary-600"
            >
              {employee.first_name} {employee.last_name}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      render: (_, employee) => employee.designation?.title || '-',
    },
  ];

  return (
    <div>
      <PageHeader
        title={office.name}
        subtitle={office.code}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Offices', href: '/offices' },
          { label: office.name },
        ]}
        actions={
          permissions.canEditOffice && (
            <Button
              variant="outline"
              icon={PencilSquareIcon}
              onClick={() => navigate(`/offices?action=edit&id=${office.id}`)}
            >
              Edit Office
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Office Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Office Information</Card.Title>
            </Card.Header>
            <Card.Body className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{office.name}</p>
                  <p className="text-sm text-gray-500">{office.code}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-500">{office.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <UserGroupIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Employees</p>
                    <p className="text-sm text-gray-500">
                      {office.employees?.length || 0} active employees
                    </p>
                  </div>
                </div>

                {office.parent && (
                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Parent Office</p>
                      <Link
                        to={`/offices/${office.parent.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {office.parent.name}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Admin Status</span>
                  <Badge variant={office.has_admin ? 'success' : 'warning'}>
                    {office.has_admin ? 'Has Admin' : 'No Admin'}
                  </Badge>
                </div>
                {office.admin && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{office.admin.name}</p>
                    <p className="text-xs text-gray-500">{office.admin.email}</p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>

          {/* Child Offices */}
          {office.children && office.children.length > 0 && (
            <Card>
              <Card.Header>
                <Card.Title>Child Offices ({office.children.length})</Card.Title>
              </Card.Header>
              <Card.Body className="p-0">
                <ul className="divide-y divide-gray-200">
                  {office.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        to={`/offices/${child.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{child.name}</p>
                          <p className="text-sm text-gray-500">{child.code}</p>
                        </div>
                        <Badge variant={child.has_admin ? 'success' : 'warning'} size="sm">
                          {child.has_admin ? 'Admin' : 'No Admin'}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Employees List */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header className="flex items-center justify-between">
              <Card.Title>Employees ({office.employees?.length || 0})</Card.Title>
              {permissions.canCreateEmployee && (
                <Link to={`/employees/create?office_id=${office.id}`}>
                  <Button size="sm" icon={UserPlusIcon}>
                    Add Employee
                  </Button>
                </Link>
              )}
            </Card.Header>
            {office.employees && office.employees.length > 0 ? (
              <Table
                columns={employeeColumns}
                data={office.employees}
                onRowClick={(emp) => navigate(`/employees/${emp.id}`)}
              />
            ) : (
              <Card.Body>
                <EmptyState
                  icon={UserGroupIcon}
                  title="No employees"
                  description="This office has no employees assigned yet"
                  actionLabel={permissions.canCreateEmployee ? 'Add Employee' : undefined}
                  onAction={permissions.canCreateEmployee ? () => navigate(`/employees/create?office_id=${office.id}`) : undefined}
                />
              </Card.Body>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfficeDetail;