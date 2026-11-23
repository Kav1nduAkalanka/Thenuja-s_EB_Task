import React from 'react';
import { 
  TaskIcon, 
  PriorityHighIcon, 
  PriorityMediumIcon, 
  PriorityLowIcon, 
  ExternalLinkIcon, 
  MessageIcon, 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  CheckIcon 
} from './Icons';
import { canTransition } from '../utils/rbac';

export default function KanbanCard({ 
  card, 
  currentRole, 
  onCardClick, 
  onMoveCard, 
  density = 'comfortable' 
}) {
  const issueKey = card.key || `OGV-${card.id.replace(/[^0-9]/g,'')||'101'}`;

  const getPriorityIcon = (p) => {
    if (p === 'high') return <PriorityHighIcon className="w-3.5 h-3.5" />;
    if (p === 'low') return <PriorityLowIcon className="w-3.5 h-3.5" />;
    return <PriorityMediumIcon className="w-3.5 h-3.5" />;
  };

  const getTypeBadge = (type) => {
    const map = {
      trend_based:   { cls: 'bg-[#EAE6FF] text-[#403294] border-[#C0B6F2]', label: 'Trend' },
      country_based: { cls: 'bg-[#E6FCFF] text-[#006644] border-[#79F2C0]', label: 'Country' },
      project_based: { cls: 'bg-[#DEEBFF] text-[#0052CC] border-[#B3D4FF]', label: 'Project' }
    };
    const m = map[type];
    if (!m) return null;
    return (
      <span key={type} className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${m.cls}`}>
        {m.label}
      </span>
    );
  };

  const renderWorkflowButton = () => {
    if (card.column === 'member') {
      const ck = canTransition(currentRole, 'member', 'leader');
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!ck.allowed) { alert(`ACCESS RESTRICTED:\n${ck.reason}`); return; }
            onMoveCard(card.id, 'leader');
          }}
          title={ck.allowed ? "Escalate to Team Leader Review" : ck.reason}
          className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
            ck.allowed
              ? 'bg-[#0052CC] text-white hover:bg-[#0747A6] shadow-xs'
              : 'bg-[#EBECF0] text-[#A5ADBA] cursor-not-allowed border border-[#DFE1E6]'
          }`}
        >
          <span>Move to Review</span>
          <ArrowRightIcon className="w-3 h-3" />
        </button>
      );
    }
    if (card.column === 'leader') {
      const ckApprove = canTransition(currentRole, 'leader', 'lcvp');
      const ckReturn = canTransition(currentRole, 'leader', 'member');
      return (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!ckReturn.allowed) { alert(`ACCESS RESTRICTED:\n${ckReturn.reason}`); return; }
              onMoveCard(card.id, 'member', 'Changes requested by reviewer.');
            }}
            title={ckReturn.allowed ? "Return to Member for modifications" : ckReturn.reason}
            className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#FFEBE6] text-[#BF2600] hover:bg-[#FFBDAD] border border-[#FF8F73] flex items-center gap-0.5 transition-colors"
          >
            <ArrowLeftIcon className="w-3 h-3" />
            <span>Return</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!ckApprove.allowed) { alert(`ACCESS RESTRICTED:\n${ckApprove.reason}`); return; }
              onMoveCard(card.id, 'lcvp');
            }}
            title={ckApprove.allowed ? "Authorize publication as Ready to Post" : ckApprove.reason}
            className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
              ckApprove.allowed
                ? 'bg-[#36B37E] text-white hover:bg-[#00875A] shadow-xs'
                : 'bg-[#EBECF0] text-[#A5ADBA] cursor-not-allowed border border-[#DFE1E6]'
            }`}
          >
            <span>Approve</span>
            <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>
      );
    }
    if (card.column === 'lcvp') {
      return (
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E3FCEF] text-[#006644] border border-[#79F2C0] flex items-center gap-1">
          <CheckIcon className="w-3 h-3 text-[#36B37E]" />
          <span>Ready to Post</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div
      onClick={() => onCardClick(card)}
      className="bg-white rounded border border-[#DFE1E6] hover:border-[#4C9AFF] shadow-app-card hover:shadow-app-card-hover transition-all p-3 cursor-pointer flex flex-col justify-between group select-none font-sans"
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <TaskIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-bold text-[#0052CC] font-mono tracking-tight group-hover:underline">
              {issueKey}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {getPriorityIcon(card.priority || 'medium')}
            {(card.types || []).map(t => getTypeBadge(t))}
          </div>
        </div>

        <h3 className="text-xs font-semibold text-[#172B4D] group-hover:text-[#0052CC] leading-snug line-clamp-2 transition-colors">
          {card.title}
        </h3>

        {density === 'comfortable' && card.caption && (
          <p className="text-[11px] text-[#5E6C84] mt-1 line-clamp-2 leading-relaxed">
            {card.caption}
          </p>
        )}

        {card.canvaUrl && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              window.open(card.canvaUrl, '_blank', 'noopener,noreferrer');
            }}
            className="mt-2 inline-flex items-center justify-between w-full px-2 py-1 bg-[#FAFBFC] hover:bg-[#EBECF0] border border-[#DFE1E6] rounded text-[11px] text-[#0052CC] font-medium transition-colors"
            title="Open Canva design template"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-3.5 h-3.5 rounded bg-[#00C4CC] text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                C
              </span>
              <span className="truncate">Canva Asset: {card.title}</span>
            </div>
            <ExternalLinkIcon className="w-3 h-3 text-[#5E6C84] shrink-0 ml-1" />
          </div>
        )}

        <div className="mt-2 text-[10px] text-[#5E6C84] truncate">
          {card.teamName || 'oGV B2C Marketing Team'}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#EBECF0] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-[#5E6C84]" title={`${card.comments?.length || 0} comments`}>
          <MessageIcon className="w-3.5 h-3.5" />
          <span className="font-semibold text-xs">{card.comments?.length || 0}</span>
        </div>

        <div className="flex items-center gap-2">
          {renderWorkflowButton()}
          <div
            className="w-6 h-6 rounded-full bg-[#0052CC] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs border border-white"
            title={`Assignee: ${card.uploaderName || 'Team Member'}`}
          >
            {card.uploaderName ? card.uploaderName.split(' ').map(n=>n[0]).join('').slice(0,2) : 'KP'}
          </div>
        </div>
      </div>
    </div>
  );
}
