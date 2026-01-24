import React from 'react';

export const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
        {children}
    </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
            <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const CardBody = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);