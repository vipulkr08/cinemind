import { useEffect, useState } from 'react';
import { getMovieReviews, analyzeSentiment } from '@/utils/api';
import { ChatBubbleBottomCenterTextIcon, FaceSmileIcon, FaceFrownIcon } from '@heroicons/react/24/outline';

interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  sentiment?: {
    score: number;
    sentiment: 'positive' | 'negative' | 'neutral';
  };
}

interface MovieReviewsProps {
  movieId: number;
}

export default function MovieReviews({ movieId }: MovieReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallSentiment, setOverallSentiment] = useState<number>(0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const data = await getMovieReviews(movieId);
        const reviewsWithSentiment = await Promise.all(
          data.results.map(async (review: Review) => {
            const sentiment = await analyzeSentiment(review.content);
            return { ...review, sentiment };
          })
        );

        // Calculate overall sentiment
        const avgSentiment = reviewsWithSentiment.reduce(
          (acc, review) => acc + (review.sentiment?.score || 0),
          0
        ) / reviewsWithSentiment.length;

        setOverallSentiment(avgSentiment);
        setReviews(reviewsWithSentiment);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <ChatBubbleBottomCenterTextIcon className="h-12 w-12 mx-auto mb-4" />
        <p>No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          {overallSentiment > 0 ? (
            <FaceSmileIcon className="h-6 w-6 text-green-400" />
          ) : overallSentiment < 0 ? (
            <FaceFrownIcon className="h-6 w-6 text-red-400" />
          ) : (
            <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-gray-400" />
          )}
          <span className="font-semibold">
            Overall Sentiment: {Math.round(overallSentiment * 100)}% 
            {overallSentiment > 0 ? ' Positive' : overallSentiment < 0 ? ' Negative' : ' Neutral'}
          </span>
        </div>
        <span className="text-gray-400">Based on {reviews.length} reviews</span>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.author}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {review.sentiment?.sentiment === 'positive' && (
                  <FaceSmileIcon className="h-5 w-5 text-green-400" />
                )}
                {review.sentiment?.sentiment === 'negative' && (
                  <FaceFrownIcon className="h-5 w-5 text-red-400" />
                )}
                <span className={`text-sm ${
                  review.sentiment?.sentiment === 'positive' ? 'text-green-400' :
                  review.sentiment?.sentiment === 'negative' ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {Math.round((review.sentiment?.score || 0) * 100)}% {review.sentiment?.sentiment}
                </span>
              </div>
            </div>
            <p className="text-gray-300">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 