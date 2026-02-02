import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  hint,
  required = false,
  disabled = false,
  className,
  inputClassName,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  ...props
}, ref) => {
  const inputClasses = clsx(
    'block w-full rounded-lg border shadow-sm text-sm transition-colors duration-200',
    'placeholder-gray-400',
    'focus:outline-none focus:ring-2',
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
    error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
    LeftIcon && 'pl-10',
    RightIcon && 'pr-10',
    !LeftIcon && !RightIcon && 'px-3',
    'py-2',
    inputClassName
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
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {RightIcon && (
          <div
            className={clsx(
              'absolute inset-y-0 right-0 pr-3 flex items-center',
              onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
            )}
            onClick={onRightIconClick}
          >
            <RightIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </div>
        )}
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

Input.displayName = 'Input';

export default Input;