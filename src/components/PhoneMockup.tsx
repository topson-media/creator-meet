import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Play,
  CheckCircle2,
  Crown,
  MapPin,
  Sparkles,
  Users,
  Plus,
  Send,
  ExternalLink,
  Bell,
  Home as HomeIcon,
  Compass,
  MessageSquare,
  User,
  Youtube,
  Facebook,
  Instagram,
} from 'lucide-react';

interface PhoneMockupProps {
  isDark?: boolean;
  onOpenCollabModal?: () => void;
  onOpenCreatorProfile?: (handle: string) => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  isDark = true,
  onOpenCollabModal,
  onOpenCreatorProfile,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(1204);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikesCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <div className="relative w-full max-w-[620px] mx-auto min-h-[580px] sm:min-h-[660px] flex items-center justify-center select-none py-8">
      {/* Background Ambient Glows and Cosmic Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] h-[340px] sm:h-[480px] bg-gradient-to-tr from-[#FF1493]/20 via-[#7928CA]/25 to-[#00D2FF]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-4 w-40 h-40 bg-[#FF2E93]/20 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-6 w-44 h-44 bg-[#0080FF]/20 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Decorative Radiance lines at top right of phone (as seen in the mockup) */}
      <div className="absolute top-3 sm:top-6 right-16 sm:right-28 pointer-events-none flex gap-1 items-end -z-5">
        <span className="w-1.5 h-6 bg-gradient-to-t from-transparent to-[#FF7A00] rounded-full rotate-[-30deg]" />
        <span className="w-1.5 h-8 bg-gradient-to-t from-transparent to-[#FF1E82] rounded-full rotate-[-15deg] mb-1" />
        <span className="w-1.5 h-5 bg-gradient-to-t from-transparent to-[#00D2FF] rounded-full rotate-[15deg]" />
      </div>

      {/* ========================================================================= */}
      {/* FLOATING CARD 1: TOP-LEFT CREATOR PROFILE CARD (Topson Media) */}
      {/* ========================================================================= */}
      <div
        id="hero-floating-creator-card"
        className="hidden lg:block absolute -left-8 top-12 z-20 w-[240px] p-4 rounded-2xl bg-[#090F2C]/90 backdrop-blur-md border border-white/15 shadow-2xl shadow-indigo-950/60 transition-transform duration-300 hover:-translate-y-1.5"
      >
        <div className="flex items-start justify-between">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Topson Media"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#00D2FF]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#090F2C] rounded-full" />
          </div>
          <button
            onClick={() => onOpenCreatorProfile?.('@topsonmedia')}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
            title="View full profile"
          >
            <ExternalLink size={14} />
          </button>
        </div>

        <div className="mt-2.5">
          <div className="flex items-center gap-1.5">
            <h4 className="text-white text-sm font-bold">Topson Media</h4>
            <CheckCircle2 size={13} className="text-[#00D2FF] fill-[#00D2FF]/20" />
          </div>
          <p className="text-slate-400 text-xs">@topsonmedia</p>
        </div>

        {/* Content Creator Badge */}
        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
          <Crown size={11} className="text-amber-400" />
          <span>Content Creator</span>
        </div>

        {/* Location & Tags */}
        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-300">
          <span>🇷🇼</span>
          <span>Rwanda</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">Technology • Education</p>
        <p className="text-xs font-bold text-white mt-1.5">
          15.4K <span className="font-normal text-slate-400">Followers</span>
        </p>

        {/* Follow Button */}
        <button
          id="hero-follow-topson-btn"
          onClick={() => setIsFollowing(!isFollowing)}
          className={`w-full mt-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
            isFollowing
              ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              : 'bg-[#0080FF] hover:bg-[#0070e0] text-white shadow-md shadow-blue-500/30'
          }`}
        >
          {isFollowing ? '✓ Following' : 'Follow'}
        </button>

        {/* Social Icons Row */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-around text-slate-300">
          <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center hover:scale-110 transition cursor-pointer">
            <Youtube size={13} />
          </span>
          <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center hover:scale-110 transition cursor-pointer">
            <Facebook size={13} />
          </span>
          <span className="w-6 h-6 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center hover:scale-110 transition cursor-pointer">
            <Instagram size={13} />
          </span>
          <span className="w-6 h-6 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold hover:scale-110 transition cursor-pointer">
            Tk
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING CARD 2: BOTTOM-LEFT NOTIFICATION (Sarah New Follower) */}
      {/* ========================================================================= */}
      <div
        id="hero-floating-follower-notif"
        className="hidden sm:flex absolute -left-4 sm:-left-6 bottom-10 z-25 items-center gap-3 px-3.5 py-2.5 rounded-full bg-[#0A1133]/90 backdrop-blur-md border border-white/15 shadow-xl shadow-indigo-950/50 transition-transform duration-300 hover:scale-102"
      >
        <img
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
          alt="Sarah"
          className="w-8 h-8 rounded-full object-cover border border-[#FF2E93]"
        />
        <div className="text-left pr-2">
          <p className="text-white text-xs font-semibold">New follower</p>
          <p className="text-slate-400 text-[11px]">Sarah started following you</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#FF2E93] animate-pulse" />
      </div>

      {/* ========================================================================= */}
      {/* CENTRAL MOBILE PHONE MOCKUP */}
      {/* ========================================================================= */}
      <div
        id="hero-phone-device"
        className="relative z-10 w-[290px] sm:w-[320px] rounded-[44px] p-3.5 bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617] border-[3px] border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]"
      >
        {/* Phone Glass Inner Screen */}
        <div className="relative rounded-[36px] overflow-hidden bg-[#070B19] border border-white/10 text-white min-h-[570px] flex flex-col justify-between">
          {/* Top Notch / Dynamic Island area */}
          <div className="pt-2 px-6 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-xs text-white">9:41</span>
            <div className="w-16 h-3.5 bg-black/60 rounded-full border border-white/10 mx-auto" />
            <div className="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <div className="w-3.5 h-2 border border-white/60 rounded-xs flex items-center p-0.5">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* App Header inside Phone */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
            <Logo isDark={true} size="sm" showText={true} />
            <button
              onClick={() => onOpenCollabModal?.()}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white"
            >
              <Bell size={13} />
            </button>
          </div>

          {/* Stories Carousel inside Phone */}
          <div className="px-3 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar">
            {/* User Story */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="relative w-11 h-11 rounded-full p-0.5 border border-dashed border-slate-500">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                  alt="You"
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#FF2E93] flex items-center justify-center text-white text-[9px] font-bold">
                  +
                </span>
              </div>
              <span className="text-[10px] text-slate-300">Your story</span>
            </div>

            {/* Creator Story 1 */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#FF2E93] via-[#7928CA] to-[#00D2FF]">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="TechPro"
                  className="w-full h-full rounded-full object-cover border border-[#070B19]"
                />
              </div>
              <span className="text-[10px] text-slate-300">TechPro</span>
            </div>

            {/* Creator Story 2 */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#00D2FF] to-[#0055D4]">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Maya"
                  className="w-full h-full rounded-full object-cover border border-[#070B19]"
                />
              </div>
              <span className="text-[10px] text-slate-300">Maya</span>
            </div>

            {/* Creator Story 3 */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#FF2E93] to-amber-400">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                  alt="Jonas"
                  className="w-full h-full rounded-full object-cover border border-[#070B19]"
                />
              </div>
              <span className="text-[10px] text-slate-300">Jonas</span>
            </div>

            {/* Creator Story 4 */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#7928CA] to-[#FF2E93]">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                  alt="Liza"
                  className="w-full h-full rounded-full object-cover border border-[#070B19]"
                />
              </div>
              <span className="text-[10px] text-slate-300">Liza</span>
            </div>
          </div>

          {/* Feed Post: Topson Media */}
          <div className="px-3 py-2 flex-1">
            {/* Post Author Bar */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Topson Media"
                  className="w-8 h-8 rounded-full object-cover border border-[#00D2FF]"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">Topson Media</span>
                    <CheckCircle2 size={11} className="text-[#00D2FF]" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="text-[#00D2FF] font-medium">Content Creator</span>
                    <span>• 2h ago</span>
                  </div>
                </div>
              </div>
              <span className="text-slate-500 hover:text-white cursor-pointer text-xs">•••</span>
            </div>

            {/* Post Caption */}
            <p className="text-xs text-slate-200 leading-relaxed mb-2 font-normal">
              New video tutorial on how to use VPN on your phone! 🚀
            </p>

            {/* Video Preview Card */}
            <div
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900 group cursor-pointer border border-white/10 shadow-inner"
            >
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
                alt="VPN Tutorial Preview"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Glowing Play Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-between p-3">
                <span className="self-end px-2 py-0.5 rounded-sm bg-black/60 text-[10px] font-medium text-white backdrop-blur-xs">
                  04:18
                </span>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#FF2E93] text-white flex items-center justify-center shadow-lg shadow-[#FF2E93]/50 group-hover:scale-110 transition">
                    <Play size={16} fill="white" className="ml-0.5" />
                  </div>
                  <div>
                    <span className="inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-xs bg-emerald-500/90 text-black">
                      VPN Easy Setup
                    </span>
                    <p className="text-[11px] font-semibold text-white">Full Walkthrough • 4K</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Post Actions Bar */}
            <div className="flex items-center justify-between mt-2.5 px-1">
              <div className="flex items-center gap-4 text-xs text-slate-300">
                {/* Heart Button */}
                <button
                  id="phone-like-btn"
                  onClick={handleLikeToggle}
                  className="flex items-center gap-1 cursor-pointer transition hover:text-[#FF2E93]"
                >
                  <Heart
                    size={16}
                    className={isLiked ? 'text-[#FF2E93] fill-[#FF2E93]' : 'text-slate-300'}
                  />
                  <span className={isLiked ? 'text-[#FF2E93] font-semibold' : ''}>
                    {(likesCount / 1000).toFixed(1)}K
                  </span>
                </button>

                {/* Comment Button */}
                <button className="flex items-center gap-1 cursor-pointer hover:text-white">
                  <MessageCircle size={16} />
                  <span>245</span>
                </button>

                {/* Share Button */}
                <button className="cursor-pointer hover:text-white">
                  <Share2 size={16} />
                </button>
              </div>

              {/* Bookmark */}
              <button className="cursor-pointer hover:text-white text-slate-400">
                <Bookmark size={16} />
              </button>
            </div>
          </div>

          {/* Bottom App Navigation inside Phone */}
          <div className="px-4 py-2.5 bg-[#050814] border-t border-white/10 flex items-center justify-around text-slate-400">
            <button className="text-[#FF2E93] flex flex-col items-center">
              <HomeIcon size={16} />
              <span className="text-[9px] mt-0.5 font-bold">Home</span>
            </button>
            <button className="hover:text-white flex flex-col items-center">
              <Users size={16} />
              <span className="text-[9px] mt-0.5">Creators</span>
            </button>
            <button className="w-8 h-8 rounded-full bg-[#FF2E93] text-white flex items-center justify-center -mt-3 shadow-md shadow-[#FF2E93]/50">
              <Plus size={18} />
            </button>
            <button className="hover:text-white flex flex-col items-center">
              <MessageSquare size={16} />
              <span className="text-[9px] mt-0.5">Chat</span>
            </button>
            <button className="hover:text-white flex flex-col items-center">
              <User size={16} />
              <span className="text-[9px] mt-0.5">Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING CARD 3: TOP-RIGHT COLLABORATION REQUEST CARD */}
      {/* ========================================================================= */}
      <div
        id="hero-floating-collab-card"
        className="hidden md:block absolute -right-6 lg:-right-10 top-10 z-20 w-[230px] p-3.5 rounded-2xl bg-[#0B1130]/90 backdrop-blur-md border border-white/15 shadow-2xl shadow-purple-950/50 transition-transform duration-300 hover:-translate-y-1.5"
      >
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7928CA] to-[#00D2FF] p-0.5 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
              alt="TechPro"
              className="w-full h-full rounded-[10px] object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Collaboration Request</p>
            <p className="text-slate-300 text-[11px] leading-tight line-clamp-2 mt-0.5">
              Am looking for a video editor.
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[10px] text-emerald-400 font-medium">Budget: $300</span>
          <button
            id="hero-view-collab-btn"
            onClick={onOpenCollabModal}
            className="px-4 py-1 text-[11px] font-semibold text-white rounded-full bg-[#7928CA] hover:bg-[#6822af] transition cursor-pointer shadow-xs shadow-purple-500/30"
          >
            View
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING CARD 4: MID-RIGHT CHAT MESSAGE (John) */}
      {/* ========================================================================= */}
      <div
        id="hero-floating-chat-card"
        className="hidden lg:block absolute -right-8 top-56 z-20 w-[240px] p-3 rounded-2xl bg-[#090E28]/90 backdrop-blur-md border border-white/15 shadow-xl shadow-indigo-950/60 transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="flex items-start gap-2.5">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
              alt="John"
              className="w-8 h-8 rounded-full object-cover border border-indigo-400"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-white text-xs font-bold">John</span>
              <span className="text-[10px] text-slate-400">11m</span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5 leading-snug">
              Hey! Nice content! Let's work together sometime.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING CARD 5: BOTTOM-RIGHT SOCIAL PLATFORMS CROSS-POST HUB */}
      {/* ========================================================================= */}
      <div
        id="hero-floating-social-hub"
        className="hidden sm:block absolute -right-4 sm:-right-8 bottom-6 z-20 w-[240px] p-3.5 rounded-2xl bg-[#0A1236]/90 backdrop-blur-md border border-white/15 shadow-2xl shadow-indigo-950/70 transition-transform duration-300 hover:-translate-y-1"
      >
        {/* Social Icons row matching mockup */}
        <div className="flex items-center justify-between px-2 mb-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400">
            <Youtube size={15} />
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600/40 border border-pink-500/40 flex items-center justify-center text-pink-300">
            <Instagram size={15} />
          </div>
          <div className="w-8 h-8 rounded-xl bg-black/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
            Tk
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Facebook size={15} />
          </div>
        </div>

        {/* Integration Callout */}
        <div className="px-2.5 py-1.5 rounded-xl bg-[#001D4A]/60 border border-cyan-500/20 flex items-center gap-2">
          <Share2 size={13} className="text-[#00D2FF] flex-shrink-0" />
          <span className="text-[11px] text-cyan-200 font-medium leading-tight">
            Share your content across all platforms
          </span>
        </div>
      </div>
    </div>
  );
};
