import React from 'react';
import { NavLink, Link } from 'react-router';
import { useSavedStore } from '../store/useSavedStore';

export const Navbar: React.FC = () => {
  const savedIds = useSavedStore((state) => state.savedIds);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              FIND<span className="text-blue-600">IT</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1 hidden sm:inline">
              Campus Hub
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <NavLink to="/" end className={getNavLinkClass}>
            Explore
          </NavLink>

          <NavLink to="/saved" className={getNavLinkClass}>
            <span className="flex items-center gap-1.5">
              Saved
              {savedIds.length > 0 && (
                <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                  {savedIds.length}
                </span>
              )}
            </span>
          </NavLink>

          {/* ปุ่ม Report แยกเด่นเป็นพิเศษ */}
          <NavLink
            to="/report"
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5"
          >
            <span className="text-blue-400 font-black">+</span> Report Item
          </NavLink>

          <NavLink to="/about" className={getNavLinkClass}>
            About
          </NavLink>

        </nav>
      </div>
    </header>
  );
};