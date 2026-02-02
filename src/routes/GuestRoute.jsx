import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useDefaultRedirect } from '@/hooks/usePermissions';
import { LoadingScreen } from '@/components/common';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, initialized } = useAuth();
  const defaultRedirect = useDefaultRedirect();
  const location = useLocation();

  // Show loading while checking auth
  if (!initialized || loading) {
    return <LoadingScreen message="Loading..." />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || defaultRedirect;
    return <Navigate to={from} replace />;
  }

  return children;
};

export default GuestRoute;