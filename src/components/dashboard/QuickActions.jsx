import { Link } from 'react-router-dom';
import {
  UserPlusIcon,
  BuildingOfficeIcon,
  DocumentPlusIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { Card } from '@/components/common';
import { usePermissions } from '@/hooks/usePermissions';
import { useLanguage } from '@/context/LanguageContext';

const QuickActions = () => {
  const permissions = usePermissions();
  const { t } = useLanguage();

  const actions = [
    { nameKey: 'dashboard.addEmployee', descKey: 'dashboard.addEmployeeDesc', href: '/employees/create', icon: UserPlusIcon, color: 'bg-blue-500', show: permissions.canCreateEmployee },
    { nameKey: 'dashboard.addOffice', descKey: 'dashboard.addOfficeDesc', href: '/offices?action=create', icon: BuildingOfficeIcon, color: 'bg-green-500', show: permissions.canCreateOffice },
    { nameKey: 'dashboard.createForm', descKey: 'dashboard.createFormDesc', href: '/forms/create', icon: ClipboardDocumentListIcon, color: 'bg-purple-500', show: permissions.canCreateForm },
    { nameKey: 'dashboard.transferEmployee', descKey: 'dashboard.transferEmployeeDesc', href: '/employees/released', icon: ArrowsRightLeftIcon, color: 'bg-orange-500', show: permissions.canTransferEmployee },
    { nameKey: 'dashboard.viewReports', descKey: 'dashboard.viewReportsDesc', href: '/reports/employees', icon: ChartBarIcon, color: 'bg-indigo-500', show: permissions.canViewReports },
    { nameKey: 'dashboard.profileRequests', descKey: 'dashboard.profileRequestsDesc', href: '/profile-requests', icon: DocumentPlusIcon, color: 'bg-pink-500', show: permissions.canProcessRequests },
  ];

  const visibleActions = actions.filter(action => action.show);

  if (visibleActions.length === 0) return null;

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('dashboard.quickActions')}</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {visibleActions.map((action) => (
            <Link
              key={action.nameKey}
              to={action.href}
              className="group flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
            >
              <div className={`p-3 rounded-lg ${action.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">
                {t(action.nameKey)}
              </span>
              <span className="text-xs text-gray-500 text-center mt-1">
                {t(action.descKey)}
              </span>
            </Link>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuickActions;