import React, { useState, useEffect, useMemo } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Calendar,
  Users,
  CheckCircle,
  Activity,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { getEvents, getRegistrations } from '../utils/storage';
import { StatCard } from '../components/admin/StatCard';
import { AdminHeader } from '../components/admin/AdminHeader';

export const AdminDashboard = () => {
  const { openSidebar } = useOutletContext();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const loadData = () => {
    setEvents(getEvents());
    setRegistrations(getRegistrations());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('clubsphere_data_changed', loadData);
    return () => window.removeEventListener('clubsphere_data_changed', loadData);
  }, []);

  // Compute live statistics dynamically
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => e.status === 'Upcoming').length;
    const totalRegistrations = registrations.length;
    const activeEvents = events.filter(
      (e) => e.status === 'Upcoming' && !e.isFull
    ).length;

    return {
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      activeEvents,
    };
  }, [events, registrations]);

  // Recent 5 registrations
  const recentRegistrations = useMemo(() => {
    return [...registrations]
      .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
      .slice(0, 5);
  }, [registrations]);

  // Upcoming 4 events for compact list
  const upcomingEventsList = useMemo(() => {
    return events
      .filter((e) => e.status !== 'Completed')
      .slice(0, 4);
  }, [events]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Dashboard"
        subtitle="Here's what's happening with your campus events."
        onOpenSidebar={openSidebar}
        actions={
          <Link
            to="/admin/events/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Event</span>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Four Dynamic Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            subtitle="Campus catalog"
            icon={Calendar}
            trend="+12%"
            trendLabel="vs last month"
            color="brand"
          />

          <StatCard
            title="Upcoming Events"
            value={stats.upcomingEvents}
            subtitle="Scheduled ahead"
            icon={Activity}
            trend="+4"
            trendLabel="new this week"
            color="indigo"
          />

          <StatCard
            title="Total Registrations"
            value={stats.totalRegistrations}
            subtitle="Confirmed student spots"
            icon={Users}
            trend="+28%"
            trendLabel="engagement rate"
            color="emerald"
          />

          <StatCard
            title="Active Events"
            value={stats.activeEvents}
            subtitle="Open for registration"
            icon={CheckCircle}
            trend="Open"
            trendLabel="booking active"
            color="violet"
          />
        </div>

        {/* Dual Grid: Recent Registrations & Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Registrations Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Registrations</h3>
                  <p className="text-xs text-slate-500">Latest student ticket reservations</p>
                </div>
                <Link
                  to="/admin/registrations"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentRegistrations.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No registrations recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs mt-3">
                    <thead>
                      <tr className="text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                        <th className="pb-2.5">Student</th>
                        <th className="pb-2.5">Event</th>
                        <th className="pb-2.5 hidden sm:table-cell">College</th>
                        <th className="pb-2.5 text-center">Year</th>
                        <th className="pb-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {recentRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-50/60">
                          <td className="py-3 pr-2">
                            <span className="font-bold text-slate-900 block truncate max-w-[120px]">
                              {reg.fullName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {reg.id}
                            </span>
                          </td>
                          <td className="py-3 pr-2">
                            <span className="truncate max-w-[140px] block font-semibold text-slate-800">
                              {reg.eventName}
                            </span>
                          </td>
                          <td className="py-3 pr-2 text-slate-500 hidden sm:table-cell truncate max-w-[120px]">
                            {reg.college}
                          </td>
                          <td className="py-3 text-center text-slate-600">
                            {reg.year}
                          </td>
                          <td className="py-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {reg.status || 'Confirmed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Showing last 5 entries</span>
              <Link to="/admin/registrations" className="text-brand-600 font-semibold hover:underline">
                View All →
              </Link>
            </div>
          </div>

          {/* Upcoming Events Admin Section (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upcoming Events</h3>
                  <p className="text-xs text-slate-500">Upcoming schedule & occupancy</p>
                </div>
                <Link
                  to="/admin/events"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                {upcomingEventsList.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {evt.name}
                        </h4>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                          {evt.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        {formatDate(evt.date)} • {evt.venue}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900 block">
                        {evt.registeredCount} / {evt.maxParticipants}
                      </span>
                      <span className="text-[10px] font-semibold text-brand-600">
                        {evt.seatsLeft} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <Link
                to="/admin/events"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              >
                <span>View All Events ({events.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
