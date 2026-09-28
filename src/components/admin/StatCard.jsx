import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel = 'vs last semester',
  color = 'brand',
}) => {
  const colorSchemes = {
    brand: {
      bg: 'bg-brand-50 text-brand-600 border-brand-100',
      badge: 'text-brand-600 bg-brand-50',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'text-emerald-700 bg-emerald-50',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'text-amber-700 bg-amber-50',
    },
    violet: {
      bg: 'bg-violet-50 text-violet-600 border-violet-100',
      badge: 'text-violet-700 bg-violet-50',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      badge: 'text-rose-700 bg-rose-50',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.brand;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-subtle hover:shadow-card transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-xl border ${scheme.bg}`}>
          <Icon className="w-5 h-5 shrink-0" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        {trend ? (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {trend}
          </span>
        ) : (
          <span className="text-slate-400 font-medium">{subtitle || 'Real-time sync'}</span>
        )}
        <span className="text-slate-400 font-medium">{trendLabel}</span>
      </div>
    </div>
  );
};
