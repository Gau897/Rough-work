import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
}) => {
  return (
    <div
      className={`bg-white rounded-card border border-border p-6 md:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
        hoverEffect ? 'transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-primary/30' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
