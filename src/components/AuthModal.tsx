'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isResetMode) {
        await resetPassword(email);
        setResetSuccess(true);
        return;
      }

      if (isSignIn) {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
      }
      onClose();
    } catch (error) {
      setError('Authentication failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      setError('Google sign in failed. Please try again.');
    }
  };

  if (isResetMode) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md relative border border-gray-800">
          <button
            onClick={() => {
              setIsResetMode(false);
              setResetSuccess(false);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <h2 className="text-2xl font-bold mb-6 text-white">Reset Password</h2>

          {resetSuccess ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-500 text-sm">
                Password reset instructions have been sent to your email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-yellow-500/50 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-semibold rounded-lg
                         hover:bg-yellow-400 transition-colors duration-300"
              >
                Send Reset Instructions
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md relative border border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-white">
          {isSignIn ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-yellow-500/50 focus:border-transparent"
                placeholder="Enter your name"
                required={!isSignIn}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-yellow-500/50 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-yellow-500/50 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-gray-900 font-semibold rounded-lg
                     hover:bg-yellow-400 transition-colors duration-300"
          >
            {isSignIn ? 'Sign In' : 'Create Account'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-2 px-4 bg-white text-gray-900 font-semibold rounded-lg
                     hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
          >
            {isSignIn ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
          
          {isSignIn && (
            <button
              onClick={() => setIsResetMode(true)}
              className="block w-full text-sm text-gray-400 hover:text-yellow-500 transition-colors"
            >
              Forgot your password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 