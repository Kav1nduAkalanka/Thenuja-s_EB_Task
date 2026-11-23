import React, { useState } from 'react';
import { 
  TaskIcon, 
  ExternalLinkIcon, 
  CopyIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  CheckIcon 
} from './Icons';
import { canTransition } from '../utils/rbac';

export default function CardDetailModal({
  card,
  isOpen,
  onClose,
  currentRole,
  onMoveCard,
  onAddComment,
  currentUser,
  onShowToast
}) {
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('comments');

  if (!isOpen || !card) return null;

  const issueKey = card.key || `OGV-${card.id.replace(/[^0-9]/g,'')||'101'}`;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(card.id, newComment.trim());
    setNewComment('');
    if (onShowToast) onShowToast({ type: 'success', title: 'Comment Added', message: 'Your review feedback has been logged.' });
  };

  const getStatusLozenge = (col) => {
    const m = {
      member: 'bg-[#DEEBFF] text-[#0052CC] border-[#B3D4FF]',
      leader: 'bg-[#FFF0B3] text-[#172B4D] border-[#FFE380]',
      lcvp:   'bg-[#E3FCEF] text-[#006644] border-[#79F2C0]'
    };
    const labels = {
      member: 'SUBMISSIONS',
      leader: 'LEADER REVIEW',
      lcvp:   'READY TO POST'
    };
    return (
      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${m[col]||''}`}>
        {labels[col] || col}
      </span>
    );
  };

  const ckL = canTransition(currentRole, 'member', 'leader');
  const ckV = canTransition(currentRole, 'leader', 'lcvp');
  const ckR = canTransition(currentRole, 'leader', 'member');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-app-fadeIn font-sans">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[92vh] shadow-app-modal border border-[#DFE1E6] overflow-hidden flex flex-col text-[#172B4D]">
        
        <div className="px-6 py-3 border-b border-[#EBECF0] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <TaskIcon className="w-4 h-4 shrink-0" />
            <span className="text-xs font-mono font-bold text-[#0052CC]">{issueKey}</span>
            <span className="text-xs text-[#5E6C84]">/</span>
            <span className="text-xs text-[#5E6C84] font-medium">Deliverable Details</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(issueKey);
                if (onShowToast) onShowToast({ type: 'success', title: 'Copied', message: `${issueKey} copied to clipboard.` });
              }}
              className="p-1 text-[#5E6C84] hover:text-[#172B4D] rounded"
              title="Copy Issue Key"
            >
              <CopyIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded hover:bg-[#EBECF0] text-[#5E6C84] hover:text-[#172B4D] flex items-center justify-center text-lg font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-5">
            <h1 className="text-lg font-bold text-[#172B4D] leading-snug">
              {card.title}
            </h1>

            {card.canvaUrl && (
              <div className="bg-[#FAFBFC] border border-[#DFE1E6] rounded-md p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#00C4CC] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                      C
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#172B4D]">Canva Project Asset</div>
                      <a
                        href={card.canvaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0052CC] hover:underline font-mono truncate block max-w-sm"
                      >
                        {card.canvaUrl}
                      </a>
                    </div>
                  </div>
                  <a
                    href={card.canvaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-[#0052CC] hover:bg-[#0747A6] text-white rounded text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                  >
                    <span>Open Design</span>
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xs font-bold text-[#5E6C84] uppercase tracking-wider mb-2">
                Description & Campaign Brief
              </h2>
              <div className="bg-[#FAFBFC] border border-[#DFE1E6] rounded-md p-3.5 text-xs text-[#172B4D] leading-relaxed whitespace-pre-wrap">
                {card.caption || 'No campaign brief provided.'}
              </div>
            </div>

            <div className="mt-2 pt-4 border-t border-[#EBECF0]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`pb-1 border-b-2 transition-colors ${
                      activeTab === 'comments' ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-[#5E6C84] hover:text-[#172B4D]'
                    }`}
                  >
                    Comments ({card.comments?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-1 border-b-2 transition-colors ${
                      activeTab === 'history' ? 'border-[#0052CC] text-[#0052CC]' : 'border-transparent text-[#5E6C84] hover:text-[#172B4D]'
                    }`}
                  >
                    History & Audit Log
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitComment} className="mb-4">
                <div className="border border-[#DFE1E6] rounded-md p-2.5 focus-within:border-[#0052CC] focus-within:ring-2 focus-within:ring-[#DEEBFF] transition-all bg-white">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add review feedback, design revisions, or approval notes..."
                    rows={2}
                    className="w-full text-xs outline-none resize-none placeholder:text-[#5E6C84]"
                  />
                  <div className="flex items-center justify-between pt-2 border-t border-[#EBECF0] mt-1.5">
                    <span className="text-[11px] text-[#5E6C84]">
                      Posting as: <strong className="text-[#172B4D]">{currentUser?.name}</strong>
                    </span>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-3.5 py-1 bg-[#0052CC] hover:bg-[#0747A6] disabled:bg-[#EBECF0] disabled:text-[#A5ADBA] text-white text-xs font-semibold rounded transition-colors shadow-xs"
                    >
                      Save Comment
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-3">
                {(card.comments || []).map(c => (
                  <div key={c.id} className="p-3 bg-[#FAFBFC] border border-[#DFE1E6] rounded-md flex gap-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-[#0052CC] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {c.authorName ? c.authorName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'US'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#172B4D]">{c.authorName}</span>
                          <span className="text-[#5E6C84]">({c.authorRole})</span>
                        </div>
                        <span className="text-[#5E6C84]">{c.timestamp}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#172B4D]">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-72 bg-[#FAFBFC] border border-[#DFE1E6] rounded-lg p-4 flex flex-col gap-4 self-start">
            <div>
              <span className="text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider block mb-1.5">
                Current Status
              </span>
              <div className="mb-3">
                {getStatusLozenge(card.column)}
              </div>

              <span className="text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider block mb-1.5">
                Workflow Actions (RBAC Gated)
              </span>
              <div className="space-y-2">
                {card.column === 'member' && (
                  <button
                    onClick={() => {
                      if (!ckL.allowed) { alert(`ACCESS DENIED:\n${ckL.reason}`); return; }
                      onMoveCard(card.id, 'leader');
                      if (onShowToast) onShowToast({ type: 'success', title: 'Moved', message: 'Escalated to Leader Review.' });
                    }}
                    className={`w-full py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                      ckL.allowed
                        ? 'bg-[#0052CC] hover:bg-[#0747A6] text-white shadow-xs'
                        : 'bg-[#EBECF0] text-[#A5ADBA] cursor-not-allowed border border-[#DFE1E6]'
                    }`}
                  >
                    <span>Escalate to Leader</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                )}

                {card.column === 'leader' && (
                  <>
                    <button
                      onClick={() => {
                        if (!ckV.allowed) { alert(`ACCESS DENIED:\n${ckV.reason}`); return; }
                        onMoveCard(card.id, 'lcvp');
                        if (onShowToast) onShowToast({ type: 'success', title: 'Approved', message: 'Authorized as Ready to Post!' });
                      }}
                      className={`w-full py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-between transition-colors ${
                        ckV.allowed
                          ? 'bg-[#36B37E] hover:bg-[#00875A] text-white shadow-xs'
                          : 'bg-[#EBECF0] text-[#A5ADBA] cursor-not-allowed border border-[#DFE1E6]'
                      }`}
                    >
                      <span>Approve to LCVP</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (!ckR.allowed) { alert(`ACCESS DENIED:\n${ckR.reason}`); return; }
                        onMoveCard(card.id, 'member', 'Modifications requested by leader.');
                        if (onShowToast) onShowToast({ type: 'warning', title: 'Returned', message: 'Returned to Submissions for updates.' });
                      }}
                      className="w-full py-1.5 px-3 rounded text-xs font-semibold bg-[#FFEBE6] text-[#BF2600] hover:bg-[#FFBDAD] border border-[#FF8F73] flex items-center justify-between transition-colors"
                    >
                      <span>Request Changes</span>
                      <ArrowLeftIcon className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {card.column === 'lcvp' && (
                  <div className="p-2.5 bg-[#E3FCEF] border border-[#79F2C0] rounded text-xs text-[#006644] font-medium flex items-center gap-1.5">
                    <CheckIcon className="w-4 h-4 text-[#36B37E] shrink-0" />
                    <span>Authorized for immediate social media publication.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#EBECF0] pt-3 space-y-3 text-xs">
              <div>
                <span className="text-[#5E6C84] block text-[11px] font-semibold mb-0.5">Assignee</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0052CC] text-white text-[10px] font-bold flex items-center justify-center">
                    {card.uploaderName?.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-[#172B4D]">{card.uploaderName}</span>
                </div>
              </div>

              <div>
                <span className="text-[#5E6C84] block text-[11px] font-semibold mb-0.5">Priority</span>
                <span className="font-medium capitalize">{card.priority || 'Medium'}</span>
              </div>

              <div>
                <span className="text-[#5E6C84] block text-[11px] font-semibold mb-0.5">Category Labels</span>
                <div className="flex flex-wrap gap-1">
                  {(card.types || []).map(t => (
                    <span key={t} className="px-2 py-0.5 bg-[#EBECF0] rounded text-[11px] font-medium">
                      {t.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[#5E6C84] block text-[11px] font-semibold mb-0.5">Squad Team</span>
                <span className="font-medium">{card.teamName}</span>
              </div>

              <div>
                <span className="text-[#5E6C84] block text-[11px] font-semibold mb-0.5">Created Date</span>
                <span className="text-[#5E6C84]">{card.createdAt}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
