import React, { useState, useEffect } from 'react';
import { Menu, X, Info, Megaphone, BookmarkCheck, HelpCircle, LogOut, ChevronRight, User } from 'lucide-react';
import BCSLogo from './BCSLogo';

export default function Navbar({ currentUser, onLogout, onRequestAuth }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [announcements, setAnnouncements] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  // Fetch announcements when menu is opened or tab changed to announcements
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'announcements') {
        fetchAnnouncements();
      } else if (activeTab === 'myclubs' && currentUser?.id && currentUser.role === 'student') {
        fetchUserRegistrations();
      }
    }
  }, [isOpen, activeTab, currentUser]);

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true);
    try {
      const res = await fetch('/api/announcements');
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      const res = await fetch(`/api/user/registrations/${currentUser.id}`);
      const data = await res.json();
      setUserRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Failed to load user registrations:', err);
    }
  };

  return (
    <>
      {/* Top Left Persistent 3-Line Hamburger Button */}
      <button
        id="menu-hamburger-btn"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 rounded-2xl glass-panel-glow text-cyan-400 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl group border border-cyan-500/30"
        aria-label="Open Navigation Menu"
      >
        <Menu className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
      </button>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sliding Drawer Navigation Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-full sm:w-96 glass-panel z-50 flex flex-col transform transition-transform duration-300 ease-out border-r border-white/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <BCSLogo className="w-10 h-10" animated={false} />
            <div>
              <h2 className="text-lg font-bold font-heading text-white tracking-wide">BC CREATIVE SPECTRUM</h2>
              <p className="text-xs text-cyan-400 font-medium">Official College Club Portal</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info Strip (If logged in) */}
        {currentUser ? (
          <div className="px-6 py-4 bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                <p className="text-xs text-gray-400">
                  {currentUser.role === 'admin' ? '🛡️ System Admin' : `${currentUser.department} • ${currentUser.year}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="px-6 py-4 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
            <p className="text-xs text-gray-400">Welcome! Sign in to register for clubs.</p>
            <button
              onClick={() => {
                setIsOpen(false);
                onRequestAuth('login');
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition-all"
            >
              Login
            </button>
          </div>
        )}

        {/* Drawer Menu Tabs */}
        <div className="grid grid-cols-4 border-b border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 flex flex-col items-center justify-center text-xs font-medium transition-all ${
              activeTab === 'about'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Info className="w-4 h-4 mb-1" />
            About
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-3 flex flex-col items-center justify-center text-xs font-medium transition-all ${
              activeTab === 'announcements'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Megaphone className="w-4 h-4 mb-1" />
            Notices
          </button>
          <button
            onClick={() => setActiveTab('myclubs')}
            className={`py-3 flex flex-col items-center justify-center text-xs font-medium transition-all ${
              activeTab === 'myclubs'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 mb-1" />
            Your Clubs
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`py-3 flex flex-col items-center justify-center text-xs font-medium transition-all ${
              activeTab === 'help'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 mb-1" />
            Help
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ABOUT TAB */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 to-purple-950/30 border border-cyan-500/20">
                <h3 className="text-base font-bold text-white mb-2 font-heading">About BC Creative Spectrum</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  BC Creative Spectrum (BCS) is the flagship umbrella organization for innovation, cultural arts, technology, literature, and leadership across the college campus.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Key Highlights</h4>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>8 Specialized Clubs spanning Tech, Arts & Enterprise</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Maximum 2 Club Audition Limit per Student</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-200">
                    <span className="w-2 h-2 rounded-full bg-pink-400"></span>
                    <span>Interactive Solar System Orbit Selection</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-gray-400 space-y-2">
                <p className="font-semibold text-gray-200">Audition Rules:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Explore the 8 clubs in the solar system hub.</li>
                  <li>Click on any club logo to read its audition notice.</li>
                  <li>You can register for up to 2 clubs maximum.</li>
                  <li>Registered clubs will display a "REGISTERED" badge.</li>
                </ul>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {activeTab === 'announcements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-heading">Latest Announcements</h3>
                <button
                  onClick={fetchAnnouncements}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Refresh
                </button>
              </div>

              {loadingAnnouncements ? (
                <div className="text-center py-8 text-xs text-gray-400">Loading announcements...</div>
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400">No announcements posted yet.</div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/30 transition-all space-y-3"
                    >
                      {ann.image_url && (
                        <img
                          src={ann.image_url}
                          alt={ann.title}
                          className="w-full h-36 object-cover rounded-lg border border-white/10"
                        />
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-cyan-300 font-heading">{ann.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(ann.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <p className="text-xs text-gray-200 leading-relaxed whitespace-pre-line">
                        {ann.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* YOUR CLUBS TAB */}
          {activeTab === 'myclubs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white font-heading">Your Registered Clubs</h3>

              {!currentUser ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 text-center space-y-3">
                  <p>Please log in with your Mail ID to view your registered audition clubs.</p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onRequestAuth('login');
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors"
                  >
                    Log In Now
                  </button>
                </div>
              ) : currentUser.role === 'admin' ? (
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                  You are logged in as Administrator. Switch to the Admin Portal to manage all student registrations.
                </div>
              ) : userRegistrations.length === 0 ? (
                <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 text-center text-xs text-gray-400 space-y-3">
                  <p>You have not registered for any club auditions yet.</p>
                  <p className="text-cyan-400 font-medium">
                    Go to the interactive solar system on the home screen, click on your favorite club, and register!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-400">
                    Registrations: <span className="text-cyan-400 font-bold">{userRegistrations.length} / 2 Maximum</span>
                  </p>
                  {userRegistrations.map((club) => (
                    <div
                      key={club.id}
                      className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-purple-950/40 border border-cyan-500/30 flex items-start justify-between"
                    >
                      <div>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wider mb-1 inline-block"
                          style={{ backgroundColor: club.badge_color || '#3b82f6' }}
                        >
                          {club.category}
                        </span>
                        <h4 className="text-sm font-bold text-white">{club.name}</h4>
                        <p className="text-xs text-cyan-300 font-medium">{club.easy_meaning}</p>
                        <p className="text-[11px] text-gray-400 mt-2">
                          Registered: {new Date(club.registered_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                        CONFIRMED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HELP TAB */}
          {activeTab === 'help' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white font-heading">Help & Support</h3>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                <p className="text-gray-300 leading-relaxed">
                  Need assistance with club registrations or technical support? Contact the BC Creative Spectrum Student Coordinators below:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                    <p className="font-bold text-cyan-400 text-sm">General Helpdesk</p>
                    <p className="text-gray-300">Email: support@bccreativespectrum.edu</p>
                    <p className="text-gray-300">WhatsApp: +91 98765 43210</p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 space-y-1">
                    <p className="font-bold text-purple-400 text-sm">Club Coordinators</p>
                    <p className="text-gray-300">Details will be updated here soon.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-white/10 text-center text-[11px] text-gray-500 bg-black/20">
          BC Creative Spectrum © 2026 • All Rights Reserved
        </div>
      </div>
    </>
  );
}
