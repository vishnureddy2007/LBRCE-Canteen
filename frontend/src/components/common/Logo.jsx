import React from 'react';

/**
 * Renders the custom LBRCE Canteen Logo.
 * Uses the high-quality transparent logo image uploaded by the user.
 */
export default function Logo({ className = "h-11" }) {
  return (
    <div className="flex items-center select-none">
      <img
        src="/logo.png"
        alt="LBRCE Canteen"
        className={`${className} w-auto object-contain transition-all duration-300 hover:scale-105 filter dark:bg-white dark:py-1 dark:px-2.5 dark:rounded-xl dark:shadow-sm`}
      />
    </div>
  );
}
