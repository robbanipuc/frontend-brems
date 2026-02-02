import clsx from 'clsx';

const RadioGroup = ({
  label,
  name,
  options = [],
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  inline = false,
  className,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className={clsx(
        'space-y-2',
        inline && 'sm:space-y-0 sm:space-x-6 sm:flex sm:items-center'
      )}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled || option.disabled}
              className={clsx(
                'h-4 w-4 border-gray-300 text-primary-600',
                'focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            />
            <label 
              htmlFor={`${name}-${option.value}`}
              className={clsx(
                'ml-3 text-sm font-medium',
                disabled || option.disabled ? 'text-gray-400' : 'text-gray-700'
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default RadioGroup;