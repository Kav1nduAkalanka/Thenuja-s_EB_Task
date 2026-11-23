import React, { useState, useRef, useEffect } from 'react';
import { 
  AiesecCsLogo, 
  GridIcon, 
  PlusIcon, 
  SearchIcon, 
  BellIcon, 
  SettingsIcon, 
  ChevronDownIcon, 
  CheckIcon, 
  LogOutIcon 
} from './Icons';
import { ROLE_DEFINITIONS } from '../utils/rbac';
import { USERS } from '../data/initialData';

export default function Navbar({
  currentUser,
  currentRole,
  onRoleChange,
  onOpenAddModal,
  onLogout,
  searchQuery,
  setSearchQuery,
  sidebarCollapsed,
  setSidebarCollapsed
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentDef = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS.member;

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotificationOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-white border-b border-[#DFE1E6] sticky top-0 z-40 select-none font-sans">
      {/* Top Banner */}
      <div className="bg-[#0747A6] text-white text-[11px] py-1 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide">AIESEC IN MORATUWA</span>
          <span className="opacity-40">/</span>
          <span>TERM 27.28</span>
          <span className="opacity-40">/</span>
          <span className="text-[#FFE380] font-medium hidden sm:inline">AIESEC IN CS TRACKER · oGV B2C PERFORMANCE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-300 font-semibold uppercase text-[10px] bg-[#0052CC] px-2 py-0.5 rounded border border-[#2684FF]">
            RBAC ACTIVE: {currentDef.clearanceLevel}
          </span>
        </div>
      </div>

      {/* Main Top Nav */}
      <div className="h-13 px-3 sm:px-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Toggle Project Sidebar ([)"
            className="p-1.5 text-[#5E6C84] hover:text-[#172B4D] hover:bg-[#EBECF0] rounded transition-colors"
          >
            <GridIcon className="w-4 h-4" />
          </button>

          {/* Logo & Tracker Name */}
          <div className="flex items-center gap-2 pr-3 border-r border-[#DFE1E6]">
            <AiesecCsLogo className="w-6 h-6 shrink-0" />
            <span className="text-base font-bold text-[#172B4D] tracking-tight hidden md:inline">
              AIESEC <span className="font-semibold text-[#0052CC]">in CS</span> <span className="font-normal text-[#5E6C84]">Tracker</span>
            </span>
          </div>

          <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#EBECF0] transition-colors cursor-pointer text-xs font-semibold text-[#172B4D]">
            <div className="w-5 h-5 rounded bg-[#0052CC] text-white text-[10px] font-bold flex items-center justify-center">
              CS
            </div>
            <span className="truncate max-w-[140px] sm:max-w-none">oGV B2C Deliverables</span>
          </div>

          <button
            onClick={onOpenAddModal}
            title="Create deliverable issue (c)"
            className="ml-1 sm:ml-2 px-3 py-1.5 bg-[#0052CC] hover:bg-[#0747A6] active:bg-[#00388B] text-white text-xs sm:text-sm font-semibold rounded shadow-xs transition-all flex items-center gap-1.5 group"
          >
            <PlusIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block w-48 lg:w-64">
            <SearchIcon className="w-3.5 h-3.5 text-[#5E6C84] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deliverables..."
              className="w-full pl-8 pr-7 py-1 text-xs bg-[#FAFBFC] hover:bg-[#EBECF0] focus:bg-white border border-[#DFE1E6] rounded focus:border-[#0052CC] focus:ring-2 focus:ring-[#DEEBFF] outline-none transition-all placeholder:text-[#5E6C84]"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#5E6C84] font-mono bg-[#EBECF0] px-1 py-0.2 rounded border border-[#DFE1E6]">
              /
            </span>
          </div>

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-1.5 text-[#5E6C84] hover:text-[#172B4D] hover:bg-[#EBECF0] rounded relative transition-colors"
              title="Notifications"
            >
              <BellIcon className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#FF5630] absolute top-1 right-1"></span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-app-dropdown border border-[#DFE1E6] py-2 z-50 animate-app-fadeIn text-[#172B4D]">
                <div className="px-4 py-2 border-b border-[#EBECF0] flex items-center justify-between">
                  <span className="text-xs font-bold">Notifications</span>
                  <span className="text-[10px] font-semibold text-[#0052CC] hover:underline cursor-pointer">Mark all as read</span>
                </div>
                <div className="divide-y divide-[#EBECF0] max-h-72 overflow-y-auto">
                  <div className="p-3 text-xs hover:bg-[#FAFBFC] transition-colors cursor-pointer">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#5E6C84] mb-0.5">
                      <span className="font-semibold text-[#172B4D]">Senuri Jayawardena</span> approved OGV-102
                    </div>
                    <p className="text-xs text-[#172B4D] font-medium truncate">Destination Portfolio: Egypt Guide</p>
                    <span className="text-[10px] text-[#5E6C84]">15 minutes ago</span>
                  </div>
                  <div className="p-3 text-xs hover:bg-[#FAFBFC] transition-colors cursor-pointer">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#5E6C84] mb-0.5">
                      <span className="font-semibold text-[#172B4D]">Dulani Fernando</span> signed off OGV-103
                    </div>
                    <p className="text-xs text-[#172B4D] font-medium truncate">Global Classroom SDG 4 Flyer</p>
                    <span className="text-[10px] text-[#5E6C84]">2 hours ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            className="p-1.5 text-[#5E6C84] hover:text-[#172B4D] hover:bg-[#EBECF0] rounded transition-colors hidden sm:block" 
            title="Tracker Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded hover:bg-[#EBECF0] transition-colors"
            >
              <div className={`w-7 h-7 rounded-full ${currentUser?.avatarBg || 'bg-[#0052CC]'} text-white text-xs font-bold flex items-center justify-center shadow-xs border border-white`}>
                {currentUser?.initials || 'KP'}
              </div>
              <ChevronDownIcon className="w-3 h-3 text-[#5E6C84] hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-app-dropdown border border-[#DFE1E6] py-2 z-50 animate-app-fadeIn text-[#172B4D]">
                <div className="px-4 py-2 border-b border-[#EBECF0]">
                  <div className="text-xs font-bold truncate">{currentUser?.name}</div>
                  <div className="text-[11px] text-[#5E6C84] font-mono truncate">{currentUser?.email}</div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${currentDef.color || 'bg-[#DEEBFF] text-[#0052CC]'}`}>
                      {currentDef.title || currentDef.name}
                    </span>
                    <span className="text-[10px] text-[#5E6C84]">{currentDef.clearanceLevel}</span>
                  </div>
                </div>

                <div className="px-4 pt-2.5 pb-1 text-[11px] font-bold text-[#5E6C84] uppercase tracking-wider">
                  Switch Active Role (RBAC Simulator)
                </div>
                <div className="px-2 space-y-0.5">
                  {USERS.slice(0, 5).concat([USERS[5], USERS[6]]).map((u) => {
                    const isSel = currentRole === u.role;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          onRoleChange(u.role);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-2.5 py-1.5 rounded text-left text-xs flex items-center justify-between transition-colors ${
                          isSel ? 'bg-[#DEEBFF] text-[#0052CC] font-bold' : 'hover:bg-[#F4F5F7] text-[#172B4D]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-5 h-5 rounded-full ${u.avatarBg || 'bg-[#0052CC]'} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                            {u.initials}
                          </span>
                          <div className="truncate">
                            <div className="truncate">{u.name}</div>
                            <div className="text-[10px] text-[#5E6C84] font-normal truncate">{u.title}</div>
                          </div>
                        </div>
                        {isSel && <CheckIcon className="w-3.5 h-3.5 text-[#0052CC] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="my-2 border-t border-[#EBECF0]" />
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full px-4 py-1.5 text-left text-xs text-[#FF5630] hover:bg-[#FFEBE6] flex items-center gap-2 font-medium transition-colors"
                >
                  <LogOutIcon className="w-3.5 h-3.5" />
                  <span>Log out of Tracker</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
