
import React from 'react';
import { LogoutIcon, SettingsIcon } from './Icons';

interface HeaderProps {
  title: string;
  onLogout: () => void;
  onSettings?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onLogout, onSettings }) => {
  return (
    <header className="bg-primary text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        {onSettings && (
          <button onClick={onSettings} className="hover:text-gray-200">
            <SettingsIcon className="w-6 h-6" />
          </button>
        )}
        <button onClick={onLogout} className="hover:text-gray-200">
          <LogoutIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
