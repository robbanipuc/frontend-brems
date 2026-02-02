import clsx from 'clsx';
import { FolderIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FolderIcon,
  title = 'No data found',
  description,
  action,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 max-w-sm">{description}</p>
      )}
      {(action || (actionLabel && onAction)) && (
        <div className="mt-6">
          {action || (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;