import React from 'react';
import { type View } from '../App';
import { BookOpenIcon, DashboardIcon, AIToolsIcon, StudyBuddyIcon } from './IconComponents';

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
  return (
    <aside className="w-64 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 flex-shrink-0 flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <BookOpenIcon className="h-8 w-8 text-sky-400" />
        <h1 className="text-2xl font-bold tracking-tight text-white">My Lessons</h1>
      </div>
      <nav className="flex flex-col gap-2">
        <NavItem
          view="dashboard"
          label="Dashboard"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<DashboardIcon className="h-6 w-6" />}
        />
        <NavItem
          view="ai-tools"
          label="AI Tools"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<AIToolsIcon className="h-6 w-6" />}
        />
        <NavItem
          view="study-buddy"
          label="Study Buddy"
          activeView={activeView}
          setActiveView={setActiveView}
          icon={<StudyBuddyIcon className="h-6 w-6" />}
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
