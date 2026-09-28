import React, { useState } from 'react';
import { Eye, Ticket, Calendar, MapPin, Mail, Phone, School, GraduationCap, Clock } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { getEventById } from '../../utils/storage';

export const RegistrationTable = ({ registrations = [] }) => {
  const [selectedReg, setSelectedReg] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);

  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const formatDateTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleOpenDetail = (reg) => {
    setSelectedReg(reg);
    const evt = getEventById(reg.eventId);
    setEventDetails(evt);
  };

  if (registrations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
        <p className="text-slate-500 text-sm">No registrations found matching the filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-subtle">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-5">Registration ID</th>
              <th className="py-4 px-4">Student</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">College</th>
              <th className="py-4 px-3 text-center">Year</th>
              <th className="py-4 px-4">Event</th>
              <th className="py-4 px-4">Registered On</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {registrations.map((reg) => (
              <tr
                key={reg.id}
                className="hover:bg-slate-50/70 transition-colors duration-150 group"
              >
                {/* Registration ID */}
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md border border-brand-200/60">
                    {reg.id}
                  </span>
                </td>

                {/* Student */}
                <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                  {reg.fullName}
                </td>

                {/* Email */}
                <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                  {reg.email}
                </td>

                {/* College */}
                <td className="py-3.5 px-4 text-xs text-slate-600 max-w-[200px] truncate">
                  {reg.college}
                </td>

                {/* Year */}
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {reg.year}
                  </span>
                </td>

                {/* Event */}
                <td className="py-3.5 px-4 text-xs font-semibold text-slate-900 max-w-[200px] truncate">
                  {reg.eventName}
                </td>

                {/* Registered On */}
                <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                  {formatDate(reg.registeredAt)}
                </td>

                {/* Actions */}
                <td className="py-3.5 px-5 text-right whitespace-nowrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDetail(reg)}
                    icon={Eye}
                    className="py-1 px-2.5 text-xs font-semibold"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Registration Details Modal */}
      {selectedReg && (
        <Modal
          isOpen={Boolean(selectedReg)}
          onClose={() => setSelectedReg(null)}
          title="Registration Details"
          subtitle={`Pass ID: ${selectedReg.id}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-6">
            {/* Student Information Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                Student Information
              </h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-bold text-slate-900">{selectedReg.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email
                  </span>
                  <span className="font-medium text-slate-900">{selectedReg.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone Number
                  </span>
                  <span className="font-medium text-slate-900">{selectedReg.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-slate-400" />
                    College / University
                  </span>
                  <span className="font-medium text-slate-900 text-right">{selectedReg.college}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Year</span>
                  <span className="font-medium text-slate-900">{selectedReg.year}</span>
                </div>
              </div>
            </div>

            {/* Event Information Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Event Information
              </h4>
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/60 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Event</span>
                  <span className="font-bold text-slate-900">{selectedReg.eventName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium text-slate-900">
                    {eventDetails ? formatDate(eventDetails.date) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time</span>
                  <span className="font-medium text-slate-900">
                    {eventDetails?.time || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Venue</span>
                  <span className="font-medium text-slate-900 text-right">
                    {eventDetails?.venue || 'Campus Venue'}
                  </span>
                </div>
              </div>
            </div>

            {/* Registration Verification */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Ticket className="w-4 h-4" />
                Registration Record
              </h4>
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Registration ID</span>
                  <span className="font-mono font-bold text-slate-900">{selectedReg.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Registered Date & Time</span>
                  <span className="text-slate-700">{formatDateTime(selectedReg.registeredAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {selectedReg.status || 'Confirmed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedReg(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
