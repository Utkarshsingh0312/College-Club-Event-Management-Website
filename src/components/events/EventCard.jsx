import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

// Category color mappings for tasteful visual hierarchy
const categoryColors = {
  Technical: 'bg-blue-50 text-blue-700 border-blue-200/60',
  Workshop: 'bg-amber-50 text-amber-700 border-amber-200/60',
  Cultural: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200/60',
  Sports: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  Competition: 'bg-rose-50 text-rose-700 border-rose-200/60',
  Seminar: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
};

export const EventCard = ({ event, onRegisterClick }) => {
  const {
    id,
    name,
    category,
    date,
    time,
    venue,
    description,
    image,
    maxParticipants = 100,
    registeredCount = 0,
    seatsLeft = 0,
    isFull = false,
    status = 'Upcoming',
  } = event;

  // Format date nicely (e.g. October 12, 2026)
  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const isClosed = status === 'Registration Closed';
  const isCompleted = status === 'Completed';
  const isAlmostFull = !isFull && !isClosed && !isCompleted && seatsLeft <= 10 && seatsLeft > 0;

  // Registration button state & label
  let buttonLabel = 'Register Now';
  let buttonDisabled = false;
  let statusBadge = null;

  if (isCompleted) {
    buttonLabel = 'Event Concluded';
    buttonDisabled = true;
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        Completed
      </span>
    );
  } else if (isClosed) {
    buttonLabel = 'Deadline Passed';
    buttonDisabled = true;
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        Registration Closed
      </span>
    );
  } else if (isFull) {
    buttonLabel = 'Registration Full';
    buttonDisabled = true;
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle className="w-3 h-3" />
        Full
      </span>
    );
  } else if (isAlmostFull) {
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
        Only {seatsLeft} seat{seatsLeft === 1 ? '' : 's'} left
      </span>
    );
  } else {
    statusBadge = (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle className="w-3 h-3" />
        Available
      </span>
    );
  }

  const categoryStyle = categoryColors[category] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Event Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border shadow-sm backdrop-blur-md bg-white/95 ${categoryStyle}`}
          >
            {category}
          </span>
          <div className="backdrop-blur-md bg-white/95 rounded-full shadow-sm">
            {statusBadge}
          </div>
        </div>

        {/* Date Over Image for quick glance */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 text-xs font-medium text-white/95">
          <Calendar className="w-3.5 h-3.5 text-white/80" />
          <span>{formatDate(date)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/events/${id}`} className="focus:outline-none">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Meta specs */}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-700">{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-700 truncate">{venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                <strong className="text-slate-800 font-semibold">{registeredCount}</strong> / {maxParticipants} Registered
                {isAlmostFull && (
                  <span className="ml-1 text-amber-600 font-bold">({seatsLeft} left)</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/events/${id}`}
            className="flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            Details
          </Link>
          <Button
            size="sm"
            variant={buttonDisabled ? 'secondary' : 'primary'}
            disabled={buttonDisabled}
            onClick={() => onRegisterClick && onRegisterClick(event)}
            className="flex-1 py-2.5 text-xs font-semibold"
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </article>
  );
};
