import React from 'react';
import { EventCard } from './EventCard';
import { EmptyState } from '../common/EmptyState';

export const EventGrid = ({
  events = [],
  isLoading = false,
  onRegisterClick,
  emptyTitle,
  emptyText,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse"
          >
            <div className="aspect-[16/9] bg-slate-200" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <div className="h-5 w-24 bg-slate-200 rounded-full" />
                <div className="h-5 w-20 bg-slate-200 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-2/3 bg-slate-100 rounded" />
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="h-3.5 w-1/2 bg-slate-100 rounded" />
                <div className="h-3.5 w-2/3 bg-slate-100 rounded" />
              </div>
              <div className="pt-4 flex gap-2">
                <div className="h-9 flex-1 bg-slate-200 rounded-xl" />
                <div className="h-9 flex-1 bg-slate-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        type="search"
        title={emptyTitle || 'No events found'}
        text={emptyText || 'Try changing your search or filters.'}
        actionLabel={onResetFilters ? 'Clear All Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegisterClick={onRegisterClick}
        />
      ))}
    </div>
  );
};
