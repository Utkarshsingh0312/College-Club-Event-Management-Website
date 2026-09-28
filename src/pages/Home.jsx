import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Compass,
  CheckCircle2,
  Shield,
  Layers,
  Flame,
  ArrowUpRight,
  Radio,
} from 'lucide-react';
import { getEvents } from '../utils/storage';
import { EventCard } from '../components/events/EventCard';
import { FeaturedEvent } from '../components/events/FeaturedEvent';
import { RegistrationModal } from '../components/events/RegistrationForm';
import { Button } from '../components/common/Button';

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = () => {
    const all = getEvents();
    // Prioritize explicit isFeatured flag, or fallback to first event
    const featured = all.find((e) => e.isFeatured) || all[0];
    setFeaturedEvent(featured);

    // Filter upcoming events for the "What's Happening Next" section (3 to 6 events)
    const upcoming = all.filter((e) => e.status !== 'Completed').slice(0, 6);
    setEvents(upcoming);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('clubsphere_data_changed', loadData);
    return () => window.removeEventListener('clubsphere_data_changed', loadData);
  }, []);

  const handleRegisterClick = (event) => {
    setSelectedEventForReg(event);
    setIsModalOpen(true);
  };

  const scrollToFeatured = () => {
    const el = document.getElementById('featured-event-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 lg:pt-12 pb-10 sm:pb-16">
        
        {/* Subtle Campus Atmosphere: faint radial glow & fine grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(99,102,241,0.07),rgba(255,255,255,0))] pointer-events-none" />
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_50%,transparent_100%)] opacity-70"
          aria-hidden="true"
        />

        {/* Delicate decorative campus node markers */}
        <div className="absolute top-10 left-[8%] text-slate-300 font-mono text-xs select-none pointer-events-none hidden lg:block opacity-40">
          +
        </div>
        <div className="absolute top-28 right-[10%] text-slate-300 font-mono text-xs select-none pointer-events-none hidden lg:block opacity-40">
          +
        </div>
        <div className="absolute bottom-12 left-[15%] text-slate-300 font-mono text-xs select-none pointer-events-none hidden lg:block opacity-40">
          +
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50/90 border border-brand-200/70 text-brand-700 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Next-Gen Collegiate Experience Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.08] sm:leading-[1.1]">
                <span className="block text-slate-900">Your Campus.</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600">
                  Your Clubs.
                </span>
                <span className="block text-slate-900">Your Events.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-xl leading-relaxed mx-auto lg:mx-0 font-normal">
                Discover workshops, competitions, cultural events and experiences happening across your campus. Find something you love. Register. Show up.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/events"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={scrollToFeatured}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>View Featured Event</span>
                </button>
              </div>

              {/* Bottom Trust Indicators */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-2.5 gap-x-6 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                  <span>Instant Confirmation Pass</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                  <span>Verified Student Clubs</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                  <span>Zero Complicated Forms</span>
                </span>
              </div>
            </div>

            {/* Right Hero Visual: Refined Live Feed Card */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Subtle soft backdrop glow */}
                <div className="absolute inset-0 bg-brand-500/10 rounded-3xl blur-2xl -z-10" />

                {/* Primary Card */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] border border-slate-200/90 transition-all duration-300 hover:-translate-y-0.5">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs border border-brand-100/60">
                        CS
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">Campus Live Feed</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Active Registrations</p>
                      </div>
                    </div>

                    {/* Subtle Pulsing Live Indicator */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>

                  {/* Event Rows Container */}
                  <div className="mt-3.5 space-y-2.5">
                    
                    {/* Event Row 1: HackSphere 2026 */}
                    <Link
                      to="/events/evt-01"
                      className="group/row p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-100 hover:border-slate-200/90 flex items-center gap-3 transition-all duration-200 cursor-pointer block"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/60 bg-slate-200">
                        <img
                          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=240&q=80"
                          alt="HackSphere 2026"
                          className="w-full h-full object-cover group-hover/row:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                          COMPETITION
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate group-hover/row:text-brand-600 transition-colors">
                          HackSphere 2026
                        </h5>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          Oct 18 • Main Auditorium
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60 shrink-0">
                        36h Build
                      </span>
                    </Link>

                    {/* Event Row 2: AI & Machine Learning Workshop */}
                    <Link
                      to="/events/evt-02"
                      className="group/row p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-100 hover:border-slate-200/90 flex items-center gap-3 transition-all duration-200 cursor-pointer block"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/60 bg-slate-200">
                        <img
                          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=240&q=80"
                          alt="AI & Machine Learning Workshop"
                          className="w-full h-full object-cover group-hover/row:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                          WORKSHOP
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate group-hover/row:text-brand-600 transition-colors">
                          AI & Machine Learning
                        </h5>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          Oct 12 • Innovation Lab
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                        Hands-on
                      </span>
                    </Link>
                  </div>

                  {/* Compact Stats Row */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                    <div className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-base font-extrabold text-slate-900 leading-tight">500+</span>
                      <span className="text-[11px] font-semibold text-slate-500">Students Connected</span>
                    </div>
                    <div className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-base font-extrabold text-slate-900 leading-tight">25+</span>
                      <span className="text-[11px] font-semibold text-slate-500">Events Hosted</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CLUB INTRODUCTION: Built for Campus Communities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Section Divider / Transition */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200/70" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-slate-50 px-4 text-xs font-bold uppercase tracking-widest text-slate-400">
              Campus Ecosystem
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-card relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/50">
              Community Hub
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built for Campus Communities
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              ClubSphere brings college clubs and students together in one place. Discover what's happening on campus, explore new communities and never miss an event that matters to you.
            </p>
          </div>

          {/* Four Statistics */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-slate-100">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-600 tracking-tight">
                25+
              </span>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-800">Events Hosted</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across engineering & arts</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tracking-tight">
                500+
              </span>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-800">Students Connected</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Active campus participants</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-violet-600 tracking-tight">
                15+
              </span>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-800">Workshops</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Deep tech & creative labs</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
                10+
              </span>
              <p className="mt-1 text-xs sm:text-sm font-bold text-slate-800">Competitions</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Hackathons & sports cups</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED EVENT SECTION */}
      {featuredEvent && (
        <section id="featured-event-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedEvent
            event={featuredEvent}
            onRegisterClick={handleRegisterClick}
          />
        </section>
      )}

      {/* 4. UPCOMING EVENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/50">
              Campus Calendar
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              What's Happening Next
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600">
              Explore the latest events happening around campus.
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group self-start md:self-auto"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 3 to 6 Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegisterClick={handleRegisterClick}
            />
          ))}
        </div>

        {/* Bottom CTA button */}
        <div className="mt-10 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs transition-all hover:border-slate-300 hover:-translate-y-0.5"
          >
            <span>View All Events →</span>
          </Link>
        </div>
      </section>

      {/* 5. ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950 px-3 py-1 rounded-full border border-brand-800">
              Why ClubSphere
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              One Platform. Every Campus Experience.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              ClubSphere simplifies college event discovery and registration while giving clubs a centralized platform to manage their events and student participation.
            </p>
          </div>

          {/* 3 Feature Blocks */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800">
            {/* Discover */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 hover:border-brand-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Discover</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Find events across technical, cultural, sports and academic clubs.
              </p>
            </div>

            {/* Participate */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 hover:border-brand-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Participate</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Register for events quickly without complicated forms.
              </p>
            </div>

            {/* Manage */}
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 hover:border-brand-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Manage</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Admins can create, edit and manage events and registrations from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEventForReg && (
        <RegistrationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEventForReg(null);
          }}
          event={selectedEventForReg}
          onRegistrationSuccess={loadData}
        />
      )}
    </div>
  );
};
