import { useState } from 'react';
import api from '../utils/api';
import { X, Phone, Hash, BookOpen, GraduationCap, Users, User, Mail, Plus, Trash2 } from 'lucide-react';

const RegisterEventModal = ({ isOpen, onClose, event, onSuccess }) => {
  const [form, setForm] = useState({
    registrationType: 'Individual',
    teamName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    rollNumber: '',
    department: '',
    yearOfStudy: '1st Year',
    teamMembers: [],
    paymentProof: '',
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !event) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...form.teamMembers];
    updatedMembers[index][field] = value;
    setForm({ ...form, teamMembers: updatedMembers });
  };

  const addMember = () => {
    setForm({
      ...form,
      teamMembers: [...form.teamMembers, { fullName: '', email: '', rollNumber: '' }],
    });
  };

  const removeMember = (index) => {
    const updatedMembers = form.teamMembers.filter((_, i) => i !== index);
    setForm({ ...form, teamMembers: updatedMembers });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    setUploading(true);
    setError('');
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm({ ...form, paymentProof: res.data });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file. Please ensure it is an Image or PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Quick validation
    if (form.registrationType === 'Group' && form.teamMembers.length === 0) {
      setError('Please add at least one team member, or register as an Individual.');
      setLoading(false);
      return;
    }

    if (event.isPaid && !form.paymentProof) {
      setError('Please upload your payment proof before registering.');
      setLoading(false);
      return;
    }

    try {
      await api.post(`/registrations/event/${event._id}/register`, form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Register for Event</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{event.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto overflow-x-hidden flex-1">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">{error}</div>
          )}

          {/* Registration Type Toggle */}
          <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-xl mb-4 flex-shrink-0">
            <button
              type="button"
              onClick={() => setForm({ ...form, registrationType: 'Individual', teamMembers: form.teamMembers.length ? [] : form.teamMembers })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                form.registrationType === 'Individual'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <User className="h-4 w-4" /> Individual
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, registrationType: 'Group' })}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                form.registrationType === 'Group'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <Users className="h-4 w-4" /> Group
            </button>
          </div>

          {form.registrationType === 'Group' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                <Users className="inline h-3.5 w-3.5 mr-1" />Team Name *
              </label>
              <input
                type="text"
                name="teamName"
                value={form.teamName}
                onChange={handleChange}
                required
                placeholder="e.g. The Innovators"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>
          )}

          <div className={`${form.registrationType === 'Group' ? 'p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-4' : 'space-y-4'}`}>
            {form.registrationType === 'Group' && (
              <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200 border-b border-gray-200 dark:border-slate-600 pb-2">Representative / Team Leader</h3>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                <User className="inline h-3.5 w-3.5 mr-1" />{form.registrationType === 'Group' ? 'Full Name *' : 'Full Name *'}
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="e.g. John Doe"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                <Mail className="inline h-3.5 w-3.5 mr-1" />Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="e.g. john@example.com"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                <Hash className="inline h-3.5 w-3.5 mr-1" />Roll Number *
              </label>
              <input
                type="text"
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleChange}
                required
                placeholder="e.g. 21BCE001"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>

            {form.registrationType === 'Individual' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    <Phone className="inline h-3.5 w-3.5 mr-1" />Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    <BookOpen className="inline h-3.5 w-3.5 mr-1" />Department / Branch *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Computer Science"
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    <GraduationCap className="inline h-3.5 w-3.5 mr-1" />Year of Study *
                  </label>
                  <select
                    name="yearOfStudy"
                    value={form.yearOfStudy}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white transition-colors"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Masters/PG">Masters/PG</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Dynamic Team Members Section */}
          {form.registrationType === 'Group' && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Additional Team Members</h3>
              {form.teamMembers.map((member, idx) => (
                <div key={idx} className="p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700/50 space-y-3 relative group">
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="absolute top-3 right-3 p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
                    title="Remove Member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Member {idx + 1}</p>

                  <div>
                    <input
                      type="text"
                      value={member.fullName}
                      onChange={(e) => handleMemberChange(idx, 'fullName', e.target.value)}
                      required
                      placeholder="Full Name *"
                      className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                      required
                      placeholder="Email Address *"
                      className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                    <input
                      type="text"
                      value={member.rollNumber}
                      onChange={(e) => handleMemberChange(idx, 'rollNumber', e.target.value)}
                      required
                      placeholder="ID / Roll No *"
                      className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addMember}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-slate-300 font-medium rounded-xl text-sm transition-all hover:bg-blue-50 dark:hover:bg-slate-700/50"
              >
                <Plus className="h-4 w-4" /> Add Team Member
              </button>
            </div>
          )}

          {event.isPaid && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl space-y-3 mt-4">
              <div className="flex items-center justify-between border-b border-indigo-200 dark:border-indigo-800 pb-2">
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 uppercase text-xs tracking-wider">
                  Registration Fee
                </h3>
                <span className="font-bold text-lg text-indigo-700 dark:text-indigo-400 tracking-tight">₹{event.registrationFee}</span>
              </div>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-400/80 font-medium">Please upload a screenshot or PDF of your payment receipt.</p>
              
              <div className="mt-2">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2.5 file:px-5
                    file:rounded-xl file:border-0
                    file:text-xs file:font-semibold
                    file:bg-indigo-600 file:text-white
                    hover:file:bg-indigo-700 dark:file:bg-indigo-600 
                    transition-all file:cursor-pointer pb-2"
                />
                
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-blue-600 animate-pulse">
                    <div className="h-3 w-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
                    Uploading document...
                  </div>
                )}
                
                {form.paymentProof && !uploading && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between text-xs text-green-700 dark:text-green-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      ✅ Proof Uploaded
                    </span>
                    <a href={form.paymentProof} target="_blank" rel="noopener noreferrer" className="text-green-800 dark:text-green-300 hover:underline">
                      View File
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm shadow transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterEventModal;
