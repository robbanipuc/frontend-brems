// Export all hooks from a single file
export { useAuth } from '@/context/AuthContext';
export { useApi, usePaginatedApi, useMutation } from './useApi';
export { usePermissions, useRouteAccess, useDefaultRedirect } from './usePermissions';
export { useDebounce, useDebouncedCallback, useThrottledCallback } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useOutsideClick } from './useOutsideClick';