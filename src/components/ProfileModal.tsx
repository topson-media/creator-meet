import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AccountBadge } from './AccountBadge';
import { UserRole } from '../types';
import {
  X,
  Calendar,
  Mail,
  AtSign,
  User,
  LogOut,
  Sparkles,
  Heart,
  Check,
  Edit2,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const { userProfile, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [role, setRole] = useState<UserRole>(userProfile?.role || 'creator');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !userProfile) return null;

  const formattedDate = userProfile.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({
      bio,
      role,
      accountType: role,
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div
      id="profile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="profile-modal-card"
        className={`relative w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
          isDarkMode
            ? 'bg-[#0A0F29] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          id="close-profile-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-6 border-b border-white/10">
          <img
            src={userProfile.avatar}
            alt={userProfile.fullName}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/20"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h3 className="text-xl font-bold tracking-tight">{userProfile.fullName}</h3>
              <AccountBadge role={userProfile.role} size="md" />
            </div>
            <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <AtSign size={14} className="text-[#00D2FF]" />
              <span>{userProfile.username}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1">
              <Calendar size={13} className="text-slate-500" />
              <span>Member since {formattedDate}</span>
            </p>
          </div>
        </div>

        {/* Body Details */}
        <div className="py-5 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Email Address
            </span>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={15} className="text-slate-400" />
              <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                {userProfile.email}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Account Type
              </span>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-[#00D2FF] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all ${
                    role === 'creator'
                      ? 'border-[#FF2E93] bg-[#FF2E93]/15 text-white'
                      : isDarkMode
                      ? 'border-white/10 bg-slate-900/60 text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <Sparkles size={14} className="text-[#FF2E93]" />
                    <span>Content Creator</span>
                  </div>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    I create content and want to collaborate
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('fan')}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 cursor-pointer transition-all ${
                    role === 'fan'
                      ? 'border-[#00D2FF] bg-[#00D2FF]/15 text-white'
                      : isDarkMode
                      ? 'border-white/10 bg-slate-900/60 text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                    <Heart size={14} className="text-[#00D2FF]" />
                    <span>Fan</span>
                  </div>
                  <span className="text-[11px] text-slate-400 leading-tight">
                    I discover and follow creators
                  </span>
                </button>
              </div>
            ) : (
              <div className="pt-0.5">
                <AccountBadge role={userProfile.role} size="lg" />
              </div>
            )}
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Bio / Statement
            </span>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className={`w-full p-3 rounded-xl text-sm border focus:outline-hidden ${
                  isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white focus:border-[#00D2FF]'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#00D2FF]'
                }`}
                placeholder="Share a bit about yourself..."
              />
            ) : (
              <p
                className={`text-sm leading-relaxed p-3 rounded-xl ${
                  isDarkMode
                    ? 'bg-white/5 text-slate-300 border border-white/5'
                    : 'bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                {userProfile.bio || 'No bio added yet.'}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setBio(userProfile.bio || '');
                  setRole(userProfile.role);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="gradient-btn-primary px-5 py-2 rounded-full text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Check size={14} />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-slate-500">Creator Meet Authentication</span>
          <button
            id="profile-logout-btn"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
