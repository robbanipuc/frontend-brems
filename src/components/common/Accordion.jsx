import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

const Accordion = ({
  items = [],
  defaultOpen = [],
  allowMultiple = true,
  className,
}) => {
  const [openItems, setOpenItems] = useState(defaultOpen);

  const toggleItem = (index) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div
      className={clsx(
        'divide-y divide-gray-200 border border-gray-200 rounded-lg',
        className
      )}
    >
      {items.map((item, index) => {
        const isOpen = openItems.includes(index);

        return (
          <div key={index}>
            <button
              type='button'
              onClick={() => toggleItem(index)}
              disabled={item.disabled}
              className={clsx(
                'flex w-full items-center justify-between px-4 py-4 text-left',
                'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500',
                'transition-colors duration-200',
                !item.disabled && 'hover:bg-gray-50',
                item.disabled && 'opacity-50 cursor-not-allowed',
                index === 0 && 'rounded-t-lg',
                index === items.length - 1 && !isOpen && 'rounded-b-lg'
              )}
            >
              <span className='text-sm font-medium text-gray-900'>
                {item.title}
              </span>
              <ChevronDownIcon
                className={clsx(
                  'h-5 w-5 text-gray-500 transition-transform duration-200',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <div
                className={clsx(
                  'px-4 pb-4 text-sm text-gray-600',
                  index === items.length - 1 && 'rounded-b-lg'
                )}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
