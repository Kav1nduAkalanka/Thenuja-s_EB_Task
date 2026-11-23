import React from 'react';
import { 
  KanbanIcon, 
  TimelineIcon, 
  RocketIcon, 
  AwardIcon, 
  UsersIcon, 
  ShieldIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from './Icons';

export default function Sidebar({
  activeView,
  onViewChange,
  collapsed,
  setCollapsed,
  cardsCount,
  readyCount,
  currentRole
}) {
  // Governance tab is ONLY visible to super-admin (admin role)
  const navItems = [
    { key: 'kanban',     label: 'Kanban Board',        section: 'PLANNING',    icon: <KanbanIcon className="w-4 h-4" />,   badge: cardsCount },
    { key: 'roadmap',    label: 'Timeline / Roadmap',  section: 'PLANNING',    icon: <TimelineIcon className="w-4 h-4" /> },
    { key: 'releases',   label: 'Ready to Post Assets',section: 'PLANNING',    icon: <RocketIcon className="w-4 h-4" />,  badge: readyCount, badgeColor: 'bg-[#E3FCEF] text-[#006644]' },
    { key: 'scoreboard', label: 'Scoreboard & RnR',    section: 'PERFORMANCE', icon: <AwardIcon className="w-4 h-4" /> },
    { key: 'team',       label: 'Team Directory',      section: 'PERFORMANCE', icon: <UsersIcon className="w-4 h-4" /> },
    ...(currentRole === 'admin' ? [
      { key: 'admin', label: 'Governance & RBAC', section: 'GOVERNANCE', icon: <ShieldIcon className="w-4 h-4" /> }
    ] : []),
  ];

  const sections = ['PLANNING', 'PERFORMANCE', ...(currentRole === 'admin' ? ['GOVERNANCE'] : [])];

  return (
    <aside 
      className={`bg-[#FAFBFC] border-r border-[#DFE1E6] flex flex-col justify-between transition-all duration-200 select-none z-30 shrink-0 ${
        collapsed ? 'w-14' : 'w-60'
      }`}
    >
      <div>
        <div className="p-3.5 border-b border-[#EBECF0] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded bg-[#0052CC] text-white font-bold flex items-center justify-center shrink-0 shadow-xs text-xs">
              CS
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-[#172B4D] truncate">AIESEC in CS</h2>
                <p className="text-[11px] text-[#5E6C84] truncate">oGV B2C Marketing · Term 27.28</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar ([)" : "Collapse sidebar ([)"}
            className="p-1 text-[#5E6C84] hover:text-[#172B4D] hover:bg-[#EBECF0] rounded transition-colors"
          >
            {collapsed ? <ChevronRightIcon className="w-3.5 h-3.5" /> : <ChevronLeftIcon className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="py-3 px-2 space-y-1">
          {sections.map(sec => {
            const secItems = navItems.filter(i => i.section === sec);
            if (secItems.length === 0) return null;
            return (
              <div key={sec} className="mb-3">
                {!collapsed && (
                  <div className="px-2.5 py-1 text-[10px] font-bold text-[#5E6C84] uppercase tracking-wider">
                    {sec}
                  </div>
                )}
                <div className="space-y-0.5">
                  {secItems.map(item => {
                    const isActive = activeView === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => onViewChange(item.key)}
                        title={collapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition-colors font-medium ${
                          isActive 
                            ? 'bg-[#DEEBFF] text-[#0052CC] font-semibold' 
                            : 'text-[#42526E] hover:bg-[#EBECF0] hover:text-[#172B4D]'
                        }`}
                      >
                        <span className={isActive ? 'text-[#0052CC]' : 'text-[#5E6C84]'}>{item.icon}</span>
                        {!collapsed && (
                          <span className="flex-1 text-left truncate">{item.label}</span>
                        )}
                        {!collapsed && item.badge !== undefined && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-[#DFE1E6] text-[#42526E]'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 border-t border-[#EBECF0] text-[11px] text-[#5E6C84]">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span>PROJECT TYPE</span>
            <span className="font-semibold text-[#172B4D]">CS Chapter Deliverables</span>
          </div>
          <div className="text-[10px] text-[#6B778C]">AIESEC in CS Tracker · Term 27.28</div>
        </div>
      )}
    </aside>
  );
}
