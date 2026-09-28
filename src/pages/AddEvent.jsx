import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import { getEventById, addEvent, updateEvent } from '../utils/storage';
import { AdminHeader } from '../components/admin/AdminHeader';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const AddEvent = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const { openSidebar } = useOutletContext();

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    category: 'Workshop',
    date: '',
    time: '10:00 AM',
    venue: '',
    organizer: '',
    registrationDeadline: '',
    maxParticipants: 100,
    image: '',
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(isEditMode);

  // Default suggested Unsplash images for quick pick
  const sampleImages = [
    { label: 'Hackathon / Tech', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
    { label: 'AI / Robotics', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Web / Coding', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Cultural / Fest', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Design Sprint', url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Seminar / Talk', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80' },
  ];

  useEffect(() => {
    if (isEditMode) {
      const existing = getEventById(id);
      if (existing) {
        setFormData({
          name: existing.name || '',
          tagline: existing.tagline || '',
          description: existing.description || '',
          category: existing.category || 'Workshop',
          date: existing.date || '',
          time: existing.time || '10:00 AM',
          venue: existing.venue || '',
          organizer: existing.organizer || '',
          registrationDeadline: existing.registrationDeadline || existing.date || '',
          maxParticipants: existing.maxParticipants || 100,
          image: existing.image || '',
          isFeatured: Boolean(existing.isFeatured),
        });
      } else {
        toast.error('Event not found');
        navigate('/admin/events');
      }
      setIsLoadingEvent(false);
    }
  }, [id, isEditMode, navigate, toast]);

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = 'Event name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.category) errs.category = 'Please choose a category';
    if (!formData.date) errs.date = 'Event date is required';
    if (!formData.time.trim()) errs.time = 'Event time is required';
    if (!formData.venue.trim()) errs.venue = 'Venue location is required';
    if (!formData.organizer.trim()) errs.organizer = 'Organizer name is required';

    if (formData.registrationDeadline && formData.date) {
      if (new Date(formData.registrationDeadline) > new Date(formData.date)) {
        errs.registrationDeadline = 'Deadline cannot be after the event date';
      }
    }

    if (!formData.maxParticipants || Number(formData.maxParticipants) <= 0) {
      errs.maxParticipants = 'Maximum participants must be at least 1';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please resolve the errors highlighted below.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        updateEvent(id, formData);
        toast.success('Event updated successfully');
      } else {
        addEvent(formData);
        toast.success('Event created successfully');
      }
      navigate('/admin/events');
    } catch (err) {
      toast.error(err.message || 'Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title={isEditMode ? 'Edit Event' : 'Create New Event'}
        subtitle={isEditMode ? `Update details for ${formData.name}` : 'Fill in the event coordinates and registration details'}
        onOpenSidebar={openSidebar}
        actions={
          <Link
            to="/admin/events"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-subtle p-6 sm:p-10 space-y-8"
        >
          {/* General Information */}
          <div className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              General Information
            </h3>

            {/* Event Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Event Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. HackSphere 2026"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-brand-500'
                }`}
              />
              {errors.name && <p className="mt-1 text-xs text-rose-500">{errors.name}</p>}
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Short Tagline / Catchphrase
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. The Flagship 36-Hour National Collegiate Hackathon"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Category & Organizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="Technical">Technical</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Competition">Competition</option>
                  <option value="Seminar">Seminar</option>
                </select>
                {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Host Club / Organizer <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="e.g. Google Developer Student Club"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.organizer
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-brand-500'
                  }`}
                />
                {errors.organizer && <p className="mt-1 text-xs text-rose-500">{errors.organizer}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Event Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe agenda, prerequisites, learning outcomes, and schedule..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.description
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-brand-500'
                }`}
              />
              {errors.description && <p className="mt-1 text-xs text-rose-500">{errors.description}</p>}
            </div>
          </div>

          {/* Schedule & Location */}
          <div className="space-y-5 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Schedule & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Event Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.date
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-brand-500'
                  }`}
                />
                {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Event Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g. 10:00 AM or 02:30 PM"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.time
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-brand-500'
                  }`}
                />
                {errors.time && <p className="mt-1 text-xs text-rose-500">{errors.time}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Venue <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Innovation Lab, 3rd Floor Block B"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  errors.venue
                    ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:ring-brand-500'
                }`}
              />
              {errors.venue && <p className="mt-1 text-xs text-rose-500">{errors.venue}</p>}
            </div>
          </div>

          {/* Registration Capacity & Deadline */}
          <div className="space-y-5 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Registration Capacity & Deadlines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Registration Deadline (Date)
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.registrationDeadline
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-brand-500'
                  }`}
                />
                {errors.registrationDeadline && (
                  <p className="mt-1 text-xs text-rose-500">{errors.registrationDeadline}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Maximum Participants <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  placeholder="100"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                    errors.maxParticipants
                      ? 'border-rose-300 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:ring-brand-500'
                  }`}
                />
                {errors.maxParticipants && (
                  <p className="mt-1 text-xs text-rose-500">{errors.maxParticipants}</p>
                )}
              </div>
            </div>
          </div>

          {/* Media & Highlighting */}
          <div className="space-y-5 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Media & Promotion
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Event Image URL (Optional)
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Or select one of our curated high-resolution presets:
              </p>
              {/* Presets */}
              <div className="mt-2 flex flex-wrap gap-2">
                {sampleImages.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: s.url }))}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-600 transition-colors border border-slate-200"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Event Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/70">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Featured Event</h4>
                <p className="text-xs text-slate-500">
                  Feature this event prominently on the home page hero split section.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600" />
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/events')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              icon={isEditMode ? Save : Plus}
              className="px-6 font-bold"
            >
              {isEditMode ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
