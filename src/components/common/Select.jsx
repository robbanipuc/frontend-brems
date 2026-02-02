import { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Select = forwardRef(({
  label,
  options = [],
  error,
  hint,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className,
  selectClassName,
  ...props
}, ref) => {
  const selectClasses = clsx(
    'block w-full rounded-lg border shadow-sm text-sm transition-colors duration-200',
    'focus:outline-none focus:ring-2',
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
    'appearance-none bg-white pr-10 pl-3 py-2',
    error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
    selectClassName
  );

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
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

Select.displayName = 'Select';

export default Select;