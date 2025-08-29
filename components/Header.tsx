import React from 'react';
import { PlusIcon } from './IconComponents';

interface HeaderProps {
  onAddLesson: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddLesson }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-end items-center">
        <button
          onClick={onAddLesson}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-transform transform hover:scale-105"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Lesson</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
