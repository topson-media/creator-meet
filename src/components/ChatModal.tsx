import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';
import { AccountBadge } from './AccountBadge';
import { X, Send, Sparkles, CheckCheck, Smile } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    name: string;
    handle: string;
    avatar: string;
    role: 'creator' | 'fan';
  };
  isDarkMode: boolean;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  targetUser,
  isDarkMode,
}) => {
  const { userProfile } = useAuth();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderId: 'target',
      senderName: targetUser.name,
      senderAvatar: targetUser.avatar,
      text: `Hey there! Thanks for reaching out. Are you interested in collaborating or discussing upcoming content ideas?`,
      timestamp: '10:14 AM',
      isMe: false,
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: userProfile?.id || 'me',
      senderName: userProfile?.fullName || 'Me',
      senderAvatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulate friendly instant reply after a short delay
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: 'target',
        senderName: targetUser.name,
        senderAvatar: targetUser.avatar,
        text: `Sounds awesome! Let me review your profile and we can set up a quick recording or co-production session. Excited to build together!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const handleQuickIcebreaker = (text: string) => {
    setInputText(text);
  };

  return (
    <div
      id="chat-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="chat-modal-card"
        className={`relative w-full max-w-lg h-[540px] flex flex-col rounded-3xl overflow-hidden border shadow-2xl transition-all my-auto ${
          isDarkMode
            ? 'bg-[#0A0F29] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <img
              src={targetUser.avatar}
              alt={targetUser.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-400/50"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-bold truncate max-w-[170px] sm:max-w-none">
                  {targetUser.name}
                </h4>
                <AccountBadge role={targetUser.role} size="sm" />
              </div>
              <p className="text-[11px] text-slate-400">
                {targetUser.handle.startsWith('@') ? targetUser.handle : `@${targetUser.handle}`} •{' '}
                <span className="text-emerald-400 font-medium">Online</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!msg.isMe && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover mb-1 flex-shrink-0"
                />
              )}

              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.isMe
                    ? 'gradient-btn-primary text-white rounded-br-xs'
                    : isDarkMode
                    ? 'bg-white/10 text-slate-200 rounded-bl-xs border border-white/10'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200'
                }`}
              >
                <p>{msg.text}</p>
                <div
                  className={`mt-1 text-[9px] flex items-center justify-end gap-1 ${
                    msg.isMe ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isMe && <CheckCheck size={11} />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick icebreaker chips */}
        <div className="px-4 py-2 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px]">
          <button
            type="button"
            onClick={() => handleQuickIcebreaker('Hey! Love your work, let’s collaborate!')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition cursor-pointer"
          >
            👋 Collab inquiry
          </button>
          <button
            type="button"
            onClick={() => handleQuickIcebreaker('Would love to feature you on our next podcast episode!')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition cursor-pointer"
          >
            🎙️ Podcast invite
          </button>
          <button
            type="button"
            onClick={() => handleQuickIcebreaker('What equipment and camera settings do you use?')}
            className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 border border-white/10 transition cursor-pointer"
          >
            🎥 Production tips
          </button>
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className={`flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-full border transition-all focus:outline-hidden min-h-[38px] ${
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-[#FF2E93]'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#FF2E93]'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="gradient-btn-primary px-3.5 py-2 rounded-full text-xs font-bold text-white flex items-center gap-1 shadow-md cursor-pointer disabled:opacity-40 min-h-[38px]"
          >
            <Send size={13} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
