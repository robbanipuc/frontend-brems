import { Switch as HeadlessSwitch } from '@headlessui/react';
import clsx from 'clsx';

const Switch = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      dot: 'h-4 w-4',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'h-6 w-11',
      dot: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'h-7 w-14',
      dot: 'h-6 w-6',
      translate: 'translate-x-7',
    },
  };

  const currentSize = sizes[size];

  return (
    <HeadlessSwitch.Group>
      <div className={clsx('flex items-center', className)}>
        <HeadlessSwitch
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={clsx(
            'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            checked ? 'bg-primary-600' : 'bg-gray-200',
            disabled && 'opacity-50 cursor-not-allowed',
            currentSize.switch
          )}
        >
          <span
            className={clsx(
              'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              checked ? currentSize.translate : 'translate-x-0',
              currentSize.dot
            )}
          />
        </HeadlessSwitch>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <HeadlessSwitch.Label
                className={clsx(
                  'text-sm font-medium',
                  disabled ? 'text-gray-400' : 'text-gray-900'
                )}
              >
                {label}
              </HeadlessSwitch.Label>
            )}
            {description && (
              <HeadlessSwitch.Description className="text-sm text-gray-500">
                {description}
              </HeadlessSwitch.Description>
            )}
          </div>
        )}
      </div>
    </HeadlessSwitch.Group>
  );
};

export default Switch;