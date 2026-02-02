import clsx from 'clsx';

const colors = {
  primary: 'bg-primary-600',
  secondary: 'bg-secondary-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  danger: 'bg-red-600',
  info: 'bg-blue-600',
};

const sizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
  xl: 'h-4',
};

const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  label,
  animated = false,
  striped = false,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={clsx(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={clsx(
            'rounded-full transition-all duration-500 ease-out',
            sizes[size],
            colors[color],
            striped && 'bg-stripes',
            animated && striped && 'animate-stripes'
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;