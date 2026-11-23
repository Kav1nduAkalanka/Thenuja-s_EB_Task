import React from 'react';
import { TaskIcon } from './Icons';

export default function RoadmapView({ cards, onCardClick }) {
  return (
    <div className="flex flex-col gap-4 font-sans">
      <div className="bg-white p-4 rounded-lg border border-[#DFE1E6] shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-[#5E6C84] mb-1 font-medium">
          <span>Projects</span><span>/</span><span>oGV B2C Marketing</span><span>/</span><span className="text-[#172B4D] font-semibold">Sprint Timeline</span>
        </div>
        <h1 className="text-xl font-bold text-[#172B4D] tracking-tight">Timeline & Deliverables Schedule</h1>
        <p className="text-xs text-[#5E6C84] mt-1">Term 27.28 Sprint 1 · November 2026 Execution Window</p>
      </div>

      <div className="bg-white rounded-lg border border-[#DFE1E6] shadow-xs overflow-hidden">
        <div className="grid grid-cols-12 border-b border-[#EBECF0] bg-[#FAFBFC] text-xs font-bold text-[#5E6C84] py-2.5 px-4">
          <div className="col-span-5">Deliverable Issue / Campaign</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-5 grid grid-cols-3 text-center">
            <span>Week 1</span><span>Week 2 (Active)</span><span>Week 3</span>
          </div>
        </div>

        <div className="divide-y divide-[#EBECF0]">
          {cards.map((card, idx) => {
            const statusStyles = {
              member: { label: 'Submissions', bar: 'bg-[#0052CC]' },
              leader: { label: 'Leader Review', bar: 'bg-[#FFAB00]' },
              lcvp:   { label: 'Ready to Post', bar: 'bg-[#36B37E]' },
            };
            const st = statusStyles[card.column] || statusStyles.member;

            return (
              <div
                key={card.id}
                onClick={() => onCardClick(card)}
                className="grid grid-cols-12 items-center py-3 px-4 hover:bg-[#FAFBFC] cursor-pointer transition-colors text-xs"
              >
                <div className="col-span-5 pr-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <TaskIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-mono font-bold text-[#0052CC]">{card.key || `OGV-10${idx+1}`}</span>
                    <span className="text-[#172B4D] font-semibold truncate">{card.title}</span>
                  </div>
                  <span className="text-[11px] text-[#5E6C84] truncate block">{card.teamName} · {card.uploaderName}</span>
                </div>

                <div className="col-span-2 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    card.column === 'lcvp' ? 'bg-[#E3FCEF] text-[#006644]' :
                    card.column === 'leader' ? 'bg-[#FFF0B3] text-[#172B4D]' : 'bg-[#DEEBFF] text-[#0052CC]'
                  }`}>
                    {st.label}
                  </span>
                </div>

                <div className="col-span-5 grid grid-cols-3 items-center h-8 relative">
                  <div className="absolute inset-0 grid grid-cols-3 divide-x divide-[#EBECF0] pointer-events-none opacity-40">
                    <div></div><div></div><div></div>
                  </div>
                  <div className={`col-span-2 mx-1 h-5 rounded-md ${st.bar} text-white text-[10px] font-bold flex items-center px-2 shadow-xs truncate`}>
                    {card.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
