import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  return (
    <div
      className={`max-w-3xl mb-12 md:mb-16 ${
        align === 'center' ? 'mx-auto text-center' : 'text-left'
      } ${className}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs md:text-sm font-semibold tracking-wider text-primary uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-navy tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
