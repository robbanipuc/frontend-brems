import clsx from 'clsx';

const Card = ({ children, className, padding = true, hover = false }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-gray-200 shadow-sm',
        hover && 'hover:shadow-md transition-shadow duration-200',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, border = true }) => {
  return (
    <div
      className={clsx(
        'px-6 py-4',
        border && 'border-b border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ children, className, subtitle }) => {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
};

const CardBody = ({ children, className }) => {
  return (
    <div className={clsx('p-6', className)}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className, border = true }) => {
  return (
    <div
      className={clsx(
        'px-6 py-4 bg-gray-50 rounded-b-xl',
        border && 'border-t border-gray-200',
        className
      )}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;