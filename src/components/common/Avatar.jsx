import clsx from 'clsx';
import { getInitials, getAvatarColor } from '@/utils/helpers';

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-xl',
};

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className,
  showStatus = false,
  status = 'offline',
}) => {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
  };

  return (
    <div className={clsx('relative inline-flex', className)}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={clsx(
            'rounded-full object-cover',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center font-medium text-white',
            sizes[size],
            bgColor
          )}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;