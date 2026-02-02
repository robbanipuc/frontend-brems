import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/utils/constants';

/**
 * Custom hook for permission checks
 */
export const usePermissions = () => {
  const { user, isSuperAdmin, isOfficeAdmin, isVerifiedUser, isAdmin } = useAuth();

  const permissions = useMemo(() => ({
    // Dashboard
    canViewDashboard: isAdmin(),
    
    // Employees
    canViewEmployees: isAdmin(),
    canCreateEmployee: isAdmin(),
    canEditEmployee: isAdmin(),
    canDeleteEmployee: isSuperAdmin(),
    canPromoteEmployee: isSuperAdmin(),
    canTransferEmployee: isAdmin(),
    canRetireEmployee: isSuperAdmin(),
    canVerifyEmployee: isAdmin(),
    canReleaseEmployee: isAdmin(),
    canExportEmployees: isAdmin(),
    
    // Own Profile
    canViewOwnProfile: !!user,
    canRequestProfileChange: !!user && !!user.employee_id,
    
    // Offices
    canViewOffices: !!user,
    canCreateOffice: isSuperAdmin(),
    canEditOffice: isSuperAdmin(),
    canDeleteOffice: isSuperAdmin(),
    
    // Designations
    canViewDesignations: !!user,
    canCreateDesignation: isSuperAdmin(),
    canEditDesignation: isSuperAdmin(),
    canDeleteDesignation: isSuperAdmin(),
    
    // Users
    canViewUsers: isAdmin(),
    canCreateUser: isAdmin(),
    canEditUser: isAdmin(),
    canDeleteUser: isSuperAdmin(),
    canAssignOfficeAdmin: isAdmin(),
    
    // Profile Requests
    canViewAllRequests: isAdmin(),
    canViewOwnRequests: !!user && !!user.employee_id,
    canProcessRequests: isAdmin(),
    canSubmitRequest: !!user && !!user.employee_id,
    
    // Forms
    canViewForms: !!user,
    canCreateForm: isSuperAdmin(),
    canEditForm: isSuperAdmin(),
    canDeleteForm: isSuperAdmin(),
    canSubmitForm: !!user && !!user.employee_id,
    canViewSubmissions: isAdmin(),
    canProcessSubmissions: isAdmin(),
    
    // Reports
    canViewReports: isAdmin(),
    canExportReports: isAdmin(),
    
    // History
    canViewHistory: !!user,
    canEditHistory: isSuperAdmin(),
    
    // Files
    canUploadFiles: isAdmin() || (!!user && !!user.employee_id),
    canDeleteFiles: isAdmin(),
  }), [user, isSuperAdmin, isOfficeAdmin, isVerifiedUser, isAdmin]);

  return permissions;
};

/**
 * Check if user can access a specific route
 */
export const useRouteAccess = (allowedRoles) => {
  const { user, hasRole } = useAuth();

  return useMemo(() => {
    if (!user) return false;
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return hasRole(allowedRoles);
  }, [user, hasRole, allowedRoles]);
};

/**
 * Get role-based redirect path
 */
export const useDefaultRedirect = () => {
  const { user, isSuperAdmin, isOfficeAdmin } = useAuth();

  return useMemo(() => {
    if (!user) return '/login';
    if (isSuperAdmin() || isOfficeAdmin()) return '/dashboard';
    return '/my-profile';
  }, [user, isSuperAdmin, isOfficeAdmin]);
};

export default usePermissions;