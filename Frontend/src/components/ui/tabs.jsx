"use client";

import * as React from "react";

import { cn } from "../utils/utils";

function Tabs({
  className,
  defaultValue,
  value,
  onValueChange,
  children,
  ...props
}) {
  const [activeValue, setActiveValue] = React.useState(defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    setActiveValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeValue, onValueChange: handleValueChange })
      )}
    </div>
  );
}

function TabsList({
  className,
  children,
  activeValue,
  onValueChange,
  ...props
}) {
  const tabs = React.Children.toArray(children).filter(
    (child) => child.type === TabsTrigger
  );
  const activeIndex = tabs.findIndex((tab) => tab.props.value === activeValue);

  return (
    <div
      data-slot="tabs-list"
      className={cn(
        "bg-gray-300 rounded-lg p-1 flex space-x-1",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeValue, onValueChange })
      )}
    </div>
  );
}

function TabsTrigger({
  className,
  value,
  activeValue,
  onValueChange,
  children,
  ...props
}) {
  const isActive = activeValue === value;

  return (
    <button
      data-slot="tabs-trigger"
      className={cn(
        "flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200",
        isActive ? "bg-white text-black hover:bg-gray-300" : "bg-transparent text-gray-600 hover:bg-gray-400"
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({
  className,
  value,
  activeValue,
  onValueChange,
  children,
  ...props
}) {
  const isActive = activeValue === value;

  return (
    <div
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className, {
        block: isActive,
        hidden: !isActive,
      })}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
