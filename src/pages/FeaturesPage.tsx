import React, { useState } from 'react';
import {
  Share2,
  Users,
  Smartphone,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Zap,
  Award,
  CheckCircle2,
  Radio,
  Flame,
  Globe2,
  Play,
  TrendingUp,
  Sliders,
  DollarSign,
  Heart,
  Lock,
  Layers,
} from 'lucide-react';
import { PageRoute } from '../types';

interface FeaturesPageProps {
  isDarkMode: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigate: (page: PageRoute) => void;
}

type FeatureCategory = 'all' | 'collab' | 'creator' | 'fans' | 'security';

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  isDarkMode,
  onOpenAuth,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory>('all');
  const [simulatedPitch, setSimulatedPitch] = useState('');
  const [pitchSent, setPitchSent] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'reach' | 'engagement' | 'audience'>('reach');

  const categories: { id: FeatureCategory; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'all', label: 'All Features', icon: Sparkles },
    { id: 'collab', label: 'Collab Matchmaking', icon: Users },
    { id: 'creator', label: 'Creator Studio & Kits', icon: Award },
    { id: 'fans', label: 'Fan Lounges & DMs', icon: Heart },
    { id: 'security', label: 'Escrow & Safety', icon: ShieldCheck },
  ];

  const featureItems = [
    {
      id: 'f-1',
      category: 'collab',
      icon: Users,
      badge: 'Matchmaking',
      color: 'from-[#FF2E93] to-[#FF8C00]',
      title: 'Smart Collaboration Engine',
      description:
        'Post project requests for co-hosts, video editors, and audio designers. Filter by niche, subscriber scale, and verified escrow score.',
      metrics: 'Over 2,400 active monthly collab deals',
    },
    {
      id: 'f-2',
      category: 'creator',
      icon: Award,
      badge: 'Analytics',
      color: 'from-[#00D2FF] to-[#7928CA]',
      title: 'Live Interactive Media Kits',
      description:
        'Instant, auto-updating media kits summarizing your YouTube, TikTok, and Instagram reach. Generate a single link for brand sponsors.',
      metrics: 'Real-time verified follower metrics',
    },
    {
      id: 'f-3',
      category: 'fans',
      icon: MessageSquare,
      badge: 'Community',
      color: 'from-[#7928CA] to-[#FF2E93]',
      title: 'Direct Fan Lounges & Cheers',
      description:
        'Direct connection between passionate fans and creators. Send custom cheers, request shoutouts, and join VIP discussions.',
      metrics: 'Direct inbox with zero algorithmic suppression',
    },
    {
      id: 'f-4',
      category: 'security',
      icon: ShieldCheck,
      badge: 'Protection',
      color: 'from-emerald-400 to-teal-500',
      title: 'Escrow Contract Protection',
      description:
        'Secure your creative investments. Funds remain protected in escrow until editing, voiceover, or sponsorship deliverables are approved.',
      metrics: '100% dispute protection guarantee',
    },
    {
      id: 'f-5',
      category: 'creator',
      icon: Radio,
      badge: 'Live Broadcasting',
      color: 'from-rose-500 to-amber-500',
      title: 'Co-Streaming & Dual Broadcasts',
      description:
        'Host dual-stream panels with fellow creators. Invite guests on-stage with one click, share screens, and sync chat feeds.',
      metrics: 'Ultra-low latency WebRTC streaming',
    },
    {
      id: 'f-6',
      category: 'collab',
      icon: Share2,
      badge: 'Syndication',
      color: 'from-blue-500 to-indigo-600',
      title: 'Omnichannel Feed & Reels',
      description:
        'Publish vertical reels, photo carousels, and stories to your verified followers with high-bitrate playback and soundwaves.',
      metrics: 'Crisp 1080p/4K 60fps video engine',
    },
  ];

  const filteredFeatures =
    selectedCategory === 'all'
      ? featureItems
      : featureItems.filter((f) => f.category === selectedCategory);

  return (
    <div id="features-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-fade-in">
      {/* 1. Hero Showcase Section */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border text-center space-y-4">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FF2E93]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#00D2FF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isDarkMode
                ? 'bg-white/10 text-[#00D2FF] border border-[#00D2FF]/30'
                : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
            }`}
          >
            <Zap size={14} className="text-[#FF2E93]" />
            <span>Empowering Next-Gen Creators & Fans</span>
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Built for Bold Collaborations and Real Community
          </h1>

          <p
            className={`text-xs sm:text-base max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Creator Meet bridges creators, video editors, artists, and superfans into one ecosystem with escrow protection, live broadcasts, and seamless media kits.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('creators')}
              className="gradient-btn-primary px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#FF2E93]/30 flex items-center gap-2 cursor-pointer hover:opacity-95 transition"
            >
              <span>Explore Creator Directory</span>
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('discover')}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition cursor-pointer ${
                isDarkMode
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Browse Open Collabs
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-inherit max-w-4xl mx-auto">
          {[
            { label: 'Verified Creators', value: '18,500+' },
            { label: 'Completed Collabs', value: '42,000+' },
            { label: 'Escrow Protected', value: '$2.8M+' },
            { label: 'Audience Reach', value: '140M+' },
          ].map((stat, i) => (
            <div key={i} className="p-3">
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#FF2E93] to-[#00D2FF] bg-clip-text text-transparent block">
                {stat.value}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Interactive Feature Navigation Tabs */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white border-transparent shadow-md'
                    : isDarkMode
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-[#0A0F26] border-white/10 hover:border-white/20'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon size={20} />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isDarkMode ? 'border-white/15 bg-white/5 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.description}
                </p>

                <div className="pt-3 border-t border-inherit flex items-center gap-1.5 text-[11px] font-semibold text-[#00D2FF]">
                  <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  <span>{item.metrics}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Collab Showcase & Media Kit Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Left: Interactive Collab Pitch Simulator */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border ${
            isDarkMode ? 'bg-[#080D24] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          } space-y-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FF2E93]/20 text-[#FF2E93] flex items-center justify-center font-bold">
                <Users size={16} />
              </div>
              <h3 className="text-sm sm:text-base font-bold">Live Collab Pitch Simulator</h3>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Interactive
            </span>
          </div>

          <p className="text-xs text-slate-400">
            See how creators exchange offers and escrow deposits instantly on Creator Meet.
          </p>

          <div
            className={`p-4 rounded-2xl border space-y-3 ${
              isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Creator avatar"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#FF2E93]"
              />
              <div>
                <span className="text-xs font-bold block">Elena Rostova</span>
                <span className="text-[10px] text-slate-400">Tech & Design Creator • 420K Subs</span>
              </div>
              <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF2E93]/15 text-[#FF2E93]">
                Open for Collabs
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Your Collaboration Proposal:
              </label>
              <textarea
                rows={2}
                value={simulatedPitch}
                onChange={(e) => setSimulatedPitch(e.target.value)}
                placeholder="e.g. Would love to co-host a podcast episode reviewing AI video workflows next Tuesday!"
                className={`w-full p-2.5 text-xs rounded-xl border focus:outline-hidden ${
                  isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock size={12} className="text-emerald-400" />
                <span>Escrow locked on agreement</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!simulatedPitch.trim()) {
                    setSimulatedPitch('Hi Elena, interested in a YouTube dual-podcast collab!');
                  }
                  setPitchSent(true);
                  setTimeout(() => setPitchSent(false), 4000);
                }}
                className="gradient-btn-primary px-3.5 py-1.5 rounded-full text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                {pitchSent ? 'Proposal Sent! ✓' : 'Send Test Pitch'}
              </button>
            </div>

            {pitchSent && (
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-fade-in flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>Elena received your collab request with automated escrow terms!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Creator Media Kit Preview */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border ${
            isDarkMode ? 'bg-[#080D24] border-white/10' : 'bg-white border-slate-200 shadow-sm'
          } space-y-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#00D2FF]/20 text-[#00D2FF] flex items-center justify-center font-bold">
                <Award size={16} />
              </div>
              <h3 className="text-sm sm:text-base font-bold">Automated Creator Media Kit</h3>
            </div>
            <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/10">
              {(['reach', 'engagement', 'audience'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMediaTab(tab)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize transition cursor-pointer ${
                    activeMediaTab === tab
                      ? 'bg-[#00D2FF] text-slate-900'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Export ready-to-share dynamic analytics that guarantee sponsor credibility.
          </p>

          <div
            className={`p-4 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {activeMediaTab === 'reach' && (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-xs font-bold text-slate-400 block">YouTube</span>
                    <span className="text-sm font-extrabold text-[#FF2E93]">680K</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-xs font-bold text-slate-400 block">TikTok</span>
                    <span className="text-sm font-extrabold text-[#00D2FF]">1.2M</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-xs font-bold text-slate-400 block">Instagram</span>
                    <span className="text-sm font-extrabold text-[#7928CA]">340K</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Monthly Impressions</span>
                  <span className="font-bold text-emerald-400">+34% vs last mo.</span>
                </div>
              </div>
            )}

            {activeMediaTab === 'engagement' && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Average Watch Time:</span>
                  <span className="font-bold">6m 42s (78% retention)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Comment Ratio:</span>
                  <span className="font-bold">4.8% per video</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#00D2FF] to-[#FF2E93] h-full w-[82%]" />
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Top 5% engagement benchmark across Gaming & Tech niches.
                </span>
              </div>
            )}

            {activeMediaTab === 'audience' && (
              <div className="space-y-3 animate-fade-in">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-slate-400 block">Top Geographies</span>
                    <span className="font-bold">🇺🇸 US (48%), 🇬🇧 UK (18%)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-slate-400 block">Age Demographic</span>
                    <span className="font-bold">18-34 years (84%)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Escrow Safe Workflow Step Indicators */}
      <div
        className={`p-6 sm:p-10 rounded-3xl border ${
          isDarkMode ? 'bg-[#0A0F26] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        } space-y-6`}
      >
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00D2FF]">
            Zero Risk Collabs
          </span>
          <h2 className="text-xl sm:text-2xl font-bold">How Creator Escrow Keeps Both Sides Safe</h2>
          <p className="text-xs text-slate-400">
            Work with new creators across the world without fear of ghosting or unpaid work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Agree on Deliverables', desc: 'Define milestone dates, draft revisions, and payment amount.' },
            { step: '02', title: 'Escrow Deposit Locked', desc: 'Client locks funds securely in Creator Meet vault.' },
            { step: '03', title: 'Draft Review & Revisions', desc: 'Review watermarked preview files and request tweaks.' },
            { step: '04', title: 'Instant Release Payout', desc: 'Deliverables verified and funds instantly released.' },
          ].map((s) => (
            <div
              key={s.step}
              className={`p-4 rounded-2xl border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              } space-y-2`}
            >
              <span className="text-2xl font-black bg-gradient-to-r from-[#FF2E93] to-[#00D2FF] bg-clip-text text-transparent block">
                {s.step}
              </span>
              <h4 className="text-xs font-bold">{s.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Bottom Call-to-Action */}
      <div className="rounded-3xl p-8 sm:p-10 text-center bg-gradient-to-r from-[#FF2E93] to-[#7928CA] text-white shadow-xl space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to Join the Creator Revolution?</h2>
        <p className="text-xs sm:text-sm max-w-lg mx-auto text-white/90">
          Create your verified profile today and start pitching collab projects or connecting with your favorite creators.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-md hover:bg-slate-100 transition cursor-pointer"
          >
            Create Your Account
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2.5 rounded-full bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/30 hover:bg-white/25 transition cursor-pointer"
          >
            Go to Home Feed
          </button>
        </div>
      </div>
    </div>
  );
};
