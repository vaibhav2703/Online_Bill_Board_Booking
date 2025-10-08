import React from 'react';

export const Select = ({ children, value, onValueChange, ...props }) => {
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      {...props}
    >
      {children}
    </select>
  );
};

export const SelectContent = ({ children }) => <>{children}</>;

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

export const SelectTrigger = ({ children, className = '', ...props }) => (
  <div className={`relative ${className}`} {...props}>
    {children}
  </div>
);

export const SelectValue = ({ placeholder }) => (
  <span className="text-gray-500">{placeholder}</span>
);
