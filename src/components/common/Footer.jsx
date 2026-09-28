import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-violet-500 p-0.5 shadow-md shadow-brand-500/20">
                <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-brand-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                  </div>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Club<span className="text-brand-400">Sphere</span>
              </span>
            </Link>
            <p className="text-base text-slate-300 font-medium">
              Your Campus. Your Clubs. Your Events.
            </p>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              ClubSphere simplifies campus event discovery and registration while giving college clubs a unified system to organize, host, and scale student participation.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                Inter-Collegiate Campus Network
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-400" />
                events@clubsphere.edu
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-white transition-colors">
                  About ClubSphere
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 transition-colors font-medium"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Event Types
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events?category=Workshop" className="hover:text-white transition-colors">
                  Workshops & Labs
                </Link>
              </li>
              <li>
                <Link to="/events?category=Competition" className="hover:text-white transition-colors">
                  Hackathons & Competitions
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technical" className="hover:text-white transition-colors">
                  Technical Seminars
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="hover:text-white transition-colors">
                  Cultural & Sports Fests
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 ClubSphere. Built for campus communities.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400 flex items-center gap-1">
              Production-Ready Campus System
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
