import React from 'react';
import { TrainIcon } from './icons/TrainIcon';
import { UserIcon } from './icons/UserIcon';
import { View } from '../App';

interface HeaderProps {
    activeView: View;
    onNavigate: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="bg-brand-surface shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate(View.Search)}
        >
            <TrainIcon className="w-8 h-8 text-brand-primary" />
            <h1 className="text-2xl font-bold ml-2 tracking-tight text-brand-dark">
                RailPass
            </h1>
        </div>
        <nav className="flex items-center space-x-6">
            <button 
                onClick={() => onNavigate(View.Bookings)}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
            >
                <UserIcon className="w-5 h-5 mr-1.5" />
                My Bookings
            </button>
        </nav>
      </div>
    </header>
  );
};