import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Download } from 'lucide-react';
import { getRegistrations, getEvents } from '../utils/storage';
import { RegistrationTable } from '../components/admin/RegistrationTable';
import { AdminHeader } from '../components/admin/AdminHeader';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const Registrations = () => {
  const { openSidebar } = useOutletContext();
  const toast = useToast();

  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedDateSort, setSelectedDateSort] = useState('newest');

  const loadData = () => {
    setRegistrations(getRegistrations());
    setEvents(getEvents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('clubsphere_data_changed', loadData);
    return () => window.removeEventListener('clubsphere_data_changed', loadData);
  }, []);

  // Filter & Search Registrations
  const filteredRegistrations = useMemo(() => {
    let result = [...registrations];

    // Search by name, email or event
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(
        (reg) =>
          reg.fullName.toLowerCase().includes(q) ||
          reg.email.toLowerCase().includes(q) ||
          reg.eventName.toLowerCase().includes(q) ||
          reg.id.toLowerCase().includes(q) ||
          reg.college.toLowerCase().includes(q)
      );
    }

    // Filter by Event
    if (selectedEventId !== 'All') {
      result = result.filter((reg) => reg.eventId === selectedEventId);
    }

    // Filter by Year
    if (selectedYear !== 'All') {
      result = result.filter((reg) => reg.year === selectedYear);
    }

    // Sort by Registration Date
    result.sort((a, b) => {
      const timeA = new Date(a.registeredAt).getTime();
      const timeB = new Date(b.registeredAt).getTime();
      return selectedDateSort === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [registrations, searchTerm, selectedEventId, selectedYear, selectedDateSort]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      toast.error('No registrations to export');
      return;
    }

    const headers = ['Registration ID', 'Student Name', 'Email', 'Phone', 'College', 'Year', 'Event', 'Registered Date'];
    const rows = filteredRegistrations.map((r) => [
      `"${String(r.id || '').replace(/"/g, '""')}"`,
      `"${String(r.fullName || '').replace(/"/g, '""')}"`,
      `"${String(r.email || '').replace(/"/g, '""')}"`,
      `"${String(r.phone || '').replace(/"/g, '""')}"`,
      `"${String(r.college || '').replace(/"/g, '""')}"`,
      `"${String(r.year || '').replace(/"/g, '""')}"`,
      `"${String(r.eventName || '').replace(/"/g, '""')}"`,
      `"${r.registeredAt ? new Date(r.registeredAt).toISOString() : ''}"`,
    ]);

    const csvString = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clubsphere_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Registration list exported to CSV');
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Registrations"
        subtitle="Manage students registered for ClubSphere events."
        onOpenSidebar={openSidebar}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            icon={Download}
            className="text-xs sm:text-sm font-semibold"
          >
            Export CSV
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, email, event, college, or Pass ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Event Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Event:</span>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 max-w-[200px] truncate"
              >
                <option value="All">All Events ({events.length})</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date Sort Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Registered:</span>
              <select
                value={selectedDateSort}
                onChange={(e) => setSelectedDateSort(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {(searchTerm || selectedEventId !== 'All' || selectedYear !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEventId('All');
                  setSelectedYear('All');
                  setSelectedDateSort('newest');
                }}
                className="text-xs text-brand-600 hover:text-brand-700 underline font-semibold ml-auto"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="text-xs font-semibold text-slate-500">
          Showing <strong>{filteredRegistrations.length}</strong> of {registrations.length} total registrations
        </div>

        {/* Registrations Table */}
        <RegistrationTable registrations={filteredRegistrations} />

      </div>
    </div>
  );
};
