import React, { useState } from 'react';
import { type View } from '../App';
import { BookOpenIcon, DashboardIcon, AIToolsIcon, StudyBuddyIcon } from './IconComponents';

// Hamburger menu icon for mobile toggle
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
}> = ({ view, label, activeView, setActiveView, icon }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
        isActive
          ? 'bg-sky-500 text-white'
          : 'text-slate-300 hover:bg-slate-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when navigation occurs (mobile)
  const handleNavClick = (view: View) => {
    setActiveView(view);
    setMenuOpen(false);
  };

  // Sidebar navigation content
  const sidebarContent = (
    <>
      <div className="flex items-center gap-3 mb-8 px-2">
        <BookOpenIcon className="h-8 w-8 text-sky-400" />
        <h1 className="text-2xl font-bold tracking-tight text-white">My Lessons</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <NavItem
          view="dashboard"
          label="Dashboard"
          activeView={activeView}
          setActiveView={handleNavClick}
          icon={<DashboardIcon className="h-6 w-6" />}
        />
        <NavItem
          view="ai-tools"
          label="AI Tools"
          activeView={activeView}
          setActiveView={handleNavClick}
          icon={<AIToolsIcon className="h-6 w-6" />}
        />
        <NavItem
          view="study-buddy"
          label="Study Buddy"
          activeView={activeView}
          setActiveView={handleNavClick}
          icon={<StudyBuddyIcon className="h-6 w-6" />}
        />
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile: Hamburger button */}
      <div className="md:hidden flex items-center justify-between bg-slate-800/70 px-4 py-3 border-b border-slate-700 z-20">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="h-7 w-7 text-sky-400" />
          <span className="text-lg font-semibold text-white">My Lessons</span>
        </div>
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setMenuOpen(true)}
          className="text-slate-200 hover:text-white focus:outline-none"
        >
          <MenuIcon className="h-8 w-8" />
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 flex-shrink-0 flex-col p-4 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Sidebar - Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={() => setMenuOpen(false)}
          ></div>
          {/* Slide-in sidebar */}
          <aside className="relative w-64 bg-slate-800/95 backdrop-blur p-4 flex flex-col min-h-full z-50 animate-slide-in-left">
            <button
              type="button"
              aria-label="Close sidebar"
              className="absolute top-2 right-2 text-slate-300 hover:text-white text-2xl"
              onClick={() => setMenuOpen(false)}
            >
              &times;
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Animations (TailwindCSS keyframes) */}
      <style jsx global>{`
        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.23s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
