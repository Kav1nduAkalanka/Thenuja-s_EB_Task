import React from 'react';
import { ROLE_DEFINITIONS } from '../utils/rbac';

export default function TeamDirectoryView({ users, cards }) {
  return (
    <div className="flex flex-col gap-4 font-sans">
      <div className="bg-white p-4 rounded-lg border border-[#DFE1E6] shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-[#5E6C84] mb-1 font-medium">
          <span>Projects</span><span>/</span><span>oGV B2C Marketing</span><span>/</span><span className="text-[#172B4D] font-semibold">Team Directory</span>
        </div>
        <h1 className="text-xl font-bold text-[#172B4D] tracking-tight">Squads & Clearance Directory</h1>
        <p className="text-xs text-[#5E6C84] mt-1">AIESEC in University of Moratuwa · Term 27.28 oGV B2C Department Personnel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => {
          const def = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.member;
          const userCards = cards.filter(c => c.uploaderId === u.id || c.uploaderName === u.name);
          const approvedCount = userCards.filter(c => c.column === 'lcvp').length;

          return (
            <div key={u.id} className="bg-white rounded-lg border border-[#DFE1E6] shadow-xs p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-11 h-11 rounded-full ${u.avatarBg || 'bg-[#0052CC]'} text-white font-bold flex items-center justify-center text-sm shadow-xs border-2 border-white`}>
                    {u.initials}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${def.color || 'bg-[#DEEBFF] text-[#0052CC] border-[#B3D4FF]'}`}>
                    {def.clearanceLevel || def.name}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#172B4D]">{u.name}</h3>
                <p className="text-xs text-[#5E6C84] font-medium">{u.title}</p>
                <p className="text-[11px] text-[#0052CC] font-mono mt-0.5">{u.email}</p>
                <div className="mt-3 text-xs text-[#172B4D] bg-[#FAFBFC] p-2.5 rounded border border-[#EBECF0]">
                  <span className="text-[#5E6C84] text-[10px] uppercase font-bold block mb-0.5">Chapter Squad</span>
                  {u.teamName}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EBECF0] flex items-center justify-between text-xs text-[#5E6C84]">
                <span>Submissions: <strong className="text-[#172B4D]">{userCards.length}</strong></span>
                <span>Approved: <strong className="text-[#006644]">{approvedCount}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
