import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import RoadmapView from './components/RoadmapView';
import ReleasesView from './components/ReleasesView';
import ScoreboardView from './components/ScoreboardView';
import TeamDirectoryView from './components/TeamDirectoryView';
import AdminView from './components/AdminView';
import AddFlyerModal from './components/AddFlyerModal';
import CardDetailModal from './components/CardDetailModal';
import { InfoIcon, CheckIcon } from './components/Icons';
import { USERS, INITIAL_CARDS } from './data/initialData';
import { canTransition, ROLE_DEFINITIONS } from './utils/rbac';
import { supabaseService } from './lib/supabaseClient';

const STORAGE_KEY = 'aiesec_cs_tracker_cards_v4';
const AUTH_KEY = 'aiesec_cs_tracker_auth_session';

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        
        let borderCls = 'border-[#DFE1E6] bg-white text-[#172B4D]';
        let iconEl = <InfoIcon className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />;
        
        if (isError) {
          borderCls = 'border-[#FF8F73] bg-[#FFEBE6] text-[#BF2600]';
          iconEl = <div className="w-2 h-2 rounded-full bg-[#FF5630] shrink-0 mt-1.5" />;
        } else if (isSuccess) {
          borderCls = 'border-[#79F2C0] bg-[#E3FCEF] text-[#006644]';
          iconEl = <CheckIcon className="w-4 h-4 text-[#36B37E] shrink-0 mt-0.5" />;
        } else if (isWarning) {
          borderCls = 'border-[#FFE380] bg-[#FFF0B3] text-[#172B4D]';
          iconEl = <InfoIcon className="w-4 h-4 text-[#FFAB00] shrink-0 mt-0.5" />;
        }

        return (
          <div 
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-md border shadow-app-dropdown flex items-start justify-between gap-3 animate-app-fadeIn transition-all ${borderCls}`}
          >
            <div className="flex items-start gap-2.5 text-xs">
              {iconEl}
              <div>
                {toast.title && <div className="font-bold mb-0.5">{toast.title}</div>}
                <div className="leading-relaxed opacity-95">{toast.message}</div>
              </div>
            </div>
            <button 
              onClick={() => onDismiss(toast.id)} 
              className="text-xs font-bold opacity-60 hover:opacity-100 p-1"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY) || localStorage.getItem('ogv_jira_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('ogv_jira_rbac_cards_v4');
      return saved ? JSON.parse(saved) : INITIAL_CARDS;
    } catch (e) {
      return INITIAL_CARDS;
    }
  });

  const [users, setUsers] = useState(USERS);

  const [activeView, setActiveView] = useState('kanban'); // 'kanban' | 'roadmap' | 'releases' | 'scoreboard' | 'team' | 'admin'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [backendStatus, setBackendStatus] = useState({ status: 'checking', database: 'local_storage', message: '' });

  useEffect(() => {
    let isMounted = true;
    async function syncRemoteData() {
      try {
        const health = await supabaseService.checkHealth();
        if (isMounted) setBackendStatus(health);

        const remoteCards = await supabaseService.getFlyers();
        if (isMounted && remoteCards && remoteCards.length > 0) {
          setCards(remoteCards);
        }
      } catch (err) {
        console.warn('Backend sync error:', err);
      }
    }
    syncRemoteData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error(e);
    }
  }, [cards]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsAddModalOpen(true);
      } else if (e.key === '[') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsAddModalOpen(false);
        setSelectedCard(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = ({ type = 'info', title, message }) => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const currentRole = currentUser?.role || 'member';

  const handleLogin = (user) => {
    setCurrentUser(user);
    showToast({
      type: 'success',
      title: 'Logged In',
      message: `Welcome to AIESEC in CS Tracker, ${user.name} (${ROLE_DEFINITIONS[user.role]?.clearanceLevel || user.role})`
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('ogv_jira_auth_session');
  };

  const handleRoleChange = (newRole) => {
    const matchedUser = USERS.find((u) => u.role === newRole);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      showToast({
        type: 'info',
        title: 'Role Switched',
        message: `Now evaluating as: ${matchedUser.name} (${ROLE_DEFINITIONS[newRole]?.clearanceLevel || newRole})`
      });
    }
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const handleMoveCard = (cardId, targetColumn, commentText = '') => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const check = canTransition(currentRole, card.column, targetColumn);
    if (!check.allowed) {
      showToast({ type: 'error', title: 'Permission Denied', message: check.reason });
      return;
    }

    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const roleTitles = { member: 'Team Member', leader: 'Team Leader', lcvp: 'LCVP oGV B2C', admin: 'Candidate LCVP TM' };
    const colNames = { member: 'Submissions', leader: 'Leader Review', lcvp: 'Ready to Post' };
    const note = commentText || `Moved from [${colNames[card.column]}] to [${colNames[targetColumn]}].`;

    const updComments = [
      ...(card.comments || []),
      {
        id: `c-${Date.now()}`,
        authorName: currentUser.name,
        authorRole: roleTitles[currentUser.role] || currentUser.role,
        text: note,
        timestamp: ts,
        isMovementLog: true
      }
    ];

    const updCards = cards.map(c => c.id === cardId ? { ...c, column: targetColumn, comments: updComments } : c);
    setCards(updCards);
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard({ ...selectedCard, column: targetColumn, comments: updComments });
    }

    // Async sync with Supabase remote backend
    supabaseService.updateFlyerColumn(cardId, targetColumn, {
      userRole: currentRole,
      userId: currentUser.id,
      userName: currentUser.name,
      commentText: note
    });
  };

  const handleAddFlyer = ({ title, canvaUrl, caption, priority, types }) => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const count = cards.length + 1;
    const newCard = {
      id: `KB-${String(count).padStart(2,'0')}`,
      key: `OGV-10${count}`,
      title,
      canvaUrl,
      caption,
      priority: priority || 'medium',
      types: types.length > 0 ? types : ['trend_based'],
      column: 'member',
      uploaderName: currentUser.name,
      uploaderId: currentUser.id,
      uploaderRole: currentUser.role,
      teamName: currentUser.teamName || 'Team Alpha (Global Classroom)',
      createdAt: ts,
      comments: [
        {
          id: `c-init-${Date.now()}`,
          authorName: currentUser.name,
          authorRole: currentUser.title || 'Team Member',
          text: `Created deliverable. Classification: ${types.join(', ')}.`,
          timestamp: ts
        }
      ]
    };
    setCards([newCard, ...cards]);

    // Async sync with Supabase remote backend
    supabaseService.createFlyer({
      title,
      canvaUrl,
      caption,
      priority: priority || 'medium',
      types,
      uploaderName: currentUser.name,
      uploaderId: currentUser.id,
      uploaderRole: currentUser.role,
      teamName: currentUser.teamName || 'Team Alpha (Global Classroom)'
    });
  };

  const handleAddComment = (cardId, text) => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const roleTitles = { member: 'Team Member', leader: 'Team Leader', lcvp: 'LCVP oGV B2C', admin: 'Candidate LCVP TM' };
    const nc = {
      id: `c-${Date.now()}`,
      authorName: currentUser.name,
      authorRole: roleTitles[currentUser.role] || currentUser.role,
      text,
      timestamp: ts
    };
    setCards(cards.map(c => c.id === cardId ? { ...c, comments: [...(c.comments || []), nc] } : c));
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard({ ...selectedCard, comments: [...(selectedCard.comments || []), nc] });
    }

    // Async sync with Supabase remote backend
    supabaseService.addComment(cardId, {
      authorName: currentUser.name,
      authorRole: roleTitles[currentUser.role] || currentUser.role,
      authorId: currentUser.id,
      text
    });
  };

  const handleSeedDatabase = async () => {
    const res = await supabaseService.seedRemoteDatabase();
    if (res?.success) {
      const remoteCards = await supabaseService.getFlyers();
      if (remoteCards && remoteCards.length > 0) setCards(remoteCards);
    }
    return res;
  };

  const handleResetData = () => {
    if (confirm('Reset to initial demo data?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('ogv_jira_rbac_cards_v4');
      setCards(INITIAL_CARDS);
      showToast({ type: 'info', title: 'Data Reset', message: 'Demo cards restored to default state.' });
    }
  };

  const readyCount = cards.filter(c => c.column === 'lcvp').length;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#172B4D] flex flex-col font-sans antialiased">
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          cardsCount={cards.length}
          readyCount={readyCount}
          currentRole={currentRole}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 max-w-7xl mx-auto w-full">
          {activeView === 'kanban' && (
            <KanbanBoard
              cards={cards}
              currentRole={currentRole}
              currentUser={currentUser}
              onCardClick={setSelectedCard}
              onMoveCard={handleMoveCard}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onShowToast={showToast}
            />
          )}

          {activeView === 'roadmap' && (
            <RoadmapView
              cards={cards}
              onCardClick={setSelectedCard}
            />
          )}

          {activeView === 'releases' && (
            <ReleasesView
              cards={cards}
              onCardClick={setSelectedCard}
            />
          )}

          {activeView === 'scoreboard' && (
            <ScoreboardView
              cards={cards}
              users={USERS}
            />
          )}

          {activeView === 'team' && (
            <TeamDirectoryView
              users={USERS}
              cards={cards}
            />
          )}

          {activeView === 'admin' && (
            <AdminView
              users={USERS}
              onResetData={handleResetData}
              onRoleChange={handleRoleChange}
              onShowToast={showToast}
              backendStatus={backendStatus}
              onTriggerSeed={handleSeedDatabase}
            />
          )}
        </main>
      </div>

      <AddFlyerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddFlyer={handleAddFlyer}
        currentUser={currentUser}
        onShowToast={showToast}
      />

      <CardDetailModal
        card={selectedCard}
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        currentRole={currentRole}
        onMoveCard={handleMoveCard}
        onAddComment={handleAddComment}
        currentUser={currentUser}
        onShowToast={showToast}
      />

      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
