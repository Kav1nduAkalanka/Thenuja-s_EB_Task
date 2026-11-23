import React from 'react';
import { RocketIcon, CheckIcon, ExternalLinkIcon } from './Icons';

export default function ReleasesView({ cards, onCardClick }) {
  const readyCards = cards.filter(c => c.column === 'lcvp');

  return (
    <div className="flex flex-col gap-4 font-sans">
      <div className="bg-white p-4 rounded-lg border border-[#DFE1E6] shadow-xs">
        <div className="flex items-center gap-1.5 text-xs text-[#5E6C84] mb-1">
          <span>Projects</span><span>/</span><span>oGV B2C Marketing</span><span>/</span><span className="text-[#172B4D] font-semibold">Published Releases</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#172B4D] tracking-tight">Ready to Post Deliverables Archive</h1>
            <p className="text-xs text-[#5E6C84] mt-1">Verified campaigns officially signed off by LCVP oGV B2C for immediate publication.</p>
          </div>
          <div className="bg-[#E3FCEF] border border-[#79F2C0] px-3.5 py-1.5 rounded-md text-xs font-bold text-[#006644] flex items-center gap-1.5">
            <CheckIcon className="w-4 h-4 text-[#36B37E]" />
            <span>{readyCards.length} Deliverables Ready for Socials</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {readyCards.map(card => (
          <div
            key={card.id}
            onClick={() => onCardClick(card)}
            className="bg-white rounded-lg border border-[#DFE1E6] hover:border-[#36B37E] shadow-app-card hover:shadow-app-card-hover transition-all p-4 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[#0052CC]">{card.key || 'OGV-103'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E3FCEF] text-[#006644] border border-[#79F2C0] flex items-center gap-1">
                  <CheckIcon className="w-3 h-3" />
                  <span>Certified Post Ready</span>
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#172B4D] leading-snug mb-2">{card.title}</h3>
              <p className="text-xs text-[#5E6C84] line-clamp-3 leading-relaxed mb-3">{card.caption}</p>

              {card.canvaUrl && (
                <a
                  href={card.canvaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full py-1.5 px-3 bg-[#00C4CC]/10 hover:bg-[#00C4CC]/20 border border-[#00C4CC]/30 rounded text-xs text-[#007A80] font-semibold flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded bg-[#00C4CC] text-white text-[10px] font-bold flex items-center justify-center">C</span>
                    <span>Open Canva Asset</span>
                  </span>
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#EBECF0] flex items-center justify-between text-xs text-[#5E6C84]">
              <span>By <strong>{card.uploaderName}</strong></span>
              <span>{card.createdAt?.split(' ')[0]}</span>
            </div>
          </div>
        ))}

        {readyCards.length === 0 && (
          <div className="col-span-full bg-white rounded-lg border border-dashed border-[#DFE1E6] p-10 text-center">
            <RocketIcon className="w-8 h-8 text-[#5E6C84] mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-bold text-[#172B4D]">No Deliverables Signed Off Yet</h3>
            <p className="text-xs text-[#5E6C84] mt-1">Review Column 2 deliverables with LCVP clearance to certify them for release.</p>
          </div>
        )}
      </div>
    </div>
  );
}
