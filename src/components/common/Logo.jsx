import logoImage from '@/assets/images/br-logo.png';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    xs: 'h-8 w-8',
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
    '2xl': 'h-24 w-24',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoImage}
        alt='Bangladesh Railway Logo'
        className={`${sizes[size]} object-contain`}
      />
      {showText && (
        <div className='flex flex-col'>
          <span className={`font-bold text-gray-900 ${textSizes[size]}`}>
            Bangladesh Railway
          </span>
          <span
            className={`text-gray-500 ${size === 'xs' ? 'text-[10px]' : 'text-xs'}`}
          >
            Employee Management System
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
