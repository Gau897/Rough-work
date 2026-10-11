import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  to,
  href,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover shadow-sm',
    secondary: 'bg-white text-navy border border-border hover:bg-surface-bg shadow-sm',
    outline: 'border border-primary text-primary hover:bg-primary-light',
    text: 'text-text-muted hover:text-navy hover:bg-transparent p-0',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5 text-sm md:text-base',
    lg: 'h-12 px-7 text-base font-semibold',
  };

  const combinedStyles = `${baseStyles} ${variants[variant]} ${variant !== 'text' ? sizes[size] : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} onClick={onClick} className={combinedStyles}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedStyles} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
