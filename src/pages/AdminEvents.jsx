import React, { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, Sparkles } from 'lucide-react';
import { getEvents, deleteEvent } from '../utils/storage';
import { EventTable } from '../components/admin/EventTable';
import { AdminHeader } from '../components/admin/AdminHeader';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const AdminEvents = () => {
  const { openSidebar } = useOutletContext();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Delete modal state
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = () => {
    setEvents(getEvents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('clubsphere_data_changed', loadData);
    return () => window.removeEventListener('clubsphere_data_changed', loadData);
  }, []);

  const handleDeleteConfirm = () => {
    if (!eventToDelete) return;
    setIsDeleting(true);

    try {
      deleteEvent(eventToDelete.id);
      toast.success(`"${eventToDelete.name}" was deleted successfully`);
      setEventToDelete(null);
      loadData();
    } catch (err) {
      toast.error('Failed to delete event');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered list
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.organizer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === 'All' || evt.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || evt.status === statusFilter;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [events, searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Events"
        subtitle="Manage, schedule and monitor campus events."
        onOpenSidebar={openSidebar}
        actions={
          <Link
            to="/admin/events/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Event</span>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by event, venue, organizer..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Workshop">Workshop</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Competition">Competition</option>
              <option value="Seminar">Seminar</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Registration Closed">Registration Closed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Event Count & Table */}
        <div>
          <div className="mb-3 text-xs font-semibold text-slate-500">
            Total {filteredEvents.length} event{filteredEvents.length === 1 ? '' : 's'} found
          </div>
          <EventTable
            events={filteredEvents}
            onDeleteClick={(evt) => setEventToDelete(evt)}
          />
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event?"
        message={`This action cannot be undone. All event information for "${eventToDelete?.name}" will be removed.`}
        confirmText="Delete Event"
        cancelText="Cancel"
        isDeleting={isDeleting}
      />
    </div>
  );
};
