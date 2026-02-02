import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

const Dropdown = ({
  trigger,
  triggerClassName,
  items = [],
  align = 'right',
  width = 'w-56',
  className,
}) => {
  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <Menu as="div" className={clsx('relative inline-block text-left', className)}>
      <Menu.Button className={triggerClassName}>
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            'absolute z-50 mt-2 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            alignmentClasses[align],
            width
          )}
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.type === 'divider') {
                return <div key={index} className="my-1 border-t border-gray-100" />;
              }

              if (item.type === 'header') {
                return (
                  <div
                    key={index}
                    className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {item.label}
                  </div>
                );
              }

              return (
                <Menu.Item key={index} disabled={item.disabled}>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={item.onClick}
                      disabled={item.disabled}
                      className={clsx(
                        'flex w-full items-center px-4 py-2 text-sm',
                        active && !item.disabled && 'bg-gray-100',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        item.danger && 'text-red-600',
                        !item.danger && 'text-gray-700'
                      )}
                    >
                      {item.icon && (
                        <item.icon
                          className={clsx(
                            'mr-3 h-5 w-5',
                            item.danger ? 'text-red-500' : 'text-gray-400'
                          )}
                        />
                      )}
                      {item.label}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

// Preset dropdown button with chevron
export const DropdownButton = ({
  label,
  items,
  variant = 'outline',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  return (
    <Dropdown
      {...props}
      items={items}
      trigger={
        <span
          className={clsx(
            'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
            variants[variant],
            sizes[size]
          )}
        >
          {label}
          <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5" />
        </span>
      }
    />
  );
};

export default Dropdown;