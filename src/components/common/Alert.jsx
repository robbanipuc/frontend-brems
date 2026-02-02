import clsx from 'clsx';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

const variants = {
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-400',
    title: 'text-green-800',
    description: 'text-green-700',
    Icon: CheckCircleIcon,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    description: 'text-yellow-700',
    Icon: ExclamationTriangleIcon,
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-400',
    title: 'text-red-800',
    description: 'text-red-700',
    Icon: XCircleIcon,
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    description: 'text-blue-700',
    Icon: InformationCircleIcon,
  },
};

const Alert = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
  actions,
}) => {
  const styles = variants[variant];
  const Icon = styles.Icon;

  return (
    <div
      className={clsx(
        'rounded-lg border p-4',
        styles.container,
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={clsx('h-5 w-5', styles.icon)} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={clsx('text-sm font-medium', styles.title)}>
              {title}
            </h3>
          )}
          {children && (
            <div className={clsx('text-sm', styles.description, title && 'mt-2')}>
              {children}
            </div>
          )}
          {actions && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                {actions}
              </div>
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={clsx(
                  'inline-flex rounded-md p-1.5',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  variant === 'success' && 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600',
                  variant === 'warning' && 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
                  variant === 'error' && 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600',
                  variant === 'info' && 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                )}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;