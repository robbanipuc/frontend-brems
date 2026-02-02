import clsx from 'clsx';
import { formatDate } from '@/utils/helpers';

const Timeline = ({ items = [], className }) => {
  return (
    <div className={clsx('flow-root', className)}>
      <ul className="-mb-8">
        {items.map((item, index) => (
          <li key={item.id || index}>
            <div className="relative pb-8">
              {/* Connector line */}
              {index < items.length - 1 && (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}

              <div className="relative flex items-start space-x-3">
                {/* Icon */}
                <div
                  className={clsx(
                    'relative flex h-10 w-10 items-center justify-center rounded-full',
                    item.iconBackground || 'bg-gray-100'
                  )}
                >
                  {item.icon ? (
                    <item.icon
                      className={clsx('h-5 w-5', item.iconColor || 'text-gray-500')}
                    />
                  ) : (
                    <span
                      className={clsx(
                        'h-3 w-3 rounded-full',
                        item.dotColor || 'bg-gray-400'
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    {item.date && (
                      <time className="text-sm text-gray-500">
                        {typeof item.date === 'string'
                          ? item.date
                          : formatDate(item.date)}
                      </time>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  )}
                  {item.content && (
                    <div className="mt-2">{item.content}</div>
                  )}
                  {item.metadata && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.metadata.map((meta, metaIndex) => (
                        <span
                          key={metaIndex}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                        >
                          {meta}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Timeline;