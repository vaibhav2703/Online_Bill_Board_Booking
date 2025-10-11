import React from 'react';
import { Button } from './button';

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg max-w-sm w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }) => <div>{children}</div>;

const DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;

const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;

const DialogDescription = ({ children }) => <p className="text-sm text-muted-foreground">{children}</p>;

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };
