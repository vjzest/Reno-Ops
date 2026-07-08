import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'urgent' | 'normal' | 'category';
  className?: string;
}

export function Badge({ children, variant = 'normal', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-red-100 text-red-800 animate-pulse border border-red-200': variant === 'urgent',
          'bg-gray-100 text-gray-800': variant === 'normal',
          'bg-blue-100 text-blue-800': variant === 'category',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
