import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  CheckCircle,
  Plus,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onToggleSidebar, onOpenNewTask }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Left side: Hamburger button + Welcome text */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation Menu"
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </p>
          <h2 className="text-sm font-bold text-slate-800">
            {user ? `${user.name}'s Tasks` : 'TaskFlow Dashboard'}
          </h2>
        </div>
      </div>

      {/* Right side: Quick Action + Notifications + User Menu */}
      <div className="flex items-center gap-3">
        {/* Quick New Task Button */}
        {onOpenNewTask && (
          <button
            onClick={onOpenNewTask}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Task</span>
          </button>
        )}

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-label="User profile menu"
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-bold text-sm flex items-center justify-center shadow-sm">
              {userInitial}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {user?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                {user?.email || ''}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 md:hidden">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                Profile Settings
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
