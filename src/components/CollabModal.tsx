import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, DollarSign, Clock, Users, Send } from 'lucide-react';
import { CollabRequest } from '../types';

interface CollabModalProps {
  isOpen: boolean;
  onClose: () => void;
  collab?: CollabRequest | null;
  isDarkMode: boolean;
}

export const CollabModal: React.FC<CollabModalProps> = ({
  isOpen,
  onClose,
  collab,
  isDarkMode,
}) => {
  const [pitchText, setPitchText] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const targetCollab: CollabRequest = collab || {
    id: 'hero-collab',
    creatorName: 'Topson Media',
    handle: '@topsonmedia',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    title: 'Looking for a Premiere Pro Video Editor',
    description: 'Am looking for a video editor. Need someone experienced in YouTube long-form tech tutorials and vertical TikTok/Shorts hooks. Fast turnarounds and eye for sound design.',
    neededRole: 'Video Editor',
    budget: '$300 - $500 per video',
    platform: 'YouTube & TikTok',
    timeAgo: '15m ago',
    category: 'Technology & Gaming',
    responsesCount: 14,
  };

  const handleSendPitch = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setPitchText('');
      onClose();
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-7 border shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#0B1130] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={targetCollab.avatar}
            alt={targetCollab.creatorName}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#00D2FF]"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-base">{targetCollab.creatorName}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-[#00D2FF] font-semibold">
                Verified Creator
              </span>
            </div>
            <p className="text-xs text-slate-400">{targetCollab.handle} • {targetCollab.timeAgo}</p>
          </div>
        </div>

        {/* Collab Details */}
        <div className={`p-4 rounded-2xl mb-4 border ${isDarkMode ? 'bg-[#060A1F] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-2">
            Needed: {targetCollab.neededRole}
          </div>
          <h4 className="text-lg font-bold mb-2">{targetCollab.title}</h4>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">{targetCollab.description}</p>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block">Proposed Budget</span>
              <span className="font-bold text-emerald-400 text-sm">{targetCollab.budget}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Platforms</span>
              <span className="font-semibold text-slate-200">{targetCollab.platform}</span>
            </div>
          </div>
        </div>

        {/* Pitch Form or Confirmation */}
        {sent ? (
          <div className="py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={28} />
            </div>
            <h5 className="text-base font-bold text-white">Collaboration Pitch Sent!</h5>
            <p className="text-xs text-slate-400 mt-1">
              {targetCollab.creatorName} will receive your portfolio and profile in direct messages.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSendPitch}>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Send your pitch or link to your portfolio:
            </label>
            <textarea
              required
              rows={3}
              value={pitchText}
              onChange={(e) => setPitchText(e.target.value)}
              placeholder="Hi! I have 3 years editing high-engagement YouTube tech videos. Here's my reel..."
              className={`w-full p-3 rounded-xl text-xs sm:text-sm border resize-none focus:outline-hidden ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-[#00D2FF]'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-[#00D2FF]'
              }`}
            />
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-full text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="gradient-btn-primary px-5 py-2 text-xs font-bold text-white rounded-full flex items-center gap-1.5 shadow-md shadow-[#FF1E82]/30 cursor-pointer"
              >
                <Send size={13} />
                <span>Submit Collaboration Pitch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
