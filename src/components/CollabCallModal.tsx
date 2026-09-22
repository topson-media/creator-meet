import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  UserPlus,
  Send,
  Heart,
  Flame,
  Sparkles,
  Share2,
  PhoneOff,
  Check,
  Crown,
  Volume2,
  Radio,
  Eye,
  Smile,
  Plus,
  Minus,
  Clock,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '../types';
import { AccountBadge } from './AccountBadge';

interface CollabCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  isDarkMode: boolean;
}

interface Participant {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: 'creator' | 'fan';
  isHost?: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  videoUrl?: string;
  isSpeaking?: boolean;
}

export interface JoinRequest {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  requestedAt: string;
}

interface LiveViewer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  isFollower: boolean;
  joinedAt: string;
}

interface LiveComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

const SAMPLE_GUEST_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
];

const INITIAL_REQUESTS: JoinRequest[] = [
  {
    id: 'req-1',
    name: 'Marcus Vance',
    handle: '@marcusbeats',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    requestedAt: 'Just now',
  },
  {
    id: 'req-2',
    name: 'Klara Bloom',
    handle: '@klaraphotos',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    requestedAt: '1m ago',
  },
];

const INITIAL_VIEWERS: LiveViewer[] = [
  {
    id: 'v-1',
    name: 'Devon Miles',
    handle: '@devon_3d',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    isFollower: false,
    joinedAt: '5m ago',
  },
  {
    id: 'v-2',
    name: 'Sarah Jenkins',
    handle: '@sarah_film',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    isFollower: true,
    joinedAt: '1m ago',
  },
  {
    id: 'v-3',
    name: 'Lucas Sterling',
    handle: '@lucas_fx',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    isFollower: true,
    joinedAt: '4m ago',
  },
  {
    id: 'v-4',
    name: 'Amara Chen',
    handle: '@amarachen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isFollower: true,
    joinedAt: 'Just now',
  },
];

export const CollabCallModal: React.FC<CollabCallModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  isDarkMode,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<'viewers' | 'chat'>('viewers');
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [viewerCount, setViewerCount] = useState(1482);
  const [viewers, setViewers] = useState<LiveViewer[]>(INITIAL_VIEWERS);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(INITIAL_REQUESTS);
  const [streamDuration, setStreamDuration] = useState(145);
  const [chatMessage, setChatMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string; left: number }[]>([]);
  const [cameraStatus, setCameraStatus] = useState<'requesting' | 'active' | 'fallback'>('requesting');

  // Face-to-face participants list
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: 'host',
      name: userProfile?.fullName || 'Host Creator',
      handle: `@${userProfile?.username || 'you'}`,
      avatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: userProfile?.role || 'creator',
      isHost: true,
      isMuted: false,
      isVideoOff: false,
      isSpeaking: true,
    },
    {
      id: 'guest-1',
      name: 'Elena Rostova',
      handle: '@elenavfx',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'creator',
      isHost: false,
      isMuted: false,
      isVideoOff: false,
      videoUrl: SAMPLE_GUEST_VIDEOS[0],
      isSpeaking: false,
    },
  ]);

  // Live Comments
  const [comments, setComments] = useState<LiveComment[]>([
    {
      id: 'c-1',
      author: 'Klara Bloom',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      text: 'Great to see you both live! What camera lens are you using?',
      time: 'Just now',
    },
    {
      id: 'c-2',
      author: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      text: 'Audio clarity is crisp! Bring Devon onto the stage too!',
      time: '1m ago',
    },
  ]);

  const hostVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Fluctuating viewers count simulation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setViewerCount((prev) => Math.max(1200, prev + Math.floor(Math.random() * 11) - 5));
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Attempt real camera stream for host when live starts
  useEffect(() => {
    let isCancelled = false;

    if (isOpen && !isVideoOff) {
      if (navigator.mediaDevices?.getUserMedia) {
        setCameraStatus('requesting');
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            if (isCancelled) {
              stream.getTracks().forEach((track) => track.stop());
              return;
            }
            localStreamRef.current = stream;
            setCameraStatus('active');
            if (hostVideoRef.current) {
              hostVideoRef.current.srcObject = stream;
              hostVideoRef.current.play().catch(() => {});
            }
          })
          .catch((err) => {
            console.log('Webcam not permitted or unavailable, providing live creator video stream:', err);
            setCameraStatus('fallback');
          });
      } else {
        setCameraStatus('fallback');
      }
    }

    return () => {
      isCancelled = true;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [isOpen, isVideoOff]);

  // Live stream duration timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setStreamDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  // Accept viewer's request to join panel (+)
  const handleAcceptJoinRequest = (req: JoinRequest) => {
    if (participants.some((p) => p.id === req.id)) {
      setJoinRequests((prev) => prev.filter((r) => r.id !== req.id));
      return;
    }

    const newParticipant: Participant = {
      id: req.id,
      name: req.name,
      handle: req.handle,
      avatar: req.avatar,
      role: 'fan',
      isHost: false,
      isMuted: false,
      isVideoOff: false,
      videoUrl: SAMPLE_GUEST_VIDEOS[participants.length % SAMPLE_GUEST_VIDEOS.length],
      isSpeaking: false,
    };

    setParticipants((prev) => [...prev, newParticipant]);
    setJoinRequests((prev) => prev.filter((r) => r.id !== req.id));
    setViewers((prev) => prev.filter((v) => v.id !== req.id));

    // Announce in live chat
    const alertComment: LiveComment = {
      id: `c-accept-${Date.now()}`,
      author: 'Live Host',
      avatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: `🎉 Accepted ${req.name} to join the live panel (+)`,
      time: 'Just now',
    };
    setComments((prev) => [...prev, alertComment]);
  };

  // Reject viewer's request to join panel (-)
  const handleRejectJoinRequest = (reqId: string) => {
    const req = joinRequests.find((r) => r.id === reqId);
    setJoinRequests((prev) => prev.filter((r) => r.id !== reqId));
    if (req) {
      const alertComment: LiveComment = {
        id: `c-reject-${Date.now()}`,
        author: 'Live Host',
        avatar:
          userProfile?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        text: `Declined request from ${req.name} (-)`,
        time: 'Just now',
      };
      setComments((prev) => [...prev, alertComment]);
    }
  };

  // Simulate another viewer requesting to join panel
  const handleSimulateNewRequest = () => {
    const candidateViewer = viewers.find(
      (v) => !joinRequests.some((r) => r.id === v.id) && !participants.some((p) => p.id === v.id)
    );
    if (!candidateViewer) return;

    const newReq: JoinRequest = {
      id: candidateViewer.id,
      name: candidateViewer.name,
      handle: candidateViewer.handle,
      avatar: candidateViewer.avatar,
      requestedAt: 'Just now',
    };
    setJoinRequests((prev) => [newReq, ...prev]);
  };

  // Directly invite viewer to talk face-to-face on stage (+)
  const handleInviteToStage = (viewer: LiveViewer) => {
    if (participants.some((p) => p.id === viewer.id)) return;

    const newParticipant: Participant = {
      id: viewer.id,
      name: viewer.name,
      handle: viewer.handle,
      avatar: viewer.avatar,
      role: 'fan',
      isHost: false,
      isMuted: false,
      isVideoOff: false,
      videoUrl: SAMPLE_GUEST_VIDEOS[participants.length % SAMPLE_GUEST_VIDEOS.length],
      isSpeaking: false,
    };

    setParticipants((prev) => [...prev, newParticipant]);
    setViewers((prev) => prev.filter((v) => v.id !== viewer.id));
    setJoinRequests((prev) => prev.filter((r) => r.id !== viewer.id));

    // Announce in chat
    const alertComment: LiveComment = {
      id: `c-stage-${Date.now()}`,
      author: 'Live Host',
      avatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: `🎉 ${viewer.name} added to the live panel (+)`,
      time: 'Just now',
    };
    setComments((prev) => [...prev, alertComment]);
  };

  // Remove participant from face-to-face panel (-)
  const handleRemoveFromStage = (id: string) => {
    const p = participants.find((item) => item.id === id);
    if (!p || p.isHost) return;

    setParticipants((prev) => prev.filter((item) => item.id !== id));
    setViewers((prev) => [
      {
        id: p.id,
        name: p.name,
        handle: p.handle,
        avatar: p.avatar,
        isFollower: true,
        joinedAt: 'Just now',
      },
      ...prev,
    ]);

    const alertComment: LiveComment = {
      id: `c-remove-${Date.now()}`,
      author: 'Live Host',
      avatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: `Removed ${p.name} from live panel (-)`,
      time: 'Just now',
    };
    setComments((prev) => [...prev, alertComment]);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newC: LiveComment = {
      id: `c-${Date.now()}`,
      author: userProfile?.fullName || 'Host',
      avatar:
        userProfile?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: chatMessage.trim(),
      time: 'Just now',
    };

    setComments((prev) => [...prev, newC]);
    setChatMessage('');
  };

  const handleSendReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 60) + 20;
    setReactions((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2500);
  };

  const handleCopyCallLink = () => {
    navigator.clipboard?.writeText(
      `${window.location.origin}/#collab-call?room=${userProfile?.username || 'live'}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleEndCall();
      }}
    >
      <div
        className={`relative w-full max-w-6xl h-[92vh] max-h-[850px] rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
          isDarkMode
            ? 'bg-[#060919] border-white/15 text-white'
            : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* Floating live reactions */}
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {reactions.map((r) => (
            <div
              key={r.id}
              style={{ left: `${r.left}%` }}
              className="absolute bottom-20 text-3xl sm:text-4xl animate-bounce transition duration-1000 select-none opacity-90"
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Top Room Header */}
        <div className="px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between gap-3 bg-black/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Pulsing Live Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-600/30 animate-pulse tracking-wide">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>GO LIVE 🔴</span>
            </div>

            {/* Live stream duration timer */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono font-semibold border border-white/10 text-slate-200">
              <Clock size={12} className="text-rose-400" />
              <span>{formatDuration(streamDuration)}</span>
            </div>

            {/* Live Viewers counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold border border-white/10 text-cyan-300">
              <Eye size={13} className="text-[#00D2FF]" />
              <span>{viewerCount.toLocaleString()} watching live</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCallLink}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/10"
              title="Share Live Link"
            >
              {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share Live'}</span>
            </button>

            <button
              onClick={() => setShowSidePanel(!showSidePanel)}
              className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
                showSidePanel
                  ? 'bg-[#00D2FF] text-black border-[#00D2FF]'
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
              title="Toggle Viewers & Requests Panel"
            >
              <Users size={13} />
              <span className="hidden sm:inline">
                Viewers ({viewers.length})
                {joinRequests.length > 0 && ` • ${joinRequests.length} Req`}
              </span>
              {joinRequests.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse absolute -top-1 -right-1 ring-2 ring-black" />
              )}
            </button>

            <button
              onClick={handleEndCall}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              title="Close Live"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Stage & Side Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* FACE-TO-FACE VIDEO GRID */}
          <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between overflow-y-auto">
            <div
              className={`grid gap-3 sm:gap-4 h-full min-h-[360px] ${
                participants.length === 1
                  ? 'grid-cols-1'
                  : participants.length === 2
                  ? 'grid-cols-1 sm:grid-cols-2'
                  : 'grid-cols-2'
              }`}
            >
              {participants.map((p) => {
                const isHost = p.id === 'host';
                return (
                  <div
                    key={p.id}
                    className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-800/90 border border-white/10 shadow-xl flex items-center justify-center group"
                  >
                    {/* Video Stream or Avatar fallback */}
                    {isHost ? (
                      isVideoOff ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-purple-500/50"
                          />
                          <p className="text-xs text-slate-400">Camera is turned off</p>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <video
                            ref={hostVideoRef}
                            src={
                              cameraStatus === 'fallback'
                                ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
                                : undefined
                            }
                            autoPlay
                            loop={cameraStatus === 'fallback'}
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                          />
                          {/* Live Video Indicator for viewers */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-sm text-[10px] font-bold text-white border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            <span>
                              {cameraStatus === 'active'
                                ? 'Webcam Live • Broadcast to All Viewers'
                                : 'Live Camera Broadcast • Visible to Viewers'}
                            </span>
                          </div>
                        </div>
                      )
                    ) : p.videoUrl ? (
                      <video
                        src={p.videoUrl}
                        autoPlay
                        loop
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#00D2FF]/50"
                        />
                        <p className="text-xs text-slate-400">Talking face-to-face</p>
                      </div>
                    )}

                    {/* Speaking indicator border */}
                    {p.isSpeaking && (
                      <div className="absolute inset-0 border-2 border-[#00D2FF] rounded-2xl sm:rounded-3xl pointer-events-none animate-pulse" />
                    )}

                    {/* Participant Tag & Role */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/65 backdrop-blur-md border border-white/15 text-xs font-bold shadow-md">
                      <span>{p.name}</span>
                      {p.isHost ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-black text-[9px] font-black uppercase">
                          Host
                        </span>
                      ) : (
                        <AccountBadge role={p.role} size="sm" />
                      )}
                    </div>

                    {/* Mic / Video status icons */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {p.isMuted || (isHost && isMuted) ? (
                        <div className="p-1.5 rounded-xl bg-rose-600/90 text-white shadow-md">
                          <MicOff size={13} />
                        </div>
                      ) : (
                        <div className="p-1.5 rounded-xl bg-emerald-500/90 text-white shadow-md flex items-center gap-1 text-[10px]">
                          <Volume2 size={13} />
                        </div>
                      )}

                      {!isHost && (
                        <button
                          onClick={() => handleRemoveFromStage(p.id)}
                          className="p-1 px-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-bold transition cursor-pointer text-xs flex items-center gap-1 shadow-md"
                          title="Remove from live panel (-)"
                        >
                          <Minus size={13} className="stroke-[3]" />
                          <span className="text-[10px]">Remove (-)</span>
                        </button>
                      )}
                    </div>

                    {/* Face to face label overlay */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-white/80 bg-black/50 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                      <Radio size={12} className="text-[#FF2E93] animate-pulse" />
                      <span>Live Panel</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* In-Call Controls Bar */}
            <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-2xl bg-black/60 backdrop-blur-lg border border-white/10 flex items-center justify-between gap-3 shrink-0">
              {/* Left Mic / Cam Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-2xl transition cursor-pointer shadow-md ${
                    isMuted
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                  title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-2xl transition cursor-pointer shadow-md ${
                    isVideoOff
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`}
                  title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
                </button>
              </div>

              {/* Middle Reactions Sender */}
              <div className="flex items-center gap-1.5">
                {['❤️', '🔥', '👏', '✨', '🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSendReaction(emoji)}
                    className="p-2 sm:p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 hover:scale-125 active:scale-95 transition cursor-pointer text-base sm:text-lg"
                    title={`Send ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Right End Live */}
              <div>
                <button
                  onClick={handleEndCall}
                  className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition cursor-pointer"
                >
                  <PhoneOff size={16} />
                  <span>End Live</span>
                </button>
              </div>
            </div>
          </div>

          {/* SIDEBAR: VIEWERS WATCHING LIVE & REAL-TIME CHAT */}
          {showSidePanel && (
            <div className="w-80 sm:w-88 border-l border-white/10 bg-black/50 backdrop-blur-md flex flex-col shrink-0 animate-fade-in">
              {/* Tab Switcher */}
              <div className="p-3 border-b border-white/10 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('viewers')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'viewers'
                      ? 'bg-[#00D2FF] text-black shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users size={13} />
                  <span>
                    Viewers ({viewers.length})
                    {joinRequests.length > 0 && ` • ${joinRequests.length} Req`}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-[#FF2E93] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Live Chat</span>
                </button>
              </div>

              {/* TAB 1: VIEWERS & PANEL JOIN REQUESTS */}
              {activeTab === 'viewers' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden p-3">
                  <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                    {/* SECTION A: PEOPLE WHO REQUEST TO JOIN ON PANEL (+ / -) */}
                    <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-900/30 via-slate-900/60 to-rose-950/30 border border-purple-500/30 shadow-md">
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <Radio size={13} className="text-rose-400 animate-pulse" />
                          <span>Panel Join Requests</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-rose-500 text-white">
                            {joinRequests.length}
                          </span>
                        </div>

                        <button
                          onClick={handleSimulateNewRequest}
                          className="text-[10px] text-cyan-300 hover:text-white px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer flex items-center gap-1"
                          title="Simulate another viewer requesting to join panel"
                        >
                          <UserPlus size={10} />
                          <span>+ Request</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-300 mb-2">
                        Accept on panel with <span className="font-extrabold text-emerald-400 font-mono">[+]</span> or decline with <span className="font-extrabold text-rose-400 font-mono">[-]</span>.
                      </p>

                      {joinRequests.length === 0 ? (
                        <div className="text-center py-3 text-[11px] text-slate-400 italic">
                          No pending join requests right now.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {joinRequests.map((req) => (
                            <div
                              key={req.id}
                              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={req.avatar}
                                  alt={req.name}
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#FF2E93] shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold truncate leading-tight text-white">
                                    {req.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {req.handle} • {req.requestedAt}
                                  </p>
                                </div>
                              </div>

                              {/* Accept (+) and Reject (-) controls */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleAcceptJoinRequest(req)}
                                  id={`accept-request-${req.id}`}
                                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-md shadow-emerald-500/30 transition hover:scale-110 active:scale-95 cursor-pointer"
                                  title="Accept to panel (+)"
                                >
                                  <Plus size={16} className="stroke-[3]" />
                                </button>
                                <button
                                  onClick={() => handleRejectJoinRequest(req.id)}
                                  id={`reject-request-${req.id}`}
                                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md shadow-rose-600/30 transition hover:scale-110 active:scale-95 cursor-pointer"
                                  title="Reject request (-)"
                                >
                                  <Minus size={16} className="stroke-[3]" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SECTION B: VIEWERS WATCHING LIVE */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2 px-1">
                        <span className="flex items-center gap-1.5">
                          <Eye size={12} className="text-[#00D2FF]" />
                          <span>Audience Watching Live ({viewers.length})</span>
                        </span>
                        <span className="text-[10px] text-slate-400">All Viewers</span>
                      </div>

                      <div className="space-y-1.5">
                        {viewers.map((viewer) => (
                          <div
                            key={viewer.id}
                            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={viewer.avatar}
                                alt={viewer.name}
                                referrerPolicy="no-referrer"
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00D2FF]/30 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-bold truncate leading-tight text-white">
                                  {viewer.name}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate">
                                  {viewer.handle} • {viewer.isFollower ? 'Follower' : 'Viewer'}
                                </p>
                              </div>
                            </div>

                            {/* Directly Invite to Panel (+) */}
                            <button
                              onClick={() => handleInviteToStage(viewer)}
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-white text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 shrink-0 transition hover:scale-105 cursor-pointer"
                              title="Add to live panel (+)"
                            >
                              <Plus size={12} className="stroke-[3]" />
                              <span>Panel</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-[11px] text-slate-400 border-t border-white/10">
                    {viewerCount.toLocaleString()} total live viewers
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE CHAT */}
              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden p-3">
                  <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                    {comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2 text-xs">
                        <img
                          src={c.avatar}
                          alt={c.author}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <div className="flex-1 bg-white/5 p-2 rounded-xl border border-white/5">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-[11px] text-[#00D2FF]">
                              {c.author}
                            </span>
                            <span className="text-[9px] text-slate-400">{c.time}</span>
                          </div>
                          <p className="text-slate-200 text-xs">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input Form */}
                  <form onSubmit={handleSendComment} className="pt-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Comment as host..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-hidden focus:border-[#FF2E93]"
                    />
                    <button
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="p-2 rounded-xl gradient-btn-primary text-white disabled:opacity-40 transition cursor-pointer"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
