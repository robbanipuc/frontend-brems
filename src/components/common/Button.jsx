import { forwardRef } from 'react';
import clsx from 'clsx';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm',
  outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  'outline-primary': 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  'outline-danger': 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500',
  ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500',
  link: 'text-primary-600 hover:text-primary-700 hover:underline focus:ring-primary-500 p-0',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
  xl: 'px-6 py-3 text-base',
};

const iconSizes = {
  xs: 'p-1.5',
  sm: 'p-2',
  md: 'p-2',
  lg: 'p-2.5',
  xl: 'p-3',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  iconOnly = false,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  const buttonClasses = clsx(
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variants[variant],
    iconOnly ? iconSizes[size] : sizes[size],
    fullWidth && 'w-full',
    className
  );

  const iconClasses = clsx(
    'flex-shrink-0',
    !iconOnly && (iconPosition === 'left' ? 'mr-2' : 'ml-2'),
    {
      'w-3.5 h-3.5': size === 'xs',
      'w-4 h-4': size === 'sm' || size === 'md',
      'w-5 h-5': size === 'lg' || size === 'xl',
    }
  );

  const spinnerSize = {
    xs: 'sm',
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'md',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={buttonClasses}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={spinnerSize[size]} className={!iconOnly ? 'mr-2' : ''} />
          {!iconOnly && children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={iconClasses} />}
          {!iconOnly && children}
          {Icon && iconPosition === 'right' && <Icon className={iconClasses} />}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;