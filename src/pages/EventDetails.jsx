import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ArrowLeft,
  Share2,
  CheckCircle2,
  AlertCircle,
  Building,
  CalendarDays,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getEventById, getEvents } from '../utils/storage';
import { Button } from '../components/common/Button';
import { RegistrationModal } from '../components/events/RegistrationForm';
import { useToast } from '../context/ToastContext';


export const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadEvent = () => {
    const found = getEventById(id);
    setEvent(found);
  };

  useEffect(() => {
    loadEvent();
    window.addEventListener('clubsphere_data_changed', loadEvent);
    return () => window.removeEventListener('clubsphere_data_changed', loadEvent);
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Event link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // 404 / Missing event state
  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Event Not Found
        </h2>
        <p className="mt-2 text-slate-500 max-w-md mx-auto">
          The event you are looking for may have been moved, removed, or has an invalid ID.
        </p>
        <div className="mt-6">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    tagline,
    category,
    date,
    time,
    venue,
    organizer,
    description,
    registrationDeadline,
    maxParticipants = 100,
    registeredCount = 0,
    seatsLeft = 0,
    isFull = false,
    image,
    status = 'Upcoming',
    tags = [],
  } = event;

  const isClosed = status === 'Registration Closed';
  const isCompleted = status === 'Completed';
  const percentage = Math.min(100, Math.round((registeredCount / maxParticipants) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{copied ? 'Copied Link!' : 'Share Event'}</span>
        </button>
      </div>

      {/* Hero Banner Section */}
      <div className="relative aspect-[21/9] min-h-[300px] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col justify-end text-white">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-brand-600 text-white shadow-sm">
              {category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                isCompleted
                  ? 'bg-slate-900/80 text-slate-300 border-slate-700'
                  : isClosed
                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                  : isFull
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              }`}
            >
              {status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {name}
          </h1>

          {tagline && (
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-3xl font-medium">
              {tagline}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Split: Details & Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column (8 cols): Description & Detailed Information */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Event */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About the Event</h2>
            <p className="text-slate-600 text-base leading-relaxed whitespace-pre-line">
              {description}
            </p>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* Event Schedule & Organizer Info */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-card space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Event Coordinates</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Date</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{formatDate(date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Time</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Venue</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Host Club</h4>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{organizer}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (4 cols): Registration Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-card space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Participation Status
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-900">
                  {seatsLeft} <span className="text-sm font-semibold text-slate-500">spots remaining</span>
                </span>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  Free Entry
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Registered: <strong>{registeredCount}</strong></span>
                  <span>Capacity: {maxParticipants}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isFull ? 'bg-rose-500' : seatsLeft <= 10 ? 'bg-amber-500' : 'bg-brand-600'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Registration Deadline */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="text-slate-500 font-medium">Registration Deadline:</span>
              <p className="font-bold text-slate-900">
                {registrationDeadline ? formatDate(registrationDeadline) : 'Until event start'}
              </p>
            </div>

            {/* Primary CTA Button */}
            <div>
              <Button
                variant={isFull || isClosed || isCompleted ? 'secondary' : 'primary'}
                size="lg"
                disabled={isFull || isClosed || isCompleted}
                onClick={() => setIsModalOpen(true)}
                className="w-full font-bold shadow-md shadow-brand-500/20"
              >
                {isCompleted
                  ? 'Event Concluded'
                  : isClosed
                  ? 'Registration Closed'
                  : isFull
                  ? 'Registration Full'
                  : 'Register Now'}
              </Button>

              {isFull && (
                <p className="mt-2 text-xs text-center text-rose-500 font-medium">
                  This event is fully booked.
                </p>
              )}
            </div>

            {/* Checklist */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant QR pass generated after sign-up</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Open to all registered university students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Certificate of Participation provided</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        onRegistrationSuccess={loadEvent}
      />
    </div>
  );
};
