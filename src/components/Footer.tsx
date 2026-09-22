import React from 'react';
import { Logo } from './Logo';
import { PageRoute } from '../types';
import { Instagram, Youtube, Facebook, ArrowRight } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
  onNavigate: (page: PageRoute) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode, onNavigate, onOpenAuth }) => {
  const handleLink = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className={`border-t transition-colors ${
        isDarkMode ? 'bg-[#040714] border-white/10 text-white' : 'bg-slate-900 border-slate-800 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand & Slogan Column */}
          <div className="lg:col-span-3 flex flex-col justify-between">
            <div>
              <button
                id="footer-brand-logo"
                onClick={() => handleLink('home')}
                className="cursor-pointer focus:outline-hidden"
              >
                <Logo isDark={true} size="md" />
              </button>
              <p className="mt-3 text-slate-400 text-sm font-medium tracking-wide">
                Meet. Connect. Share. Grow.
              </p>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed max-w-xs">
                The dedicated ecosystem built for creators to find high-impact collaborations and for
                fans to connect with real creators.
              </p>
            </div>
          </div>

          {/* Navigation Links Column: Platform */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleLink('home')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('discover')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Discover
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('creators')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Creators
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('fans')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Fans
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('features')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Features
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Links Column: Company */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Community Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#FF2E93] transition cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase mb-4">Follow Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition group"
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-pink-400 group-hover:bg-[#FF2E93] group-hover:text-white transition">
                    <Instagram size={13} />
                  </span>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition group"
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white transition">
                    <Youtube size={13} />
                  </span>
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition group"
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Facebook size={13} />
                  </span>
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 hover:text-white transition group"
                >
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black transition text-[10px] font-bold">
                    Tk
                  </span>
                  <span>TikTok</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column: "Join Creator Meet Today" Gradient Card matching mockup */}
          <div className="lg:col-span-3">
            <div
              id="footer-join-card"
              className="p-6 rounded-2xl bg-gradient-to-br from-[#121B42] via-[#2A113E] to-[#60083B] border border-white/15 shadow-xl flex flex-col justify-between"
            >
              <div>
                <h4 className="text-base font-bold text-white leading-tight">
                  Join Creator Meet Today
                </h4>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Be part of a growing community of creators and fans.
                </p>
              </div>

              <button
                id="footer-get-started-btn"
                onClick={() => onOpenAuth('signup')}
                className="gradient-btn-primary mt-5 w-full py-2.5 px-4 text-xs sm:text-sm font-bold text-white rounded-full flex items-center justify-center gap-2 shadow-md shadow-[#FF1E82]/30 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Slogan Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p id="footer-copyright">© 2026 Creator Meet. All rights reserved.</p>
          <p id="footer-slogan" className="text-slate-400 font-medium">
            Meet. Connect. Share. Grow.
          </p>
        </div>
      </div>
    </footer>
  );
};
