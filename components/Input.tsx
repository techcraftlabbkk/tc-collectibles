import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled';
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  helperText,
  variant = 'default',
  icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random()}`;

  const variantStyles = {
    default: 'border-2 border-gray-300 focus:border-blue-500 bg-white',
    filled: 'border-b-2 border-gray-300 focus:border-b-blue-500 bg-gray-50'
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <input
          id={inputId}
          className={clsx(
            'w-full px-4 py-2.5 rounded-lg transition-colors duration-200',
            'text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
            error ? 'border-2 border-red-500 focus:ring-red-500' : variantStyles[variant],
            icon ? 'pl-10' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
}
