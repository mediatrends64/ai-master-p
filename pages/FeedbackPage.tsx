import React, { useState } from 'react';
import Card from '../components/Card';
import { useLanguage } from '../hooks/useLanguage';
import { CheckmarkIcon } from '../components/icons/CheckmarkIcon';

const StarIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
  <svg
    className={`w-10 h-10 transition-colors duration-200 ${filled ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const FeedbackPage = () => {
    const { t } = useLanguage();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (rating === 0) {
            setError(t('feedback.error_no_rating'));
            return;
        }

        setIsSubmitting(true);
        console.log('Submitting feedback:', { rating, comment });

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="flex justify-center items-center h-full animate-fade-in">
                <Card className="text-center max-w-lg">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-500/20 mb-4">
                        <CheckmarkIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary-light dark:text-text-primary mb-2">
                        {t('feedback.success_title')}
                    </h2>
                    <p className="text-lg text-text-secondary-light dark:text-text-secondary">
                        {t('feedback.success_message')}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-400 dark:to-amber-300">{t('feedback.title')}</h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary mt-2">{t('feedback.subtitle')}</p>
            </header>

            <div className="max-w-2xl mx-auto">
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label className="block text-xl font-medium text-text-primary-light dark:text-text-primary mb-4 text-center">
                                {t('feedback.rating_label')}
                            </label>
                            <div
                                className="flex justify-center"
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        aria-label={`Rate ${star} out of 5 stars`}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-secondary focus:ring-yellow-500 rounded-full"
                                    >
                                        <StarIcon filled={(hoverRating || rating) >= star} className="cursor-pointer transform hover:scale-110" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="comment" className="block text-lg font-medium text-text-primary-light dark:text-text-primary mb-2">
                                {t('feedback.comment_label')}
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder={t('feedback.comment_placeholder')}
                                className="w-full h-40 p-3 bg-secondary border border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition-shadow text-text-primary"
                                disabled={isSubmitting}
                                rows={5}
                            />
                        </div>

                        {error && <p className="text-red-500 text-center">{error}</p>}
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? t('feedback.button_submitting') : t('feedback.button_submit')}
                        </button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default FeedbackPage;