import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className,
  hover = false,
  shadow = 'md'
}: CardProps) {
  const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-lg p-6 border border-gray-200',
        shadowStyles[shadow],
        hover && 'transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:scale-105',
        className
      )}
    >
      {children}
    </div>
  );
}
