import { Link } from 'react-router-dom';
import logoImage from '@/assets/images/br-logo.png';

const Logo = ({ collapsed = false, linkTo = '/dashboard', className = '' }) => {
  return (
    <Link
      to={linkTo}
      className={`flex items-center gap-3 overflow-hidden group ${className}`}
      title={collapsed ? 'Bangladesh Railway EMS' : undefined}
    >
      <div className='relative'>
        <img
          src={logoImage}
          alt='Bangladesh Railway'
          className={`object-contain flex-shrink-0 transition-all duration-300 ${
            collapsed ? 'h-10 w-10' : 'h-12 w-12'
          }`}
        />
        {/* Tooltip for collapsed state */}
        {collapsed && (
          <div className='absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50'>
            Bangladesh Railway EMS
          </div>
        )}
      </div>
      {!collapsed && (
        <div className='flex flex-col min-w-0'>
          <span className='font-bold text-gray-900 text-sm leading-tight truncate'>
            BREMS
          </span>
          <span className='text-xs text-gray-500 leading-tight'>
            Bangladesh Railway
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
