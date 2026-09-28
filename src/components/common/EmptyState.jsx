import React from 'react';
import { CalendarX, SearchX, UserX, Plus } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  type = 'events', // 'events' | 'search' | 'registrations' | 'custom'
  title,
  text,
  actionLabel,
  onAction,
  className = '',
}) => {
  const configs = {
    events: {
      icon: CalendarX,
      title: title || 'Nothing happening yet',
      text: text || 'Check back soon for upcoming campus events.',
    },
    search: {
      icon: SearchX,
      title: title || 'No events found',
      text: text || 'Try changing your search or filters.',
    },
    registrations: {
      icon: UserX,
      title: title || 'No registrations yet',
      text: text || 'Registrations will appear here once students join an event.',
    },
    custom: {
      icon: CalendarX,
      title: title || 'No items available',
      text: text || '',
    },
  };

  const config = configs[type] || configs.events;
  const Icon = config.icon;

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-white/70 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{config.title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm leading-relaxed">{config.text}</p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onAction} icon={Plus}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
