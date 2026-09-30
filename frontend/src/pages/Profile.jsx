import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Calendar,
  ShieldCheck,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { success, error } = useToast();

  // Profile info state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      setProfileError('Name is required');
      return;
    }
    if (!profileForm.email.trim()) {
      setProfileError('Email is required');
      return;
    }

    setIsUpdatingProfile(true);
    setProfileError('');

    const res = await updateUserProfile({
      name: profileForm.name.trim(),
      email: profileForm.email.trim(),
    });

    setIsUpdatingProfile(false);
    if (res.success) {
      success('Profile details updated successfully');
    } else {
      setProfileError(res.message);
      error(res.message);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError('Please enter a new password');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError('');

    const res = await updateUserProfile({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    setIsUpdatingPassword(false);
    if (res.success) {
      success('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } else {
      setPasswordError(res.message);
      error(res.message);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials, security, and preferences
        </p>
      </div>

      {/* User Header Summary Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-indigo-100 flex-shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-sm text-slate-500">{user?.email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold self-center sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Active Account
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500 justify-center sm:justify-start">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              Member since {memberSince}
            </span>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Information Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-500">Update your public display name and email</p>
              </div>
            </div>

            {profileError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="block w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              form="profile-form"
              disabled={isUpdatingProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-[0.98] shadow-md shadow-indigo-100 transition-all disabled:opacity-50"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Security & Password
                </h3>
                <p className="text-xs text-slate-500">Ensure your account uses a strong password</p>
              </div>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  New Password (min. 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordForm.confirmNewPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmNewPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="block w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                />
              </div>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              form="password-form"
              disabled={isUpdatingPassword}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
