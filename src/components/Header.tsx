'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FilmIcon, 
  UserCircleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  StarIcon,
  CogIcon
} from '@heroicons/react/24/solid';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: 'Popular', href: '/' },
    { name: 'Top Rated', href: '/top-rated' },
    { name: 'My List', href: '/my-list', protected: true },
  ];

  // Mock notifications - replace with real data from your backend
  const notifications = [
    { id: 1, title: 'New movie recommendation', message: 'Check out "Inception" based on your watchlist', time: '1h ago' },
    { id: 2, title: 'Welcome to Cinemind!', message: 'Start exploring movies and create your watchlist', time: '2h ago' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      setShowMobileMenu(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        showUserMenu &&
        target &&
        !target.closest('[data-user-menu]')
      ) {
        setShowUserMenu(false);
      }
      if (
        showNotifications &&
        target &&
        !target.closest('[data-notifications]')
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu, showNotifications]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <FilmIcon className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-transparent bg-clip-text">
              Cinemind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => {
              if (item.protected && !user) return null;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Search and Auth Section */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Notifications */}
            {user && (
              <div className="relative" data-notifications>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-300 hover:text-white transition-colors relative"
                >
                  <BellIcon className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-yellow-500 rounded-full" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2">
                    <h3 className="px-4 py-2 text-sm font-medium text-white border-b border-gray-700">
                      Notifications
                    </h3>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-700/50 transition-colors cursor-pointer"
                      >
                        <h4 className="text-sm font-medium text-white">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-400 mt-1 block">
                          {notification.time}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <UserCircleIcon className="h-8 w-8" />
                  <span className="text-sm font-medium hidden md:block">
                    {user.email}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <CogIcon className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    <Link
                      href="/my-list"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HeartIcon className="h-4 w-4" />
                      My List
                    </Link>
                    <Link
                      href="/ratings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <StarIcon className="h-4 w-4" />
                      My Ratings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-yellow-500 rounded-lg
                         hover:bg-yellow-400 transition-colors duration-300"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="absolute inset-x-0 top-full mt-2 px-4 py-3 bg-gray-800 border-t border-gray-700 shadow-lg">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg
                           text-white placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-yellow-500/50 focus:border-transparent"
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden fixed inset-0 top-[73px] bg-gray-900/95 backdrop-blur-sm">
            <div className="p-4 space-y-4">
              {navigation.map((item) => {
                if (item.protected && !user) return null;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setShowMobileMenu(false)}
                    className={`block py-2 text-lg font-medium transition-colors ${
                      pathname === item.href
                        ? 'text-yellow-500'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
} 