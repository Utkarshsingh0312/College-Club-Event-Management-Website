import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Flame, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

export const FeaturedEvent = ({ event, onRegisterClick }) => {
  if (!event) return null;

  const {
    id,
    name,
    tagline,
    category,
    date,
    time,
    venue,
    description,
    registrationDeadline,
    maxParticipants = 120,
    registeredCount = 0,
    seatsLeft = 0,
    isFull = false,
    image,
    status = 'Upcoming',
  } = event;

  const formatDate = (dateString) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const isClosed = status === 'Registration Closed';
  const isCompleted = status === 'Completed';

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-900/40">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
        {/* Left Column: Large Image */}
        <div className="lg:col-span-6 relative group">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            
            {/* Quick floating pill */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs backdrop-blur-md bg-black/40 px-4 py-2.5 rounded-xl border border-white/10">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-400" />
                {registeredCount} Registered / {maxParticipants} Seats
              </span>
              <span className="text-emerald-400 font-bold">
                {isFull ? 'Sold Out' : `${seatsLeft} spots open`}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Details */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
              <Flame className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
              FEATURED EVENT
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/10">
              {category}
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {name}
            </h2>
            {tagline && (
              <p className="mt-2 text-sm sm:text-base text-indigo-200 font-medium">
                {tagline}
              </p>
            )}
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Structured Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-white/10 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5 text-slate-300">
              <Calendar className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  Date
                </span>
                <span className="font-semibold text-white">{formatDate(date)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <Clock className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  Time
                </span>
                <span className="font-semibold text-white">{time}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  Venue
                </span>
                <span className="font-semibold text-white truncate max-w-[200px] block">
                  {venue}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-slate-300">
              <Users className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  Registration Deadline
                </span>
                <span className="font-semibold text-white">
                  {formatDate(registrationDeadline)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              variant="primary"
              disabled={isFull || isClosed || isCompleted}
              onClick={() => onRegisterClick && onRegisterClick(event)}
              className="bg-brand-500 hover:bg-brand-400 text-white font-bold shadow-lg shadow-brand-500/25 border-0"
              icon={ArrowRight}
              iconPosition="right"
            >
              {isCompleted
                ? 'Event Concluded'
                : isClosed
                ? 'Registration Closed'
                : isFull
                ? 'Registration Full'
                : 'Register Now →'}
            </Button>

            <Link
              to={`/events/${id}`}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors border border-white/10"
            >
              View Full Details
            </Link>

            <span className="text-xs text-indigo-200/80 font-medium">
              ⚡ {seatsLeft} seats remaining out of {maxParticipants}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
