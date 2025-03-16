'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { StarIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { Movie } from '@/types/movie';
import { getImageUrl } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

interface MovieCardProps {
  movie: Movie;
}

function formatVoteCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <Link 
        href={`/movie/${movie.id}`} 
        className="group relative block overflow-hidden rounded-lg transition-all hover:scale-105"
        onClick={handleClick}
      >
        <div className="aspect-[2/3] relative">
          {movie.poster_path ? (
            <Image
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-75"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 p-4">
              <span className="text-center text-lg text-gray-400">{movie.title}</span>
            </div>
          )}
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-4">
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400">
              {movie.title}
            </h3>
            <div className="mt-2 flex items-center space-x-4">
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="ml-1 text-sm text-yellow-50">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center text-gray-300">
                <UserGroupIcon className="h-4 w-4" />
                <span className="ml-1 text-sm">
                  {formatVoteCount(movie.vote_count)}
                </span>
              </div>
              <div className="flex items-center text-gray-300">
                <CalendarIcon className="h-4 w-4" />
                <span className="ml-1 text-sm">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-300 line-clamp-3">
              {movie.overview}
            </p>
          </div>
        </div>
      </Link>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
} 