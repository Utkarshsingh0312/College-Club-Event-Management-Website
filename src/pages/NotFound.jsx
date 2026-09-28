import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-5 shadow-sm border border-brand-100">
        <Compass className="w-8 h-8 stroke-[1.8]" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
        404 Error
      </span>
      <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-md">
        The page you are looking for might have been moved, renamed, or is temporarily unavailable on ClubSphere.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-sm hover:bg-brand-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Events</span>
        </Link>
      </div>
    </div>
  );
};
