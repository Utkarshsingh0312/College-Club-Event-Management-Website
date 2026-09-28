import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Ticket,
  ShieldAlert,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { addRegistration } from '../../utils/storage';
import { useToast } from '../../context/ToastContext';

export const RegistrationModal = ({ isOpen, onClose, event, onRegistrationSuccess }) => {
  const toast = useToast();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    college: '',
    year: '1st Year',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [duplicateError, setDuplicateError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const validate = () => {
    const errs = {};

    // Full name
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // College
    if (!formData.college.trim()) {
      errs.college = 'College / University is required';
    }

    // Year
    if (!formData.year) {
      errs.year = 'Please select your current year';
    }

    // Phone (Indian mobile number: optional +91/0, 10 digits starting with 6,7,8,9)
    const rawPhone = formData.phone.replace(/[\s\-]/g, '');
    const phoneRegex = /^(\+91|0)?[6-9]\d{9}$/;
    if (!rawPhone) {
      errs.phone = 'Phone number is required';
    } else if (!phoneRegex.test(rawPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian phone number starting with 6–9';
    }


    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (duplicateError) {
      setDuplicateError(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setDuplicateError(null);

    try {
      const result = addRegistration({
        eventId: event.id,
        fullName: formData.fullName,
        email: formData.email,
        college: formData.college,
        year: formData.year,
        phone: formData.phone,
      });

      setSuccessData(result);
      toast.success('Registration completed successfully! 🎉');
      if (onRegistrationSuccess) {
        onRegistrationSuccess(result);
      }
    } catch (err) {
      if (err.isDuplicate || err.name === 'DuplicateRegistrationError') {
        setDuplicateError({
          title: 'Already Registered',
          message:
            "You've already registered for this event using this email address.",
        });
        toast.error("You've already registered for this event.");
      } else {
        toast.error(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setDuplicateError(null);
    setFormData({
      fullName: '',
      email: '',
      college: '',
      year: '1st Year',
      phone: '',
    });
    setErrors({});
    onClose();
  };

  const handleBackToEvents = () => {
    handleClose();
    navigate('/events');
  };

  const handleCopyId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-lg"
      showClose={!isSubmitting}
    >
      {/* 1. SUCCESS SCREEN */}
      {successData ? (
        <div className="text-center py-2 animate-scale-in">
          {/* Animated icon */}
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            You're Registered! 🎉
          </h3>
          <p className="mt-1.5 text-sm text-slate-600">
            Your spot for <strong className="text-slate-900">{event.name}</strong> has been confirmed.
          </p>

          {/* Ticket Card Details */}
          <div className="mt-6 text-left p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 bg-brand-500/10 rounded-full pointer-events-none" />

            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Registration ID
              </span>
              <button
                onClick={() => handleCopyId(successData.registration.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
                title="Copy Registration ID"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{successData.registration.id}</span>
                <Copy className="w-3 h-3 text-slate-400" />
                {copied && <span className="text-[10px] text-emerald-600 font-semibold">Copied!</span>}
              </button>
            </div>

            <div className="mt-3.5 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold text-slate-900">{successData.registration.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Event:</span>
                <span className="font-semibold text-slate-900">{successData.registration.eventName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-semibold text-slate-900">{formatDate(event.date)} • {event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Venue:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[220px]">{event.venue}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleBackToEvents}
            >
              Back to Events
            </Button>
          </div>
        </div>
      ) : (
        /* 2. REGISTRATION FORM SCREEN */
        <div>
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
              Fast Event Pass
            </span>
            <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Register for {event.name}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 flex items-center gap-2">
              <span>{formatDate(event.date)}</span>
              <span>•</span>
              <span>{event.time}</span>
              <span>•</span>
              <span className="truncate">{event.venue}</span>
            </p>
          </div>

          {/* Duplicate Registration Error Banner */}
          {duplicateError && (
            <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 animate-fade-in">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-900">{duplicateError.title}</h4>
                <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
                  {duplicateError.message}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. student@campus.edu"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>
              )}
            </div>

            {/* College / University */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                College / University <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. National Institute of Technology"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.college
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                    : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                }`}
              />
              {errors.college && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{errors.college}</p>
              )}
            </div>

            {/* Year & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Year */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Year <span className="text-rose-500">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Other">Other</option>
                </select>
                {errors.year && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.year}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    errors.phone
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/30'
                      : 'border-slate-200 focus:ring-brand-500 focus:border-brand-500'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Seat capacity notice */}
            <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Remaining spots: <strong>{event.seatsLeft}</strong></span>
              <span>Fast verification at entrance</span>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="font-bold px-6"
              >
                Complete Registration
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};
