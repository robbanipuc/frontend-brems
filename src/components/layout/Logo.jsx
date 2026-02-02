import { Link } from 'react-router-dom';
import clsx from 'clsx';

const Logo = ({ collapsed = false, className }) => {
  return (
    <Link to="/" className={clsx('flex items-center gap-3', className)}>
      {/* Logo placeholder - Replace with actual Bangladesh Railway logo */}
      <div className="flex-shrink-0 w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h8m-8 4h8m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
          />
        </svg>
      </div>
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900 leading-tight">
            BREMS
          </span>
          <span className="text-xs text-gray-500 leading-tight">
            Bangladesh Railway
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;