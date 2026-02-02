import { forwardRef } from 'react';
import clsx from 'clsx';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

const DatePicker = forwardRef(({
  label,
  error,
  hint,
  required = false,
  disabled = false,
  min,
  max,
  className,
  inputClassName,
  ...props
}, ref) => {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type="date"
          disabled={disabled}
          min={min}
          max={max}
          className={clsx(
            'block w-full rounded-lg border shadow-sm text-sm transition-colors duration-200',
            'placeholder-gray-400 px-3 py-2 pr-10',
            'focus:outline-none focus:ring-2',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
            inputClassName
          )}
          {...props}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;