import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { resetToSeedData } from '../../utils/storage';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, adminUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Signed out of admin dashboard');
    navigate('/admin/login');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all events & registrations to initial demo seed data?')) {
      resetToSeedData();
      toast.success('Demo data restored to defaults');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Events', path: '/admin/events', icon: Calendar },
    { name: 'Registrations', path: '/admin/registrations', icon: Users },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header & Logo */}
          <div className="h-16 sm:h-20 px-6 flex items-center justify-between border-b border-slate-800">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-violet-500 p-0.5">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-brand-400 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-brand-400" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight text-white">
                  Club<span className="text-brand-400">Sphere</span>
                </span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-brand-400 -mt-0.5">
                  ADMIN
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Management
            </div>

            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}

            <div className="pt-4 pb-1">
              <div className="h-px bg-slate-800 my-2" />
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                System
              </div>
            </div>

            <button
              onClick={handleResetData}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
              title="Reset events & registrations to initial seed"
            >
              <RefreshCw className="w-4 h-4 shrink-0" />
              <span>Reset Demo Data</span>
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <span className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4 shrink-0" />
                <span>Live Website</span>
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                Open
              </span>
            </Link>
          </div>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-800/60 mb-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center text-xs border border-brand-500/30">
              CA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {adminUser?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {adminUser?.email || 'admin@clubsphere.com'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
