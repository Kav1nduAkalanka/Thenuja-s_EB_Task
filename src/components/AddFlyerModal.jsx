import React, { useState } from 'react';
import { TaskIcon } from './Icons';

export default function AddFlyerModal({ 
  isOpen, 
  onClose, 
  onAddFlyer, 
  currentUser,
  onShowToast 
}) {
  const [title, setTitle] = useState('');
  const [canvaUrl, setCanvaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [priority, setPriority] = useState('medium');
  const [types, setTypes] = useState(['trend_based']);

  if (!isOpen) return null;

  const toggleType = (k) => {
    if (types.includes(k)) {
      if (types.length === 1) return;
      setTypes(types.filter(t => t !== k));
    } else {
      setTypes([...types, k]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !canvaUrl.trim()) return;

    onAddFlyer({
      title: title.trim(),
      canvaUrl: canvaUrl.trim(),
      caption: caption.trim(),
      priority,
      types: types.length > 0 ? types : ['trend_based']
    });

    setTitle('');
    setCanvaUrl('');
    setCaption('');
    setPriority('medium');
    setTypes(['trend_based']);
    onClose();

    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Issue Created',
        message: 'New deliverable logged into Submissions column.'
      });
    }
  };

  const typeConfig = [
    { key: 'trend_based', label: 'Trend Based', desc: 'Social audio, reels, youth campus trends', active: 'bg-[#EAE6FF] border-[#C0B6F2] text-[#403294]' },
    { key: 'country_based', label: 'Country Based', desc: 'Destination portfolio (Vietnam, Egypt, Brazil)', active: 'bg-[#E6FCFF] border-[#79F2C0] text-[#006644]' },
    { key: 'project_based', label: 'Project Based', desc: 'SDG volunteer goals (SDG 4 Education, SDG 13 Climate)', active: 'bg-[#DEEBFF] border-[#B3D4FF] text-[#0052CC]' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-app-fadeIn font-sans">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-app-modal border border-[#DFE1E6] overflow-hidden flex flex-col text-[#172B4D]">
        <div className="px-6 py-3.5 border-b border-[#EBECF0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <TaskIcon className="w-4 h-4" />
            <h2 className="text-sm font-bold">Create Deliverable Issue</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded hover:bg-[#EBECF0] text-[#5E6C84] hover:text-[#172B4D] flex items-center justify-center text-lg font-bold">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
          <div>
            <label className="block text-xs font-semibold text-[#5E6C84] mb-1.5">
              Summary / Campaign Title <span className="text-[#FF5630]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Global Classroom Vietnam: Winter 2026 Recruitment"
              className="w-full text-sm px-3 py-2 rounded border border-[#DFE1E6] hover:border-[#4C9AFF] focus:border-[#0052CC] focus:ring-2 focus:ring-[#DEEBFF] outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E6C84] mb-1.5">
              Canva Design Asset Link <span className="text-[#FF5630]">*</span>
            </label>
            <input
              type="url"
              required
              value={canvaUrl}
              onChange={(e) => setCanvaUrl(e.target.value)}
              placeholder="https://www.canva.com/design/DAG..."
              className="w-full text-sm px-3 py-2 rounded border border-[#DFE1E6] hover:border-[#4C9AFF] focus:border-[#0052CC] focus:ring-2 focus:ring-[#DEEBFF] outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E6C84] mb-1.5">
              Campaign Classifications <span className="text-[#FF5630]">*</span>
            </label>
            <div className="flex flex-col gap-2">
              {typeConfig.map(tc => (
                <label
                  key={tc.key}
                  onClick={() => toggleType(tc.key)}
                  className={`p-2.5 rounded border flex items-center gap-3 cursor-pointer transition-all ${
                    types.includes(tc.key) ? tc.active : 'bg-[#FAFBFC] border-[#DFE1E6] hover:bg-[#F4F5F7]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={types.includes(tc.key)}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-[#DFE1E6] text-[#0052CC] focus:ring-[#0052CC]"
                  />
                  <div>
                    <span className="text-xs font-bold block">{tc.label}</span>
                    <p className="text-[11px] opacity-80">{tc.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E6C84] mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border border-[#DFE1E6] bg-white outline-none focus:border-[#0052CC]"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5E6C84] mb-1.5">
              Description / Campaign Brief
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Target faculty, key messaging, registration deadlines..."
              className="w-full text-sm px-3 py-2 rounded border border-[#DFE1E6] hover:border-[#4C9AFF] focus:border-[#0052CC] focus:ring-2 focus:ring-[#DEEBFF] outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="text-[11px] text-[#5E6C84] bg-[#FAFBFC] border border-[#DFE1E6] rounded p-2.5">
            Submitting as <strong className="text-[#172B4D]">{currentUser?.name}</strong>. Deliverable will be routed to the <strong>Submissions</strong> column.
          </div>

          <div className="pt-3 border-t border-[#EBECF0] flex items-center justify-end gap-2.5 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium px-4 py-2 rounded text-[#5E6C84] hover:bg-[#EBECF0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm font-semibold px-4 py-2 rounded text-white bg-[#0052CC] hover:bg-[#0747A6] shadow-xs transition-colors"
            >
              Create Deliverable
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
