import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  onClear,
}) => {
  return (
    <div className={clsx('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          'block w-full pl-10 pr-10 py-2 text-sm',
          'border border-gray-300 rounded-lg shadow-sm',
          'placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'transition-colors duration-200'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;