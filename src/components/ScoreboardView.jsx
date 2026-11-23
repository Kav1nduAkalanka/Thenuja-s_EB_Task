import React from 'react';
import { AwardIcon } from './Icons';

export default function ScoreboardView({ cards, users }) {
  const members = users.filter(u => u.role === 'member');
  const leaders = users.filter(u => u.role === 'leader');

  const memberScores = members.map(m => {
    const uc = cards.filter(c => c.uploaderId === m.id);
    const ap = uc.filter(c => c.column === 'lcvp');
    const ut = new Set();
    uc.forEach(c => (c.types || []).forEach(t => ut.add(t)));
    let pts = ap.length * 10;
    if (ut.size >= 2) pts += 5;
    return { user: m, total: uc.length, approved: ap.length, points: pts };
  }).sort((a, b) => b.points - a.points);

  const leaderScores = leaders.map(l => {
    const teamKeyword = l.teamName?.includes('Alpha') ? 'Alpha' : 'Beta';
    const tc = cards.filter(c => c.teamName?.includes(teamKeyword));
    const ta = tc.filter(c => c.column === 'lcvp');
    return { user: l, teamApproved: ta.length, points: ta.length * 5 };
  }).sort((a, b) => b.points - a.points);

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="bg-white p-5 rounded-lg border border-[#DFE1E6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#5E6C84] mb-1 font-medium">
            <span>Projects</span><span>/</span><span>oGV B2C Marketing</span><span>/</span><span className="text-[#172B4D] font-semibold">Rewards & Recognition</span>
          </div>
          <h1 className="text-xl font-bold text-[#172B4D] tracking-tight">Monthly Performance & Recognition</h1>
          <p className="text-xs text-[#5E6C84] mt-1">Term 27.28 Sprint 1 · Verified points calculated from LCVP certified deliverables.</p>
        </div>
        <button
          onClick={() => {
            if (window.confetti) {
              window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
            }
          }}
          className="px-4 py-2 bg-[#0052CC] hover:bg-[#0747A6] text-white text-xs font-semibold rounded shadow-xs flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <AwardIcon className="w-4 h-4 text-[#FFE380]" />
          <span>Celebrate Winners 🎉</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#DFE1E6] shadow-xs">
          <span className="text-[10px] font-bold text-[#5E6C84] uppercase tracking-wider block">Total Submissions</span>
          <span className="text-2xl font-bold text-[#172B4D] mt-1 block">{cards.length}</span>
          <span className="text-[10px] text-[#36B37E] font-semibold">Active in Sprint 1</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#DFE1E6] shadow-xs">
          <span className="text-[10px] font-bold text-[#5E6C84] uppercase tracking-wider block">Ready to Post</span>
          <span className="text-2xl font-bold text-[#006644] mt-1 block">
            {cards.filter(c => c.column === 'lcvp').length}
          </span>
          <span className="text-[10px] text-[#006644] font-semibold">Certified by LCVP</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#DFE1E6] shadow-xs">
          <span className="text-[10px] font-bold text-[#5E6C84] uppercase tracking-wider block">In Review</span>
          <span className="text-2xl font-bold text-[#FFAB00] mt-1 block">
            {cards.filter(c => c.column === 'leader').length}
          </span>
          <span className="text-[10px] text-[#5E6C84]">Quality checking</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#DFE1E6] shadow-xs">
          <span className="text-[10px] font-bold text-[#5E6C84] uppercase tracking-wider block">Top Contributor</span>
          <span className="text-base font-bold text-[#172B4D] mt-1.5 block truncate">
            {memberScores[0]?.user.name || 'Tharindu Silva'}
          </span>
          <span className="text-[10px] text-[#0052CC] font-semibold">{memberScores[0]?.points || 0} pts accumulated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-[#DFE1E6] shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EBECF0] bg-[#FAFBFC] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#172B4D]">Best Team Member of the Month</h2>
            <span className="text-[10px] font-bold text-[#0052CC] bg-[#DEEBFF] px-2 py-0.5 rounded uppercase">Sprint 1</span>
          </div>
          <div className="divide-y divide-[#EBECF0]">
            {memberScores.map((ms, i) => (
              <div key={ms.user.id} className={`px-5 py-3.5 flex items-center justify-between ${i === 0 ? 'bg-[#FFFAE6]/60' : 'hover:bg-[#FAFBFC]'}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-[#FFAB00] text-white shadow-xs' : i === 1 ? 'bg-[#A5ADBA] text-white' : i === 2 ? 'bg-[#CD7F32] text-white' : 'bg-[#EBECF0] text-[#5E6C84]'
                  }`}>
                    {i + 1}
                  </span>
                  <div className={`w-8 h-8 rounded-full ${ms.user.avatarBg || 'bg-[#0052CC]'} text-white text-xs font-bold flex items-center justify-center shadow-xs`}>
                    {ms.user.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172B4D] flex items-center gap-1.5">
                      <span>{ms.user.name}</span>
                      {i === 0 && <span className="text-[10px] bg-[#FFF0B3] text-[#172B4D] px-1.5 py-0.2 rounded font-bold">🏆 Leader</span>}
                    </div>
                    <div className="text-[11px] text-[#5E6C84]">{ms.user.teamName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#172B4D]">{ms.points} pts</div>
                  <div className="text-[10px] text-[#5E6C84]">{ms.approved} approved · {ms.total} total</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#DFE1E6] shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-[#EBECF0] bg-[#FAFBFC] flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#172B4D]">Best Team Leader of the Month</h2>
            <span className="text-[10px] font-bold text-[#36B37E] bg-[#E3FCEF] px-2 py-0.5 rounded uppercase">Sprint 1</span>
          </div>
          <div className="divide-y divide-[#EBECF0]">
            {leaderScores.map((ls, i) => (
              <div key={ls.user.id} className={`px-5 py-3.5 flex items-center justify-between ${i === 0 ? 'bg-[#FFFAE6]/60' : 'hover:bg-[#FAFBFC]'}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-[#FFAB00] text-white shadow-xs' : 'bg-[#EBECF0] text-[#5E6C84]'
                  }`}>
                    {i + 1}
                  </span>
                  <div className={`w-8 h-8 rounded-full ${ls.user.avatarBg || 'bg-[#FFAB00]'} text-white text-xs font-bold flex items-center justify-center shadow-xs`}>
                    {ls.user.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#172B4D] flex items-center gap-1.5">
                      <span>{ls.user.name}</span>
                      {i === 0 && <span className="text-[10px] bg-[#FFF0B3] text-[#172B4D] px-1.5 py-0.2 rounded font-bold">🏆 Top Leader</span>}
                    </div>
                    <div className="text-[11px] text-[#5E6C84]">{ls.user.teamName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#172B4D]">{ls.points} pts</div>
                  <div className="text-[10px] text-[#5E6C84]">{ls.teamApproved} approved by LCVP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
