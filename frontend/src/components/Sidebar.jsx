import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Target, 
  CalendarDays, 
  Timer, 
  Settings,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/planner', icon: BookOpen, label: 'Study Planner' },
    { path: '/habits', icon: Target, label: 'Habit Tracker' },
    { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
    { path: '/timer', icon: Timer, label: 'Timer' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-black/20 backdrop-blur-xl border-r border-white/10 z-40">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Study Planner
          </h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;