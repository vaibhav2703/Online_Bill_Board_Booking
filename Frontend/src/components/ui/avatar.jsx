import React from 'react';

export const Avatar = ({ children, className = '' }) => {
  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full h-10 w-10 ${className}`}>
      {children}
    </div>
  );
};

export const AvatarFallback = ({ children, className = '' }) => {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
      {children}
    </div>
  );
};
