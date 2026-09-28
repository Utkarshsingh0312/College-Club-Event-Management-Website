import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2 } from 'lucide-react';

const statusBadgeStyles = {
  Upcoming: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Registration Closed': 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const categoryBadgeStyles = {
  Technical: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Workshop: 'bg-amber-50 text-amber-700 border-amber-200/60',
  Cultural: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/60',
  Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Competition: 'bg-rose-50 text-rose-700 border-rose-200/60',
  Seminar: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
};

export const EventTable = ({ events = [], onDeleteClick }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <p className="text-slate-500 text-sm">No events found matching current criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-subtle">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
            <th className="py-4 px-5">Event</th>
            <th className="py-4 px-4">Category</th>
            <th className="py-4 px-4">Date</th>
            <th className="py-4 px-4">Venue</th>
            <th className="py-4 px-4 text-center">Registrations</th>
            <th className="py-4 px-4">Status</th>
            <th className="py-4 px-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {events.map((event) => {
            const statusClass =
              statusBadgeStyles[event.status] || 'bg-slate-100 text-slate-700 border-slate-200';
            const catClass =
              categoryBadgeStyles[event.category] || 'bg-slate-50 text-slate-700 border-slate-200';
            const percentage = Math.min(
              100,
              Math.round(((event.registeredCount || 0) / (event.maxParticipants || 100)) * 100)
            );

            return (
              <tr
                key={event.id}
                className="hover:bg-slate-50/70 transition-colors duration-150 group"
              >
                {/* Event Name & Thumbnail */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/events/${event.id}`}
                          className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors truncate max-w-xs block"
                        >
                          {event.name}
                        </Link>
                        {event.isFeatured && (
                          <span className="shrink-0 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-200">
                            Featured
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 truncate block">
                        {event.organizer}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${catClass}`}
                  >
                    {event.category}
                  </span>
                </td>

                {/* Date */}
                <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600">
                  <span className="font-semibold text-slate-900 block">{formatDate(event.date)}</span>
                  <span className="text-slate-400">{event.time}</span>
                </td>

                {/* Venue */}
                <td className="py-3.5 px-4 text-xs text-slate-600 max-w-[180px] truncate">
                  {event.venue}
                </td>

                {/* Registrations */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-900">
                      {event.registeredCount || 0} / {event.maxParticipants}
                    </span>
                    {/* Tiny progress bar */}
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percentage >= 100
                            ? 'bg-rose-500'
                            : percentage >= 80
                            ? 'bg-amber-500'
                            : 'bg-brand-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusClass}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {event.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    {/* View */}
                    <Link
                      to={`/events/${event.id}`}
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="View Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    {/* Edit */}
                    <Link
                      to={`/admin/events/edit/${event.id}`}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() => onDeleteClick && onDeleteClick(event)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
