import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import SignInModal from './components/SignInModal';
import FidgetSpinnerHub from './components/FidgetSpinnerHub';
import ClubNoticeModal from './components/ClubNoticeModal';
import AdminPortal from './components/AdminPortal';
import Toast from './components/Toast';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bcs_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [clubs, setClubs] = useState([]);
  const [registeredClubIds, setRegisteredClubIds] = useState([]);
  const [selectedClubForNotice, setSelectedClubForNotice] = useState(null);

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Fetch clubs and user's registrations on mount and when currentUser changes
  useEffect(() => {
    fetchClubsData();
  }, [currentUser]);

  const fetchClubsData = async () => {
    try {
      const url = currentUser?.id ? `/api/clubs?userId=${currentUser.id}` : '/api/clubs';
      const res = await fetch(url);
      const data = await res.json();
      setClubs(data.clubs || []);
      setRegisteredClubIds(data.registeredClubIds || []);
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('bcs_user', JSON.stringify(user));
    showToast(
      user.role === 'admin'
        ? 'Logged in as Administrator'
        : `Welcome back, ${user.name}! Interactive Solar Hub unlocked.`,
      'success'
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bcs_user');
    setRegisteredClubIds([]);
    showToast('Logged out successfully', 'info');
  };

  const handleConfirmRegister = async (clubId) => {
    if (!currentUser?.id) {
      setLoginModalOpen(true);
      return;
    }

    try {
      const res = await fetch('/api/clubs/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, clubId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register for audition');
      }

      setRegisteredClubIds(data.registeredClubIds || []);
      showToast('Audition registration confirmed successfully!', 'success');
      setSelectedClubForNotice(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col relative font-['Inter',sans-serif]">
      {/* Toast Banner */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* ADMIN PORTAL VIEW */}
      {currentUser && currentUser.role === 'admin' ? (
        <AdminPortal onLogout={handleLogout} />
      ) : (
        /* STUDENT / VISITOR VIEW */
        <>
          {/* Top Left Persistent 3-Line Hamburger Menu */}
          <Navbar
            currentUser={currentUser}
            onLogout={handleLogout}
            onRequestAuth={(type) => {
              if (type === 'login') setLoginModalOpen(true);
              else setSignInModalOpen(true);
            }}
          />

          {/* MAIN CONTAINER */}
          <main className="flex-1 flex flex-col justify-center">
            {currentUser ? (
              /* LOGGED IN STUDENT DASHBOARD: INTERACTIVE SOLAR SYSTEM FIDGET SPINNER HUB */
              <FidgetSpinnerHub
                clubs={clubs}
                registeredClubIds={registeredClubIds}
                onSelectClub={(club) => setSelectedClubForNotice(club)}
                currentUser={currentUser}
              />
            ) : (
              /* LANDING PAGE WITH VIDEO BACKGROUND & ACTION BUTTONS */
              <LandingPage
                onOpenLogin={() => setLoginModalOpen(true)}
                onOpenSignIn={() => setSignInModalOpen(true)}
              />
            )}
          </main>
        </>
      )}

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* SIGN IN / REGISTRATION MODAL */}
      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
        onSuccessRegistration={(msg) => {
          showToast(msg, 'success');
          setLoginModalOpen(true);
        }}
      />

      {/* CLUB AUDITION NOTICE POP-UP MODAL */}
      <ClubNoticeModal
        club={selectedClubForNotice}
        isOpen={!!selectedClubForNotice}
        onClose={() => setSelectedClubForNotice(null)}
        registeredClubIds={registeredClubIds}
        currentUser={currentUser}
        onConfirmRegister={handleConfirmRegister}
        onRequestLogin={() => {
          setSelectedClubForNotice(null);
          setLoginModalOpen(true);
        }}
      />
    </div>
  );
}
