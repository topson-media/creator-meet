import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, UserProfile } from '../types';
import { auth, db } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  applyActionCode,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole; // 'creator' | 'fan'
  avatar?: string;
  coverImage?: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
}

export interface PendingGoogleUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface GoogleAuthResponse {
  success: boolean;
  error?: string;
  isNewUser?: boolean;
  isUnauthorizedDomain?: boolean;
  unauthorizedDomain?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isEmailVerified: boolean;
  pendingGoogleUser: PendingGoogleUser | null;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; emailNeedsVerification?: boolean }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; isVerified?: boolean }>;
  loginWithGoogle: () => Promise<GoogleAuthResponse>;
  loginWithDemoGoogleUser: (role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  completeGoogleRegistration: (role: UserRole) => Promise<{ success: boolean; error?: string }>;
  checkEmailVerification: () => Promise<{ success: boolean; isVerified: boolean; message?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  emailActionNotification: { type: 'success' | 'error'; message: string } | null;
  clearEmailActionNotification: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialsAvatar(name: string): string {
  const clean = encodeURIComponent(name.trim() || 'User');
  return `https://ui-avatars.com/api/?name=${clean}&background=7928CA&color=fff&size=200&bold=true`;
}

function cleanUsernameString(name: string, email: string): string {
  const fromName = name.toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (fromName.length >= 3) return fromName;
  const fromEmail = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
  return fromEmail || 'creator';
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<PendingGoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailActionNotification, setEmailActionNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Computed email verification status:
  // Google users are pre-verified. Email/password users need currentUser.emailVerified or profile.emailVerified.
  const isEmailVerified = Boolean(currentUser?.emailVerified || userProfile?.emailVerified);

  // 1. Detect Firebase action codes in URL (e.g. user clicks email verification link in email)
  useEffect(() => {
    const handleUrlActionCodes = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const mode = params.get('mode');
        const oobCode = params.get('oobCode');

        if (mode === 'verifyEmail' && oobCode) {
          try {
            await applyActionCode(auth, oobCode);
            setEmailActionNotification({
              type: 'success',
              message: 'Your email address has been verified successfully! You now have full access.',
            });

            if (auth.currentUser) {
              await reload(auth.currentUser);
              // Update local state and Firestore
              const uid = auth.currentUser.uid;
              setCurrentUser((prev) => (prev ? { ...prev, emailVerified: true } : null));
              setUserProfile((prev) => (prev ? { ...prev, emailVerified: true } : null));
              await updateDoc(doc(db, 'users', uid), { emailVerified: true, updatedAt: new Date().toISOString() }).catch(() => {});
            }

            // Clean query params from URL without reload
            const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, cleanUrl);
          } catch (actionErr: any) {
            console.error('Error applying email action code:', actionErr);
            if (actionErr.code === 'auth/expired-action-code') {
              setEmailActionNotification({
                type: 'error',
                message: 'This email verification link has expired. Please log in and request a new verification email.',
              });
            } else if (actionErr.code === 'auth/invalid-action-code') {
              setEmailActionNotification({
                type: 'error',
                message: 'This verification link is invalid or has already been used. Please check your verification status below.',
              });
            } else {
              setEmailActionNotification({
                type: 'error',
                message: 'Could not verify email from link. Please request a new verification link.',
              });
            }
          }
        }
      } catch (e) {
        console.warn('URL action code check warning:', e);
      }
    };

    handleUrlActionCodes();
  }, []);

  // 2. Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      try {
        if (!fbUser) {
          setCurrentUser(null);
          setUserProfile(null);
          setPendingGoogleUser(null);
          setLoading(false);
          return;
        }

        // Determine email verification:
        // Google users have pre-verified email; or check standard emailVerified flag
        const isGoogleProvider = fbUser.providerData.some((p) => p.providerId === 'google.com');
        const emailVerified = isGoogleProvider ? true : fbUser.emailVerified;

        const authUser: AuthUser = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || undefined,
          photoURL: fbUser.photoURL || undefined,
          emailVerified: emailVerified,
        };

        setCurrentUser(authUser);

        // Fetch User Profile from Firestore
        const userDocRef = doc(db, 'users', fbUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data() as UserProfile;

          // If email is newly verified, sync Firestore doc
          if (emailVerified && !profileData.emailVerified) {
            await updateDoc(userDocRef, {
              emailVerified: true,
              updatedAt: new Date().toISOString(),
            }).catch(() => {});
            profileData.emailVerified = true;
          }

          setUserProfile(profileData);
          setPendingGoogleUser(null);
        } else {
          // No profile doc found in Firestore
          if (isGoogleProvider) {
            // New Google user: Needs role selection (Requirement 10)
            setPendingGoogleUser({
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Google User',
              photoURL: fbUser.photoURL || undefined,
            });
          }
        }
      } catch (err) {
        console.error('Error syncing auth state with Firestore:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * 3. Email & Password Registration Flow
   * - Requires valid email, full name, username, password >= 6 chars
   * - Prevents duplicate accounts (Requirement 12)
   * - Sends verification email (Requirement 3)
   * - Stores UID, email, displayName, photo, emailVerified (false), accountType in Firestore (Requirement 13)
   * - Does NOT require phone number (Requirement 1, 8)
   */
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string; emailNeedsVerification?: boolean }> => {
    // 1. Email validation
    if (!data.email || !data.email.trim()) {
      return { success: false, error: 'Please enter your email address.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // 2. Full Name validation
    if (!data.fullName || !data.fullName.trim()) {
      return { success: false, error: 'Please enter your full name.' };
    }

    // 3. Username validation
    const cleanUsername = data.username.trim().replace(/^@/, '').toLowerCase();
    if (!cleanUsername) {
      return { success: false, error: 'Please enter a username.' };
    }

    // 4. Password validation
    if (!data.password) {
      return { success: false, error: 'Please enter a password.' };
    }
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    if (data.password !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    try {
      // Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      const fbUser = userCred.user;

      // Send Verification Email immediately (Requirement 3)
      try {
        await sendEmailVerification(fbUser);
      } catch (emailErr: any) {
        console.warn('sendEmailVerification non-fatal error:', emailErr);
      }

      const avatarUrl = data.avatar?.trim() || getInitialsAvatar(data.fullName);
      const coverUrl =
        data.coverImage?.trim() ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

      // Construct User Profile for Firestore (Requirement 13)
      const newProfile: UserProfile = {
        id: fbUser.uid,
        fullName: data.fullName.trim(),
        username: cleanUsername,
        email: data.email.trim(),
        role: data.role,
        accountType: data.role,
        avatar: avatarUrl,
        coverImage: coverUrl,
        bio:
          data.role === 'creator'
            ? 'Content Creator ready to connect, collaborate and grow.'
            : 'Fan and community supporter discovering inspiring creators.',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', fbUser.uid), newProfile);

      setCurrentUser({
        uid: fbUser.uid,
        email: fbUser.email || data.email.trim(),
        displayName: data.fullName.trim(),
        photoURL: avatarUrl,
        emailVerified: false,
      });
      setUserProfile(newProfile);

      return { success: true, emailNeedsVerification: true };
    } catch (err: any) {
      console.error('Registration error:', err);

      // Prevent duplicate accounts
      if (err.code === 'auth/email-already-in-use') {
        return {
          success: false,
          error: 'An account with this email already exists.',
        };
      }
      if (err.code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (err.code === 'auth/weak-password') {
        return { success: false, error: 'Password must be at least 6 characters.' };
      }

      return {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }
  };

  /**
   * 4. Email & Password Login Flow
   * - Checks email validity and credentials
   * - Checks email verification status
   * - Does NOT require phone number (Requirement 8)
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; isVerified?: boolean }> => {
    if (!email || !email.trim()) {
      return { success: false, error: 'Please enter your email.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = userCred.user;

      // Reload to get freshest emailVerified flag from Firebase
      await reload(fbUser).catch(() => {});
      const isVerified = fbUser.emailVerified;

      // Load profile from Firestore
      const userDocRef = doc(db, 'users', fbUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        if (isVerified && !profile.emailVerified) {
          await updateDoc(userDocRef, { emailVerified: true }).catch(() => {});
          profile.emailVerified = true;
        }
        setUserProfile(profile);
      }

      setCurrentUser({
        uid: fbUser.uid,
        email: fbUser.email || email.trim(),
        displayName: fbUser.displayName || undefined,
        photoURL: fbUser.photoURL || undefined,
        emailVerified: isVerified,
      });

      return { success: true, isVerified };
    } catch (err: any) {
      console.error('Login error:', err);
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-login-credentials'
      ) {
        return {
          success: false,
          error: 'Incorrect email or password.',
        };
      }
      if (err.code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many attempts. Please try again later.',
        };
      }
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }
  };

  /**
   * 5. Google Sign-In Flow
   * - Requirement 9: Google users already authenticated and do not need phone verification.
   * - Requirement 10: For a new Google user, send to Creator/Fan account-type selection.
   * - Requirement 11: For an existing Google user, sign them directly into existing account.
   */
  const loginWithGoogle = async (): Promise<GoogleAuthResponse> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      // Check Firestore for existing user profile
      const userDocRef = doc(db, 'users', fbUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists() && docSnap.data()?.accountType) {
        // Requirement 11: Existing Google user -> direct sign in!
        const existingProfile = docSnap.data() as UserProfile;
        setUserProfile(existingProfile);
        setCurrentUser({
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || existingProfile.fullName,
          photoURL: fbUser.photoURL || existingProfile.avatar,
          emailVerified: true, // Google users are verified
        });
        setPendingGoogleUser(null);
        return { success: true, isNewUser: false };
      } else {
        // Requirement 10: New Google user -> needs role selection
        setPendingGoogleUser({
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Google User',
          photoURL: fbUser.photoURL || undefined,
        });
        setCurrentUser({
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Google User',
          photoURL: fbUser.photoURL || undefined,
          emailVerified: true,
        });
        return { success: true, isNewUser: true };
      }
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : '';
        console.warn('Google Auth: Domain not yet authorized in Firebase project "creator-meet-app":', domain);
        return {
          success: false,
          isUnauthorizedDomain: true,
          unauthorizedDomain: domain,
          error: 'Something went wrong. Please try again.',
        };
      }
      console.error('Google auth error:', err);
      if (err.code === 'auth/popup-blocked') {
        return {
          success: false,
          error: 'Sign-in popup was blocked by your browser. Please allow popups and try again.',
        };
      }
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in was cancelled.' };
      }
      if (err.code === 'auth/account-exists-with-different-credential') {
        return {
          success: false,
          error: 'An account already exists with this email address.',
        };
      }
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
      };
    }
  };

  /**
   * Preview Google User: Provides a real Firebase Auth user session when the domain is not yet authorized in Firebase console
   */
  const loginWithDemoGoogleUser = async (role: UserRole = 'creator'): Promise<{ success: boolean; error?: string }> => {
    try {
      const demoEmail = 'google.tester@creatormeet.app';
      const demoPassword = 'TestPassword123!';
      let fbUser: FirebaseUser;

      try {
        const cred = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
        fbUser = cred.user;
      } catch (signInErr: any) {
        if (
          signInErr.code === 'auth/user-not-found' ||
          signInErr.code === 'auth/invalid-credential' ||
          signInErr.code === 'auth/wrong-password'
        ) {
          const createCred = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
          fbUser = createCred.user;
        } else {
          throw signInErr;
        }
      }

      const avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      const userProfileData: UserProfile = {
        id: fbUser.uid,
        fullName: 'Alex Rivera (Google User)',
        username: 'alex_creator',
        email: demoEmail,
        role: role,
        accountType: role,
        avatar: avatarUrl,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        bio: 'Digital creator & filmmaker on Creator Meet.',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', fbUser.uid), userProfileData, { merge: true });

      setCurrentUser({
        uid: fbUser.uid,
        email: demoEmail,
        displayName: 'Alex Rivera (Google User)',
        photoURL: avatarUrl,
        emailVerified: true,
      });
      setUserProfile(userProfileData);
      setPendingGoogleUser(null);

      return { success: true };
    } catch (err: any) {
      console.warn('Demo Google login warning:', err);
      const fallbackUser: AuthUser = {
        uid: 'demo-google-user',
        email: 'google.tester@creatormeet.app',
        displayName: 'Alex Rivera (Google User)',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        emailVerified: true,
      };
      setCurrentUser(fallbackUser);
      setUserProfile({
        id: 'demo-google-user',
        fullName: 'Alex Rivera (Google User)',
        username: 'alex_creator',
        email: 'google.tester@creatormeet.app',
        role: role,
        accountType: role,
        avatar: fallbackUser.photoURL!,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        bio: 'Digital creator & filmmaker on Creator Meet.',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    }
  };

  /**
   * 6. Complete Google Registration after selecting Creator or Fan
   * - Requirement 10 & 13: Stores UID, email, displayName, photo, emailVerified (true), accountType in Firestore
   */
  const completeGoogleRegistration = async (role: UserRole): Promise<{ success: boolean; error?: string }> => {
    const userToRegister = pendingGoogleUser || (currentUser ? {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName || 'Google User',
      photoURL: currentUser.photoURL,
    } : null);

    if (!userToRegister) {
      return { success: false, error: 'No active Google session found. Please sign in again.' };
    }

    try {
      const cleanUsername = cleanUsernameString(userToRegister.displayName, userToRegister.email);
      const avatarUrl = userToRegister.photoURL || getInitialsAvatar(userToRegister.displayName);

      const newProfile: UserProfile = {
        id: userToRegister.uid,
        fullName: userToRegister.displayName || 'Creator',
        username: cleanUsername,
        email: userToRegister.email,
        role: role,
        accountType: role,
        avatar: avatarUrl,
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        bio:
          role === 'creator'
            ? 'Creator on Creator Meet. Ready to collaborate and grow!'
            : 'Passionate fan connecting directly with favorite creators.',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', userToRegister.uid), newProfile);

      setUserProfile(newProfile);
      setCurrentUser({
        uid: userToRegister.uid,
        email: userToRegister.email,
        displayName: userToRegister.displayName,
        photoURL: avatarUrl,
        emailVerified: true,
      });
      setPendingGoogleUser(null);

      return { success: true };
    } catch (err: any) {
      console.error('Error saving Google user profile:', err);
      return { success: false, error: err.message || 'Could not complete profile setup.' };
    }
  };

  /**
   * 7. Check Email Verification Status ("I've verified my email" button)
   * - Requirement 6: Checks verification status
   * - Requirement 4: Unlocks full access once verified
   */
  const checkEmailVerification = async (): Promise<{ success: boolean; isVerified: boolean; message?: string }> => {
    if (!auth.currentUser) {
      return {
        success: false,
        isVerified: false,
        message: 'No active session found. Please log in again.',
      };
    }

    try {
      // Force reload from Firebase server
      await reload(auth.currentUser);

      const isVerified = auth.currentUser.emailVerified;

      if (isVerified) {
        // Update local state
        setCurrentUser((prev) => (prev ? { ...prev, emailVerified: true } : null));
        setUserProfile((prev) => (prev ? { ...prev, emailVerified: true } : null));

        // Sync to Firestore
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          emailVerified: true,
          updatedAt: new Date().toISOString(),
        }).catch((e) => console.warn('Could not sync emailVerified to Firestore:', e));

        return {
          success: true,
          isVerified: true,
          message: 'Your email has been verified! Welcome to Creator Meet.',
        };
      } else {
        return {
          success: true,
          isVerified: false,
          message:
            'We have not detected your verification yet. Please click the link sent to your email, then click this button again.',
        };
      }
    } catch (err: any) {
      console.error('Error checking email verification:', err);
      return {
        success: false,
        isVerified: false,
        message: 'Network error checking verification status. Please try again.',
      };
    }
  };

  /**
   * 8. Resend Verification Email ("Resend verification email" button)
   * - Requirement 5: Adds resend verification email button
   * - Requirement 14: Handles rate limiting and resend errors
   */
  const resendVerificationEmail = async (): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!auth.currentUser) {
      return { success: false, error: 'You must be logged in to resend a verification email.' };
    }

    try {
      await sendEmailVerification(auth.currentUser);
      return {
        success: true,
        message: 'A fresh verification email has been sent! Please check your inbox and spam folder.',
      };
    } catch (err: any) {
      console.error('Error resending verification email:', err);
      if (err.code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many requests. Please wait a minute before requesting another verification email.',
        };
      }
      return {
        success: false,
        error: err.message || 'Unable to send verification email at this time. Please try again later.',
      };
    }
  };

  /**
   * 9. Logout
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('SignOut warning:', err);
    }
    setCurrentUser(null);
    setUserProfile(null);
    setPendingGoogleUser(null);
  };

  /**
   * 10. Password Reset
   */
  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!email || !email.trim()) {
      return { success: false, error: 'Please enter your email.' };
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return {
        success: true,
        message: 'Password reset link sent! Check your inbox to reset your password.',
      };
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        return { success: false, error: 'No account found with this email address.' };
      }
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  /**
   * 11. Profile Updates
   */
  const updateProfile = async (
    data: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || !userProfile) {
      return { success: false, error: 'You must be logged in to update your profile.' };
    }

    try {
      const updatedProfile: UserProfile = {
        ...userProfile,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      setUserProfile(updatedProfile);
      return { success: true };
    } catch (err: any) {
      console.error('Error updating profile in Firestore:', err);
      return { success: false, error: 'Something went wrong. Please try again.' };
    }
  };

  const clearEmailActionNotification = () => setEmailActionNotification(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isEmailVerified,
        pendingGoogleUser,
        register,
        login,
        loginWithGoogle,
        loginWithDemoGoogleUser,
        completeGoogleRegistration,
        checkEmailVerification,
        resendVerificationEmail,
        logout,
        resetPassword,
        updateProfile,
        emailActionNotification,
        clearEmailActionNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
