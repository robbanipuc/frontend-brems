import clsx from 'clsx';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/20/solid';

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'bg-primary-100 text-primary-600',
  trend,
  trendLabel,
  loading = false,
  className,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl p-6 border border-gray-200 shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          )}
          {(subtitle || trend !== undefined) && (
            <div className="mt-2 flex items-center gap-2">
              {trend !== undefined && (
                <span
                  className={clsx(
                    'inline-flex items-center text-sm font-medium',
                    trend > 0 && 'text-green-600',
                    trend < 0 && 'text-red-600',
                    trend === 0 && 'text-gray-500'
                  )}
                >
                  {trend > 0 ? (
                    <ArrowUpIcon className="w-4 h-4 mr-0.5" />
                  ) : trend < 0 ? (
                    <ArrowDownIcon className="w-4 h-4 mr-0.5" />
                  ) : null}
                  {Math.abs(trend)}%
                </span>
              )}
              {(subtitle || trendLabel) && (
                <span className="text-sm text-gray-500">
                  {subtitle || trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={clsx(
              'flex-shrink-0 p-3 rounded-lg',
              iconColor
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;