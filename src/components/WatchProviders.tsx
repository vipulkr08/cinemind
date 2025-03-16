import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getWatchProviders, type WatchProvider, getImageUrl } from '@/utils/api';
import { PlayCircleIcon, ShoppingCartIcon, FilmIcon } from '@heroicons/react/24/outline';

interface WatchProvidersProps {
  movieId: number;
}

interface ProviderSectionProps {
  title: string;
  providers: WatchProvider[] | undefined;
  icon: React.ElementType;
}

export default function WatchProviders({ movieId }: WatchProvidersProps) {
  const [providers, setProviders] = useState<{
    link?: string;
    rent?: WatchProvider[];
    buy?: WatchProvider[];
    flatrate?: WatchProvider[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const data = await getWatchProviders(movieId);
        setProviders(data);
      } catch (error) {
        console.error('Error fetching watch providers:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProviders();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!providers || (!providers.flatrate && !providers.rent && !providers.buy)) {
    return (
      <div className="text-center py-4 text-gray-400">
        <p>No streaming information available</p>
      </div>
    );
  }

  const ProviderSection = ({ title, providers, icon: Icon }: ProviderSectionProps) => {
    if (!providers?.length) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-yellow-400" />
          <h4 className="font-semibold">{title}</h4>
        </div>
        <div className="flex flex-wrap gap-3">
          {providers.map((provider) => (
            <div
              key={provider.provider_id}
              className="group relative"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                <Image
                  src={getImageUrl(provider.logo_path)}
                  alt={provider.provider_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                {provider.provider_name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ProviderSection
        title="Stream"
        providers={providers.flatrate}
        icon={PlayCircleIcon}
      />
      <ProviderSection
        title="Rent"
        providers={providers.rent}
        icon={FilmIcon}
      />
      <ProviderSection
        title="Buy"
        providers={providers.buy}
        icon={ShoppingCartIcon}
      />
      {providers.link && (
        <a
          href={providers.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-yellow-400 hover:underline"
        >
          View all watching options →
        </a>
      )}
    </div>
  );
} 