import React, { useState, useEffect } from 'react';
import { Download, PlusCircle, Users, BookmarkCheck, Search, FileSpreadsheet, Megaphone, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import BCSLogo from './BCSLogo';

export default function AdminPortal({ onLogout }) {
  const [stats, setStats] = useState({ totalStudents: 0, totalRegistrations: 0, clubBreakdown: [] });
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Announcement Modal State
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annDescription, setAnnDescription] = useState('');
  const [annImage, setAnnImage] = useState(null);
  const [postingAnn, setPostingAnn] = useState(false);
  const [annMessage, setAnnMessage] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/students')
      ]);

      const statsData = await statsRes.json();
      const studentsData = await studentsRes.json();

      setStats(statsData);
      setStudents(studentsData.students || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    // Triggers direct browser file download for real-time Excel sheet
    window.location.href = '/api/admin/export-excel';
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annDescription) return;

    setPostingAnn(true);
    setAnnMessage('');

    try {
      const formData = new FormData();
      formData.append('title', annTitle);
      formData.append('description', annDescription);
      if (annImage) {
        formData.append('image', annImage);
      }

      const res = await fetch('/api/announcements', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to post announcement');

      setAnnMessage('Announcement published successfully! All users can view it in the notices panel.');
      setAnnTitle('');
      setAnnDescription('');
      setAnnImage(null);
      setTimeout(() => {
        setIsAnnModalOpen(false);
        setAnnMessage('');
      }, 1500);
    } catch (err) {
      setAnnMessage(`Error: ${err.message}`);
    } finally {
      setPostingAnn(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.csn_esn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 p-4 sm:p-8 select-none">
      {/* Admin Top Navigation */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <BCSLogo className="w-12 h-12" animated={false} />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-white flex items-center gap-2">
              BC CREATIVE SPECTRUM <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs border border-cyan-500/40 uppercase">Admin Portal</span>
            </h1>
            <p className="text-xs text-gray-400">Manage student registrations, database exports & campus announcements</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl glass-panel text-cyan-400 hover:text-white hover:border-cyan-400 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-semibold text-xs transition-colors"
          >
            Logout Admin
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8 pt-6">
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-panel-glow border border-cyan-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Total Registered Students</p>
              <h3 className="text-3xl font-extrabold font-heading text-white mt-1">{stats.totalStudents}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Users className="w-7 h-7" />
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel-glow border border-purple-500/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Total Club Auditions</p>
              <h3 className="text-3xl font-extrabold font-heading text-white mt-1">{stats.totalRegistrations}</h3>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <BookmarkCheck className="w-7 h-7" />
            </div>
          </div>

          {/* EXPORT TO EXCEL ACTION CARD */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 flex flex-col justify-between space-y-3">
            <div>
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" /> Real-time Export
              </p>
              <p className="text-xs text-gray-300 mt-1">Download complete student database in .xlsx format</p>
            </div>
            <button
              onClick={handleExportExcel}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              EXPORT TO EXCEL (.XLSX)
            </button>
          </div>
        </div>

        {/* CONTROLS BAR: ADD ANNOUNCEMENT BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, department, CSN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <button
            onClick={() => setIsAnnModalOpen(true)}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Announcement
          </button>
        </div>

        {/* REGISTERED STUDENTS DATA TABLE */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 overflow-x-auto space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Registered Students Database ({filteredStudents.length})
            </h3>
            <span className="text-xs text-gray-400">Updated Real-Time</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs text-gray-400">Loading student records...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">No student records found.</div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-cyan-300 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Mail ID</th>
                  <th className="py-3 px-4">Dept / Year</th>
                  <th className="py-3 px-4">Phone (WhatsApp)</th>
                  <th className="py-3 px-4">CSN / ESN</th>
                  <th className="py-3 px-4">Registered Clubs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-gray-500 font-mono">{index + 1}</td>
                    <td className="py-3 px-4 font-bold text-white">{student.name}</td>
                    <td className="py-3 px-4 text-cyan-300 font-mono">{student.email}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {student.department} <span className="text-gray-500">•</span> {student.year}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-mono">{student.phone_whatsapp}</td>
                    <td className="py-3 px-4 text-purple-300 font-mono">{student.csn_esn}</td>
                    <td className="py-3 px-4">
                      {student.registered_clubs ? (
                        <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                          {student.registered_clubs}
                        </span>
                      ) : (
                        <span className="text-gray-500 italic">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ADD ANNOUNCEMENT MODAL */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
          <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-purple-400" /> Post New Announcement
            </h2>

            {annMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                annMessage.startsWith('Error') ? 'bg-red-500/10 text-red-300 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              }`}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{annMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Auditions Venue & Timing Schedule"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description / Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write announcement details here..."
                  value={annDescription}
                  onChange={(e) => setAnnDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Attach Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAnnImage(e.target.files[0])}
                  className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={postingAnn}
                  className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-1.5"
                >
                  {postingAnn ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
