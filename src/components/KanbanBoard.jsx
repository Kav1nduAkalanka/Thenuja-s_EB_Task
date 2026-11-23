import React, { useState, useMemo } from 'react';
import KanbanCard from './KanbanCard';
import { PlusIcon, SearchIcon, StarIcon, ShareIcon } from './Icons';
import { canTransition } from '../utils/rbac';
import { USERS } from '../data/initialData';

export default function KanbanBoard({
  cards,
  currentRole,
  currentUser,
  onCardClick,
  onMoveCard,
  onOpenAddModal,
  searchQuery,
  setSearchQuery,
  onShowToast
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [onlyMy, setOnlyMy] = useState(false);
  const [density, setDensity] = useState('comfortable');
  const [isStarred, setIsStarred] = useState(false);
  const [dragOverCol, setDragOverCol] = useState(null);

  const filtered = useMemo(() => {
    return cards.filter(card => {
      if (typeFilter !== 'all' && !card.types?.includes(typeFilter)) return false;
      if (assigneeFilter !== 'all' && card.uploaderName !== assigneeFilter) return false;
      if (onlyMy && currentUser && card.uploaderId !== currentUser.id && card.uploaderName !== currentUser.name) return false;
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = card.title?.toLowerCase().includes(q);
        const inCap = card.caption?.toLowerCase().includes(q);
        const inAuthor = card.uploaderName?.toLowerCase().includes(q);
        const inKey = (card.key || '').toLowerCase().includes(q);
        if (!inTitle && !inCap && !inAuthor && !inKey) return false;
      }
      return true;
    });
  }, [cards, typeFilter, assigneeFilter, onlyMy, searchQuery, currentUser]);

  const memberCards = filtered.filter(c => c.column === 'member');
  const leaderCards = filtered.filter(c => c.column === 'leader');
  const lcvpCards = filtered.filter(c => c.column === 'lcvp');

  const columns = [
    {
      id: 'member',
      title: 'SUBMISSIONS',
      stage: 'Initial Creator Uploads & Content drafting',
      accentColor: 'border-t-4 border-[#0052CC]',
      headerBadge: 'bg-[#DEEBFF] text-[#0052CC]',
      wipLimit: 8,
      cards: memberCards
    },
    {
      id: 'leader',
      title: 'LEADER REVIEW',
      stage: 'Quality Assurance & Alignment Verification',
      accentColor: 'border-t-4 border-[#FFAB00]',
      headerBadge: 'bg-[#FFF0B3] text-[#172B4D]',
      wipLimit: 5,
      cards: leaderCards
    },
    {
      id: 'lcvp',
      title: 'READY TO POST',
      stage: 'LCVP Sign-off & Publication Archive',
      accentColor: 'border-t-4 border-[#36B37E]',
      headerBadge: 'bg-[#E3FCEF] text-[#006644]',
      wipLimit: 12,
      cards: lcvpCards
    }
  ];

  const handleDrop = (e, targetCol) => {
    e.preventDefault();
    setDragOverCol(null);
    const cardId = e.dataTransfer.getData('text/plain');
    if (!cardId) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.column === targetCol) return;

    const ck = canTransition(currentRole, card.column, targetCol);
    if (!ck.allowed) {
      if (onShowToast) {
        onShowToast({
          type: 'error',
          title: 'Transition Denied (RBAC Policy)',
          message: ck.reason
        });
      } else {
        alert(`ACCESS CONTROL DENIED:\n${ck.reason}`);
      }
      return;
    }

    onMoveCard(cardId, targetCol);
    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Workflow Transitioned',
        message: `${card.key || card.title} moved to ${targetCol === 'lcvp' ? 'Ready to Post' : 'Leader Review'}.`
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 font-sans">
      <div className="bg-white p-4 rounded-lg border border-[#DFE1E6] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#5E6C84] mb-1 font-medium">
              <span className="hover:underline cursor-pointer">Projects</span>
              <span>/</span>
              <span className="hover:underline cursor-pointer">oGV B2C Marketing</span>
              <span>/</span>
              <span className="text-[#172B4D] font-semibold">Term 27.28 Sprint 1</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#172B4D] tracking-tight">
                oGV B2C Deliverables Board
              </h1>
              <button 
                onClick={() => setIsStarred(!isStarred)}
                className="p-1 text-[#5E6C84] hover:bg-[#EBECF0] rounded transition-colors"
                title={isStarred ? "Remove from starred" : "Star this board"}
              >
                <StarIcon className="w-4 h-4" filled={isStarred} />
              </button>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EBECF0] text-[#172B4D]">
                Kanban
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-[#FAFBFC] px-3 py-1.5 rounded border border-[#DFE1E6] text-xs font-semibold text-[#5E6C84]">
              <span>Total: <strong className="text-[#172B4D]">{cards.length}</strong></span>
              <span className="text-[#DFE1E6]">|</span>
              <span>Ready: <strong className="text-[#006644]">{lcvpCards.length}</strong></span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(window.location.href);
                if (onShowToast) onShowToast({ type: 'success', title: 'Link Copied', message: 'Board URL copied to clipboard.' });
              }}
              className="px-2.5 py-1.5 text-xs font-semibold rounded border border-[#DFE1E6] hover:bg-[#EBECF0] text-[#42526E] flex items-center gap-1.5 transition-colors"
            >
              <ShareIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0747A6] text-white text-xs font-semibold rounded shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Deliverable</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EBECF0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-40 sm:w-52">
              <SearchIcon className="w-3.5 h-3.5 text-[#5E6C84] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter board..."
                className="w-full pl-8 pr-6 py-1 text-xs bg-[#FAFBFC] hover:bg-white border border-[#DFE1E6] rounded focus:bg-white focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC] outline-none transition-all placeholder:text-[#5E6C84]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#5E6C84] hover:text-[#172B4D]"
                >
                  &times;
                </button>
              )}
            </div>

            <div className="flex items-center -space-x-1 pl-1">
              {USERS.slice(0, 4).map(u => {
                const isSel = assigneeFilter === u.name;
                return (
                  <button
                    key={u.id}
                    onClick={() => setAssigneeFilter(isSel ? 'all' : u.name)}
                    title={`Filter by ${u.name}`}
                    className={`w-6 h-6 rounded-full ${u.avatarBg || 'bg-[#0052CC]'} text-white text-[10px] font-bold flex items-center justify-center border-2 transition-transform ${
                      isSel ? 'border-[#0052CC] scale-110 z-10' : 'border-white hover:scale-105'
                    }`}
                  >
                    {u.initials}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setOnlyMy(!onlyMy)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                onlyMy
                  ? 'bg-[#0052CC] text-white font-semibold'
                  : 'bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#172B4D] border border-[#DFE1E6]'
              }`}
            >
              Only my deliverables
            </button>

            <div className="flex items-center gap-1 border-l border-[#DFE1E6] pl-2">
              {[
                ['all', 'All'],
                ['trend_based', 'Trend'],
                ['country_based', 'Country'],
                ['project_based', 'Project']
              ].map(([k, label]) => {
                const isSel = typeFilter === k;
                return (
                  <button
                    key={k}
                    onClick={() => setTypeFilter(k)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      isSel
                        ? 'bg-[#172B4D] text-white font-semibold shadow-xs'
                        : 'bg-[#F4F5F7] hover:bg-[#EBECF0] text-[#42526E] border border-[#DFE1E6]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {(typeFilter !== 'all' || assigneeFilter !== 'all' || searchQuery || onlyMy) && (
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setAssigneeFilter('all');
                  setSearchQuery('');
                  setOnlyMy(false);
                }}
                className="text-xs text-[#0052CC] hover:underline px-1 font-semibold"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-[#5E6C84]">
            <span className="hidden sm:inline">Density:</span>
            <button
              onClick={() => setDensity(density === 'comfortable' ? 'compact' : 'comfortable')}
              className="px-2 py-0.5 rounded border border-[#DFE1E6] bg-[#FAFBFC] hover:bg-[#EBECF0] text-[11px] font-semibold text-[#172B4D] transition-colors"
            >
              {density === 'comfortable' ? 'Comfortable' : 'Compact'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => {
          const isOver = dragOverCol === col.id;
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverCol !== col.id) setDragOverCol(col.id);
              }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`bg-[#F4F5F7] rounded-lg p-3 flex flex-col min-h-[600px] border transition-all ${col.accentColor} ${
                isOver ? 'border-[#0052CC] bg-[#DEEBFF]/30 ring-2 ring-[#0052CC]' : 'border-[#DFE1E6]'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#EBECF0]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#5E6C84] tracking-wider uppercase">
                    {col.title}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${col.headerBadge}`}>
                    {col.cards.length}
                  </span>
                </div>
                <span className="text-[10px] text-[#5E6C84] font-medium">
                  Max: {col.wipLimit}
                </span>
              </div>

              <p className="text-[11px] text-[#5E6C84] mb-3 leading-snug">
                {col.stage}
              </p>

              <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto">
                {col.cards.map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', card.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <KanbanCard
                      card={card}
                      currentRole={currentRole}
                      onCardClick={onCardClick}
                      onMoveCard={onMoveCard}
                      density={density}
                    />
                  </div>
                ))}

                {col.cards.length === 0 && (
                  <div className="flex-1 border-2 border-dashed border-[#DFE1E6] rounded-md p-6 flex flex-col items-center justify-center text-center">
                    <p className="text-xs text-[#5E6C84] font-medium">No deliverables in this stage</p>
                    <p className="text-[10px] text-slate-400 mt-1">Drag items here or click Create</p>
                  </div>
                )}
              </div>

              {col.id === 'member' && (
                <button
                  onClick={onOpenAddModal}
                  className="mt-3 w-full py-1.5 px-2 bg-transparent hover:bg-[#EBECF0] text-[#5E6C84] hover:text-[#172B4D] text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition-colors border border-transparent hover:border-[#DFE1E6]"
                >
                  <PlusIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Create deliverable</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
