import { forwardRef } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef(({
  label,
  error,
  hint,
  required = false,
  disabled = false,
  rows = 4,
  className,
  textareaClassName,
  ...props
}, ref) => {
  const textareaClasses = clsx(
    'block w-full rounded-lg border shadow-sm text-sm transition-colors duration-200',
    'placeholder-gray-400 px-3 py-2',
    'focus:outline-none focus:ring-2',
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
    'resize-none',
    error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
    textareaClassName
  );

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;