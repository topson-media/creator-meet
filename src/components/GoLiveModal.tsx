import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Send,
  Heart,
  Flame,
  Sparkles,
  Share2,
  Settings,
} from 'lucide-react';
import { UserProfile } from '../types';

interface GoLiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  isDarkMode: boolean;
}

interface LiveChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  isHost?: boolean;
}

export const GoLiveModal: React.FC<GoLiveModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  isDarkMode,
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTitle, setStreamTitle] = useState('Live Creator Jam & Q&A with Followers');
  const [viewerCount, setViewerCount] = useState(1340);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);

  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    {
      id: '1',
      sender: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
      text: 'Hey everyone! Excited for today’s stream!',
    },
    {
      id: '2',
      sender: 'Marcus V.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      text: 'Loving the audio setup! What mic are you using? 🔥',
    },
    {
      id: '3',
      sender: 'Klara Bloom',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      text: 'Sent 100 sparks! Keep creating awesome content! ❤️',
    },
  ]);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Auto-viewer fluctuations
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + Math.floor(Math.random() * 9) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Attempt real camera access if allowed
  useEffect(() => {
    if (isOpen && isStreaming && isVideoOn) {
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            mediaStreamRef.current = stream;
            if (videoElementRef.current) {
              videoElementRef.current.srcObject = stream;
              videoElementRef.current.play().catch(() => {});
            }
          })
          .catch((err) => {
            console.log('Camera preview permission note (fallback simulated canvas):', err);
          });
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [isOpen, isStreaming, isVideoOn]);

  if (!isOpen) return null;

  const handleStartLive = () => {
    setIsStreaming(true);
  };

  const handleEndLive = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsStreaming(false);
    onClose();
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `chat-${Date.now()}`,
      sender: userProfile?.fullName || 'Host',
      avatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      text: chatInput.trim(),
      isHost: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
  };

  const triggerReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    setReactions((prev) => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isStreaming) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-4xl h-[92vh] max-h-[750px] rounded-3xl overflow-hidden border flex flex-col md:flex-row shadow-2xl ${
          isDarkMode ? 'bg-[#060919] border-white/10 text-white' : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Main Video Stage (Left 65%) */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          {/* Live Video Element or Simulated Backdrop */}
          {isVideoOn ? (
            <video
              ref={videoElementRef}
              muted
              playsInline
              className="w-full h-full object-cover"
              poster="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <VideoOff size={32} />
              </div>
              <p className="text-sm font-semibold">Camera is currently muted</p>
            </div>
          )}

          {/* Floating Reactions overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {reactions.map((r) => (
              <div
                key={r.id}
                style={{ left: `${r.x}%` }}
                className="absolute bottom-16 text-3xl animate-float-up pointer-events-none select-none"
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* Top Bar: LIVE Status, Viewer Counter, Stream Title */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg ${
                  isStreaming ? 'bg-red-600 text-white animate-pulse' : 'bg-amber-500 text-black'
                }`}
              >
                <Radio size={14} />
                <span>{isStreaming ? 'LIVE' : 'PREVIEW'}</span>
              </div>

              {isStreaming && (
                <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white flex items-center gap-1.5 border border-white/15">
                  <Users size={13} className="text-[#00D2FF]" />
                  <span>{viewerCount.toLocaleString()} watching</span>
                </div>
              )}
            </div>

            {/* Close / End */}
            <button
              onClick={isStreaming ? handleEndLive : onClose}
              className="p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition cursor-pointer border border-white/10"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Bottom Video Controls Overlay */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              {/* Mic toggle */}
              <button
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-2.5 rounded-full backdrop-blur-md transition cursor-pointer border ${
                  isMicOn
                    ? 'bg-black/60 hover:bg-black/80 text-white border-white/15'
                    : 'bg-red-600 text-white border-red-500'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              {/* Cam toggle */}
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-2.5 rounded-full backdrop-blur-md transition cursor-pointer border ${
                  isVideoOn
                    ? 'bg-black/60 hover:bg-black/80 text-white border-white/15'
                    : 'bg-red-600 text-white border-red-500'
                }`}
                title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>
            </div>

            {/* Go Live / End Stream Action */}
            {!isStreaming ? (
              <button
                onClick={handleStartLive}
                className="gradient-btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold text-white rounded-full flex items-center gap-2 shadow-lg shadow-[#FF1E82]/40 hover:scale-105 transition cursor-pointer"
              >
                <Radio size={16} />
                <span>Go Live Now</span>
              </button>
            ) : (
              <button
                onClick={handleEndLive}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <span>End Broadcast</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Stream Sidebar: Live Chat & Reactions (35%) */}
        <div className="w-full md:w-80 shrink-0 bg-[#080D26] border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-72 md:h-full">
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
            <div className="min-w-0">
              <h4 className="text-xs font-bold truncate">Live Stream Chat</h4>
              <p className="text-[10px] text-slate-400">Meeting with followers directly</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => triggerReaction('❤️')}
                className="p-1 hover:scale-125 transition cursor-pointer"
                title="Send Heart"
              >
                ❤️
              </button>
              <button
                onClick={() => triggerReaction('🔥')}
                className="p-1 hover:scale-125 transition cursor-pointer"
                title="Send Fire"
              >
                🔥
              </button>
              <button
                onClick={() => triggerReaction('✨')}
                className="p-1 hover:scale-125 transition cursor-pointer"
                title="Send Sparkles"
              >
                ✨
              </button>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="text-xs flex items-start gap-2">
                <img src={msg.avatar} alt={msg.sender} className="w-6 h-6 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <span
                    className={`font-bold mr-1.5 ${
                      msg.isHost ? 'text-[#FF2E93]' : 'text-slate-300'
                    }`}
                  >
                    {msg.sender}
                    {msg.isHost && (
                      <span className="ml-1 px-1 py-0.2 rounded-sm bg-[#FF2E93]/20 text-[9px] uppercase font-black text-[#FF2E93]">
                        Host
                      </span>
                    )}
                    :
                  </span>
                  <span className="text-slate-200">{msg.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Composer */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Say something live..."
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:outline-hidden focus:border-[#00D2FF]"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2 rounded-xl gradient-btn-primary text-white disabled:opacity-40 transition cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
