import React, { useState } from 'react';
import { RefreshIcon, CheckIcon, DatabaseIcon } from './Icons';
import { ROLE_DEFINITIONS } from '../utils/rbac';

const AVATAR_COLORS = [
  'bg-[#0052CC]','bg-[#00B8D9]','bg-[#6554C0]','bg-[#FFAB00]',
  'bg-[#36B37E]','bg-[#006644]','bg-[#403294]','bg-[#FF5630]'
];

const TEAMS = [
  'Team Alpha (Global Classroom)',
  'Team Beta (Eco Pioneers)',
  'Team Gamma (Winter Peak)',
  'Executive Board',
  'Talent Management',
];

const PROMOTABLE_ROLES = ['member', 'leader', 'lcvp'];

function getInitials(name) {
  return name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function AdminView({
  users, setUsers,
  currentRole,
  onResetData,
  onShowToast,
  backendStatus,
  onTriggerSeed
}) {
  const isAdmin = currentRole === 'admin';
  const isLCVP  = currentRole === 'lcvp' || currentRole === 'admin';

  /* ── Pending approvals (admin-only) ── */
  const [pendingUsers, setPendingUsers] = useState([
    { id: 'p-1', name: 'Charith Bandara', email: 'charith.bandara@aiesec.net', role: 'leader', teamName: 'Team Gamma (Winter Peak)', date: '2026-11-23' }
  ]);

  /* ── Add-member form ── */
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'member', teamName: TEAMS[0], title: '' });
  const [addError, setAddError] = useState('');

  /* ── DB seeding (admin-only) ── */
  const [isSeeding, setIsSeeding] = useState(false);

  /* ──────────────────────────────────── */

  const handleApprove = (id, name) => {
    setPendingUsers(pendingUsers.filter(u => u.id !== id));
    onShowToast?.({ type: 'success', title: 'Authorization Granted', message: `${name}'s account has been verified and activated.` });
  };

  const handleAddMember = () => {
    setAddError('');
    if (!newMember.name.trim()) return setAddError('Full name is required.');
    if (!newMember.email.trim() || !newMember.email.includes('@')) return setAddError('A valid email is required.');
    if (users.find(u => u.email === newMember.email.trim())) return setAddError('A member with this email already exists.');

    const id = `u-${Date.now()}`;
    const created = {
      id,
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      role: newMember.role,
      teamName: newMember.teamName,
      title: newMember.title.trim() || (newMember.role === 'leader' ? 'Team Leader' : 'Team Member'),
      initials: getInitials(newMember.name),
      avatarBg: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
    };
    setUsers(prev => [...prev, created]);
    setNewMember({ name: '', email: '', role: 'member', teamName: TEAMS[0], title: '' });
    setShowAddForm(false);
    onShowToast?.({ type: 'success', title: 'Member Added', message: `${created.name} has been added as ${ROLE_DEFINITIONS[created.role]?.name || created.role}.` });
  };

  const handlePromote = (userId, newRole) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    onShowToast?.({ type: 'success', title: 'Role Updated', message: `${target.name} promoted to ${ROLE_DEFINITIONS[newRole]?.name || newRole}.` });
  };

  const handleRemove = (userId) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (!window.confirm(`Remove ${target.name} from the team? This cannot be undone.`)) return;
    setUsers(prev => prev.filter(u => u.id !== userId));
    onShowToast?.({ type: 'info', title: 'Member Removed', message: `${target.name} has been removed from the registry.` });
  };

  const handleSeed = async () => {
    if (!onTriggerSeed) return;
    setIsSeeding(true);
    try {
      const res = await onTriggerSeed();
      if (res?.success) {
        onShowToast?.({ type: 'success', title: 'Database Seeded', message: 'Term 27.28 initial deliverables and members populated in remote Supabase.' });
      } else {
        onShowToast?.({ type: 'warning', title: 'Database Notification', message: res?.error || res?.message || 'Remote database configuration needed.' });
      }
    } catch (e) {
      onShowToast?.({ type: 'error', title: 'Seed Error', message: e.message });
    } finally {
      setIsSeeding(false);
    }
  };

  const isConnected = backendStatus?.database === 'connected';

  /* ─── manageable roles: lcvp can promote up to 'leader'; admin can do anything ─── */
  const promotableOptions = (currentUserRole, targetUserId) => {
    const target = users.find(u => u.id === targetUserId);
    if (!target) return [];
    if (currentUserRole === 'admin') return PROMOTABLE_ROLES;
    // LCVP can set member <-> leader only (cannot create another lcvp/admin)
    return ['member', 'leader'];
  };

  return (
    <div className="flex flex-col gap-6 font-sans">

      {/* ── Header ── */}
      <div className="bg-white p-5 rounded-lg border border-[#DFE1E6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#BF2600] bg-[#FFEBE6] px-2.5 py-0.5 rounded border border-[#FF8F73] uppercase tracking-wider">
            {isAdmin ? 'Super Admin · Governance & Safety' : 'LCVP · Member Management'}
          </span>
          <h2 className="text-base font-bold text-[#172B4D] mt-1.5">
            {isAdmin ? 'Admin Security Panel & RBAC Matrix' : 'Team Member Management'}
          </h2>
          <p className="text-xs text-[#5E6C84]">
            {isAdmin
              ? 'Super-admin oversight: leadership clearance, database governance, and full RBAC control.'
              : 'Add or remove members and adjust team roles within your authority as LCVP.'}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isAdmin && (
            <button
              onClick={onResetData}
              className="text-xs font-semibold px-3.5 py-2 rounded border border-[#DFE1E6] hover:bg-[#F4F5F7] transition-colors text-[#172B4D] flex items-center gap-1.5"
            >
              <RefreshIcon className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          )}
          {isLCVP && (
            <button
              onClick={() => setShowAddForm(v => !v)}
              className="text-xs font-semibold px-3.5 py-2 rounded bg-[#0052CC] hover:bg-[#0747A6] text-white transition-colors flex items-center gap-1.5"
            >
              <span className="text-base leading-none">+</span>
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Add Member Form ── */}
      {showAddForm && isLCVP && (
        <div className="bg-white rounded-lg border border-[#B3D4FF] shadow-xs p-5">
          <h3 className="text-sm font-bold text-[#172B4D] mb-4">New Team Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5E6C84] mb-1">Full Name *</label>
              <input
                value={newMember.name}
                onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Kasun Bandara"
                className="w-full border border-[#DFE1E6] rounded px-3 py-1.5 text-xs text-[#172B4D] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5E6C84] mb-1">AIESEC Email *</label>
              <input
                value={newMember.email}
                onChange={e => setNewMember(p => ({ ...p, email: e.target.value }))}
                placeholder="name@aiesec.net"
                className="w-full border border-[#DFE1E6] rounded px-3 py-1.5 text-xs text-[#172B4D] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5E6C84] mb-1">Role</label>
              <select
                value={newMember.role}
                onChange={e => setNewMember(p => ({ ...p, role: e.target.value }))}
                className="w-full border border-[#DFE1E6] rounded px-3 py-1.5 text-xs text-[#172B4D] focus:outline-none focus:border-[#0052CC]"
              >
                <option value="member">Team Member</option>
                <option value="leader">Team Leader</option>
                {isAdmin && <option value="lcvp">LCVP</option>}
                {isAdmin && <option value="admin">Admin (Super)</option>}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5E6C84] mb-1">Team</label>
              <select
                value={newMember.teamName}
                onChange={e => setNewMember(p => ({ ...p, teamName: e.target.value }))}
                className="w-full border border-[#DFE1E6] rounded px-3 py-1.5 text-xs text-[#172B4D] focus:outline-none focus:border-[#0052CC]"
              >
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#5E6C84] mb-1">Job Title (optional)</label>
              <input
                value={newMember.title}
                onChange={e => setNewMember(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Content Creator"
                className="w-full border border-[#DFE1E6] rounded px-3 py-1.5 text-xs text-[#172B4D] focus:outline-none focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]"
              />
            </div>
          </div>
          {addError && <p className="text-xs text-[#BF2600] mt-2">{addError}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => { setShowAddForm(false); setAddError(''); }}
              className="text-xs px-3.5 py-1.5 rounded border border-[#DFE1E6] hover:bg-[#F4F5F7] text-[#42526E] transition-colors"
            >Cancel</button>
            <button
              onClick={handleAddMember}
              className="text-xs px-4 py-1.5 rounded bg-[#0052CC] hover:bg-[#0747A6] text-white font-semibold transition-colors"
            >Add Member</button>
          </div>
        </div>
      )}

      {/* ── Super-Admin: Pending Approvals ── */}
      {isAdmin && (
        <div className="bg-white rounded-lg border border-[#DFE1E6] shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EBECF0] bg-[#FAFBFC] flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172B4D]">Pending Leadership Approvals</h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0B3] text-[#172B4D]">
              {pendingUsers.length} Pending
            </span>
          </div>
          <div className="divide-y divide-[#EBECF0]">
            {pendingUsers.map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFAB00] text-white text-xs font-bold flex items-center justify-center">
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172B4D]">{u.name}</div>
                    <div className="text-[11px] text-[#5E6C84]">{u.email} · {u.role} · {u.teamName}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleApprove(u.id, u.name)}
                  className="px-3 py-1.5 bg-[#36B37E] hover:bg-[#00875A] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 shadow-xs"
                >
                  <CheckIcon className="w-3 h-3" />
                  <span>Authorize</span>
                </button>
              </div>
            ))}
            {pendingUsers.length === 0 && (
              <div className="px-5 py-6 text-center text-xs text-[#5E6C84]">
                All leadership registrations have been verified.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Super-Admin: Remote Supabase Status ── */}
      {isAdmin && (
        <div className="bg-white rounded-lg border border-[#DFE1E6] shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isConnected ? 'bg-[#E3FCEF] text-[#006644]' : 'bg-[#FFF0B3] text-[#172B4D]'}`}>
              <DatabaseIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#172B4D]">Remote Supabase Database</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isConnected ? 'bg-[#E3FCEF] text-[#006644] border-[#79F2C0]' : 'bg-[#FFF0B3] text-[#172B4D] border-[#FFE380]'}`}>
                  {isConnected ? 'LIVE CONNECTED' : 'LOCAL CACHE'}
                </span>
              </div>
              <p className="text-xs text-[#5E6C84] mt-0.5">
                {backendStatus?.message || 'Connect your remote Supabase instance via .env.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-3.5 py-2 text-xs font-semibold rounded bg-[#0052CC] hover:bg-[#0747A6] text-white transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <RefreshIcon className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Seeding...' : 'Seed Term 27.28 Data'}</span>
          </button>
        </div>
      )}

      {/* ── LCVP + Admin: Active Member Registry with actions ── */}
      <div className="bg-white rounded-lg border border-[#DFE1E6] shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-[#EBECF0] bg-[#FAFBFC] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172B4D]">Active Member Registry</h3>
          <span className="text-[11px] text-[#5E6C84]">{users.length} members</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAFBFC] text-[#5E6C84] border-b border-[#EBECF0]">
                <th className="text-left px-5 py-2.5 font-semibold">Member</th>
                <th className="text-left px-5 py-2.5 font-semibold">Email</th>
                <th className="text-left px-5 py-2.5 font-semibold">Clearance Role</th>
                <th className="text-left px-5 py-2.5 font-semibold">Team</th>
                {isLCVP && <th className="text-left px-5 py-2.5 font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBECF0]">
              {users.map(u => {
                const def = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.member;
                const canEdit = isLCVP && (isAdmin || ['member', 'leader'].includes(u.role));
                return (
                  <tr key={u.id} className="hover:bg-[#FAFBFC] transition-colors">
                    <td className="px-5 py-2.5 font-medium text-[#172B4D]">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full ${u.avatarBg || 'bg-[#0052CC]'} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                          {u.initials}
                        </span>
                        <div>
                          <div>{u.name}</div>
                          {u.title && <div className="text-[10px] text-[#5E6C84]">{u.title}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-[#5E6C84] font-mono">{u.email}</td>
                    <td className="px-5 py-2.5">
                      {canEdit ? (
                        <select
                          value={u.role}
                          onChange={e => handlePromote(u.id, e.target.value)}
                          className="border border-[#DFE1E6] rounded px-2 py-1 text-[11px] text-[#172B4D] bg-white focus:outline-none focus:border-[#0052CC] cursor-pointer"
                        >
                          {promotableOptions(currentRole, u.id).map(r => (
                            <option key={r} value={r}>{ROLE_DEFINITIONS[r]?.name || r}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${def.badgeColor || 'bg-[#DEEBFF] text-[#0052CC] border-[#B3D4FF]'}`}>
                          {def.name} · {def.clearanceLevel}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-2.5 text-[#5E6C84]">{u.teamName}</td>
                    {isLCVP && (
                      <td className="px-5 py-2.5">
                        {canEdit ? (
                          <button
                            onClick={() => handleRemove(u.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#BF2600] border border-[#FF8F73] bg-[#FFEBE6] hover:bg-[#FFD5CC] rounded transition-colors"
                          >
                            Remove
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#5E6C84] italic">Protected</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
