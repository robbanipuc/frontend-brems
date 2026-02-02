import clsx from 'clsx';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
  count = 1,
  circle = false,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';

  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'rounded-full',
    thumbnail: 'rounded-lg',
    button: 'h-10 rounded-lg',
    card: 'rounded-xl',
  };

  const elements = [];

  for (let i = 0; i < count; i++) {
    elements.push(
      <div
        key={i}
        className={clsx(
          baseClasses,
          variants[variant],
          circle && 'rounded-full',
          className
        )}
        style={{
          width: width || (variant === 'avatar' ? '40px' : '100%'),
          height: height || (variant === 'avatar' ? '40px' : undefined),
        }}
      />
    );
  }

  if (count === 1) {
    return elements[0];
  }

  return <div className="space-y-2">{elements}</div>;
};

// Preset skeletons
export const SkeletonCard = ({ className }) => (
  <div className={clsx('bg-white rounded-xl border border-gray-200 p-6', className)}>
    <div className="flex items-center gap-4">
      <Skeleton variant="avatar" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className }) => (
  <div className={clsx('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
    <div className="bg-gray-50 px-6 py-3 flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" width={`${100 / columns}%`} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="px-6 py-4 flex gap-4 border-t border-gray-200">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" width={`${100 / columns}%`} />
        ))}
      </div>
    ))}
  </div>
);

export default Skeleton;