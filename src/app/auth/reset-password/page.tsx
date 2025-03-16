'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-2xl border border-gray-700">
        <div>
          <h2 className="text-3xl font-bold text-white text-center">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-gray-400">
            Please enter your new password below
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-500 text-sm">
              Password updated successfully! Redirecting...
            </p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2
                       focus:ring-yellow-500/50 focus:border-transparent"
              placeholder="Enter your new password"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2
                       focus:ring-yellow-500/50 focus:border-transparent"
              placeholder="Confirm your new password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-semibold rounded-lg
                     hover:bg-yellow-400 transition-colors duration-300"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
} 