import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/#about' },
  ];

  const handleAboutClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('about');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/#about');
    }
  };

  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] border-b border-slate-200/80'
          : 'bg-white/50 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none shrink-0">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 via-indigo-600 to-violet-500 p-0.5 shadow-xs group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-50/50" />
                {/* Sphere graphic */}
                <div className="w-4 h-4 rounded-full border-[1.75px] border-brand-600 flex items-center justify-center relative">
                  <div className="w-2 h-2 rounded-full bg-brand-600" />
                  <div className="absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-violet-500" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                Club<span className="text-brand-600">Sphere</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            {navLinks.map((link) => {
              if (link.name === 'About') {
                return (
                  <a
                    key={link.name}
                    href="/#about"
                    onClick={handleAboutClick}
                    className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-colors duration-150"
                  >
                    {link.name}
                  </a>
                );
              }
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-150 ${
                    active
                      ? 'text-brand-600 bg-brand-50/90 font-bold border border-brand-100/60 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Admin Link */}
            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 flex items-center gap-1.5 transition-colors duration-150 ml-1"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Admin</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isAuthenticated
                    ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50 animate-pulse'
                    : 'bg-emerald-500/80'
                }`}
                title={isAuthenticated ? 'Admin Session Active' : 'Admin Portal Online'}
              />
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link
              to="/events"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-600 px-3 py-1.5 rounded-lg transition-colors duration-150 hover:bg-slate-100/60"
            >
              Join an Event
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-md shadow-lg animate-slide-up">
          <div className="px-4 pt-3 pb-5 space-y-1.5">
            {navLinks.map((link) => {
              if (link.name === 'About') {
                return (
                  <a
                    key={link.name}
                    href="/#about"
                    onClick={(e) => {
                      handleAboutClick(e);
                      setIsOpen(false);
                    }}
                    className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                  >
                    {link.name}
                  </a>
                );
              }
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isLinkActive(link.path)
                      ? 'bg-brand-50 text-brand-600 font-bold border border-brand-100/60'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-brand-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link
              to={isAuthenticated ? '/admin' : '/admin/login'}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Admin Dashboard</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Online
              </span>
            </Link>

            <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
              <Link
                to="/events"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm text-center shadow-xs"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
