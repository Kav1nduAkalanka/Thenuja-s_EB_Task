import React, { useState } from 'react';
import { AiesecCsLogo, ShieldIcon } from './Icons';
import { USERS } from '../data/initialData';
import { ROLE_DEFINITIONS } from '../utils/rbac';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('aiesec2728');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your AIESEC email address.'); return; }
    const matched = USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (matched) { setError(''); onLogin(matched); }
    else {
      const name = email.split('@')[0].replace('.', ' ');
      const formatted = name.charAt(0).toUpperCase() + name.slice(1);
      onLogin({
        id: `u-custom-${Date.now()}`,
        name: formatted || 'Team Member',
        email: email.trim(),
        role: 'member',
        teamName: 'Team Alpha (Global Classroom)',
        initials: (formatted[0]||'M')+(formatted[1]||'B').toUpperCase(),
        title: 'Team Member',
        avatarBg: 'bg-[#0052CC]'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col justify-between font-sans antialiased text-[#172B4D]">
      <div className="bg-[#0747A6] text-white py-2 px-6 flex items-center justify-between text-xs border-b border-[#0052CC]">
        <div className="flex items-center gap-2 tracking-wide font-medium">
          <span className="font-bold">AIESEC IN MORATUWA</span>
          <span className="opacity-60">/</span><span>TERM 27.28</span>
          <span className="opacity-60">/</span><span className="text-[#FFE380] font-semibold">AIESEC IN CS TRACKER · oGV B2C</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] opacity-90">
          <ShieldIcon className="w-3.5 h-3.5 text-emerald-300" />
          <span>RBAC & Governance Protocol Active</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 my-6">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-app-modal border border-[#DFE1E6] overflow-hidden">
          <div className="pt-8 pb-6 px-8 text-center border-b border-[#EBECF0]">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <AiesecCsLogo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-[#172B4D]">
                AIESEC <span className="font-semibold text-[#0052CC]">in CS</span> <span className="font-normal text-[#5E6C84]">Tracker</span>
              </span>
            </div>
            <h1 className="text-xl font-semibold text-[#172B4D]">Log in to your account</h1>
            <p className="text-xs text-[#5E6C84] mt-1">oGV B2C Deliverables & Governance Performance Workspace</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs rounded bg-[#FFEBE6] text-[#BF2600] border border-[#FF8F73] font-medium">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#5E6C84] uppercase tracking-wider mb-1.5">
                  AIESEC Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. kavinda.perera@aiesec.net"
                  className="w-full px-3 py-2 text-sm border border-[#DFE1E6] rounded hover:border-[#4C9AFF] focus:border-[#0052CC] focus:ring-2 focus:ring-[#DEEBFF] outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#5E6C84] uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-[#0052CC] cursor-pointer">Term 27.28 SSO</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DFE1E6] rounded hover:border-[#4C9AFF] focus:border-[#0052CC] focus:ring-2 focus:ring-[#DEEBFF] outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0052CC] hover:bg-[#0747A6] text-white font-semibold text-sm rounded shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                Continue to AIESEC CS Tracker
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#DFE1E6]" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[#5E6C84] font-semibold text-[11px] tracking-wider">
                  Or One-Click Demo Login By Clearance
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {USERS.map(user => {
                const badge = ROLE_DEFINITIONS[user.role] || ROLE_DEFINITIONS.member;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => onLogin(user)}
                    className="text-left p-3 rounded border border-[#DFE1E6] hover:border-[#0052CC] hover:bg-[#F4F5F7] transition-all group flex items-start gap-2.5"
                  >
                    <div className={`w-8 h-8 rounded-full ${user.avatarBg || 'bg-[#0052CC]'} text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs`}>
                      {user.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-[#172B4D] truncate group-hover:text-[#0052CC]">
                          {user.name}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.color || 'bg-[#DEEBFF] text-[#0052CC]'}`}>
                          L{badge.level || 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5E6C84] truncate">{user.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-[#5E6C84] border-t border-[#DFE1E6] bg-white">
        AIESEC in University of Moratuwa · Term 27.28 · oGV B2C Deliverables & Recognition Governance Portal
      </footer>
    </div>
  );
}
