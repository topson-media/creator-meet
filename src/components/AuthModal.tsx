import React, { useState, useEffect } from 'react';
import { AuthForm } from './AuthForm';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  isDarkMode: boolean;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  isDarkMode,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="auth-modal-card"
        className={`relative w-full max-w-md max-h-[92vh] overflow-y-auto rounded-3xl p-5 sm:p-7 border shadow-2xl transition-all my-auto ${
          isDarkMode
            ? 'bg-[#0A0F29] border-white/15 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          id="close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <AuthForm
          mode={mode}
          onSwitchMode={setMode}
          onSuccess={() => {
            if (onSuccess) onSuccess();
            onClose();
          }}
          isDarkMode={isDarkMode}
          isModal={true}
        />
      </div>
    </div>
  );
};
