import React from 'react';

export const Header = ({ title, subtitle, action }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {action}
        </div>
      </div>
    </header>
  );
};

export default Header;
