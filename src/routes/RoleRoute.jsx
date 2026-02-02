import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDefaultRedirect } from '@/hooks/usePermissions';
import { Alert } from '@/components/common';

const RoleRoute = ({ children, allowedRoles = [], fallback = null }) => {
  const { user, hasRole } = useAuth();
  const defaultRedirect = useDefaultRedirect();

  // Check if user has required role
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // If fallback provided, show it
    if (fallback) {
      return fallback;
    }

    // Show access denied message
    return (
      <div className="p-8">
        <Alert variant="error" title="Access Denied">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </Alert>
      </div>
    );
  }

  return children;
};

export default RoleRoute;