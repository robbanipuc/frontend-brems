import { useState } from 'react';
import clsx from 'clsx';

const Tabs = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  fullWidth = false,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const variants = {
    underline: {
      container: 'border-b border-gray-200',
      tab: (isActive) =>
        clsx(
          'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
          isActive
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ),
    },
    pills: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: (isActive) =>
        clsx(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        ),
    },
    boxed: {
      container: 'border border-gray-200 rounded-lg p-1',
      tab: (isActive) =>
        clsx(
          'px-4 py-2 text-sm font-medium rounded-md transition-colors',
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        ),
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className={clsx('min-w-0', className)}>
      {/* Tab List - scrollable on small screens when many tabs */}
      <div
        className={clsx(
          'flex flex-nowrap',
          !fullWidth && 'overflow-x-auto overflow-y-hidden -mx-px',
          currentVariant.container,
          fullWidth && 'w-full'
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type='button'
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={clsx(
              'flex-shrink-0',
              currentVariant.tab(activeTab === tab.id),
              fullWidth && 'flex-1 min-w-0',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span className='flex items-center justify-center gap-2'>
              {tab.icon && <tab.icon className='w-5 h-5' />}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={clsx(
                    'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTabData?.content && (
        <div className='mt-4 min-w-0 overflow-x-auto'>
          {activeTabData.content}
        </div>
      )}
    </div>
  );
};

export default Tabs;
