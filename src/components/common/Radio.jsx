import { forwardRef } from 'react';
import clsx from 'clsx';

const Radio = forwardRef(({
  label,
  description,
  error,
  disabled = false,
  className,
  ...props
}, ref) => {
  return (
    <div className={clsx('relative flex items-start', className)}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          className={clsx(
            'h-4 w-4 border-gray-300 text-primary-600',
            'focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200'
          )}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm">
          {label && (
            <label 
              htmlFor={props.id} 
              className={clsx(
                'font-medium',
                disabled ? 'text-gray-400' : 'text-gray-700'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
          {error && (
            <p className="text-red-600 mt-1">{error}</p>
          )}
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;