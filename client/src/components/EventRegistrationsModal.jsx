import { useState, useEffect } from 'react';
import { X, Users, Mail, User, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../utils/api';

const EventRegistrationsModal = ({ event, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get(`/registrations/event/${event._id}/registrations`);
        setRegistrations(res.data);
      } catch (err) {
        setError('Failed to load registrations. You might not have permission.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [event._id]);

  const handleStatusUpdate = async (registrationId, newStatus) => {
    setUpdatingId(registrationId);
    try {
      await api.put(`/registrations/${registrationId}/status`, { status: newStatus });
      // Update local state
      setRegistrations(prev => prev.map(r => 
        r._id === registrationId 
          ? { ...r, registrationDetails: { ...r.registrationDetails, status: newStatus } }
          : r
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
            <CheckCircle className="h-3 w-3" /> Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Registrations</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="h-8 w-8 rounded-full border-4 border-slate-100 dark:border-slate-700 border-t-primary-600 animate-spin"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 font-medium">
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No registrations yet.</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Participants will appear here once they register.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Participants</span>
                <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-bold">
                  {registrations.length}
                </span>
              </div>
              
              {registrations.map((student, idx) => {
                const displayName = student.registrationDetails?.fullName || student.name || 'Unknown Student';
                const displayEmail = student.registrationDetails?.email || student.email;
                const regType = student.registrationDetails?.registrationType || 'Individual';
                const regStatus = student.registrationDetails?.status || 'Pending';
                const isUpdating = updatingId === student._id;

                return (
                <div key={student._id || idx} className="flex flex-col p-3 sm:p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm transition-all group relative overflow-hidden">
                  {regType === 'Group' && (
                    <div className="absolute top-0 right-0 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                      Group
                    </div>
                  )}
                  <div className="flex items-center pt-1">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full flex items-center justify-center text-primary-600 font-bold shadow-inner mr-4 flex-shrink-0">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">
                          {displayName}
                        </p>
                        {getStatusBadge(regStatus)}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex items-center mt-0.5">
                        <Mail className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                        {displayEmail}
                      </p>
                    </div>
                  </div>

                  {/* Approve/Reject Buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(student._id, 'Approved')}
                      disabled={isUpdating || regStatus === 'Approved'}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-all ${
                        regStatus === 'Approved'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default'
                          : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-800'
                      } disabled:opacity-50`}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      {regStatus === 'Approved' ? 'Approved' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(student._id, 'Rejected')}
                      disabled={isUpdating || regStatus === 'Rejected'}
                      className={`flex-1 flex items-center justify-center gap-1 text-xs font-bold py-2 rounded-lg transition-all ${
                        regStatus === 'Rejected'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-default'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800'
                      } disabled:opacity-50`}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      {regStatus === 'Rejected' ? 'Rejected' : 'Reject'}
                    </button>
                  </div>

                  {student.registrationDetails && regType === 'Individual' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
                      <div className="text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Roll No:</span> {student.registrationDetails.rollNumber}</div>
                      <div className="text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span> {student.registrationDetails.phoneNumber}</div>
                      <div className="text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Dept:</span> {student.registrationDetails.department}</div>
                      <div className="text-slate-500 dark:text-slate-400"><span className="font-semibold text-slate-700 dark:text-slate-300">Year:</span> {student.registrationDetails.yearOfStudy}</div>
                    </div>
                  )}
                  {student.registrationDetails && regType === 'Group' && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
                      <div className="mb-2 text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Team Name:</span> {student.registrationDetails.teamName}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 mb-1 font-semibold text-slate-700 dark:text-slate-300">
                        Team Members ({student.registrationDetails.teamMembers?.length || 0}):
                      </div>
                      {student.registrationDetails.teamMembers?.length > 0 ? (
                        <div className="space-y-2 mt-2">
                          {student.registrationDetails.teamMembers.map((member, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded relative">
                              <p className="font-medium text-slate-800 dark:text-slate-200">{member.fullName}</p>
                              <div className="flex gap-4 mt-0.5 opacity-80">
                                <span className="flex items-center"><Mail className="h-3 w-3 mr-1" />{member.email}</span>
                                <span className="flex items-center"><User className="h-3 w-3 mr-1" />{member.rollNumber}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No additional members.</p>
                      )}
                    </div>
                  )}
                  {student.registrationDetails?.paymentProof && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <a 
                        href={student.registrationDetails.paymentProof} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border border-green-200 dark:border-green-800"
                      >
                        <FileText className="h-3.5 w-3.5" /> View Payment Proof
                      </a>
                    </div>
                  )}
                </div>
              );})}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationsModal;
