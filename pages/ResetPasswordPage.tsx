import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import Card from '../components/Card';

const ResetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            await resetPassword(email);
            setMessage(t('reset_password.success_message'));
        } catch (err: any) {
            setError(err.message || 'Failed to send password reset email.');
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-full">
            <Card className="max-w-md w-full animate-fade-in">
                <h2 className="text-3xl font-bold text-center mb-6 text-text-primary-light dark:text-text-primary">{t('reset_password.title')}</h2>
                {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-md mb-4">{error}</p>}
                {message && <p className="bg-green-500/20 text-green-500 p-3 rounded-md mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-text-secondary-light dark:text-text-secondary">{t('reset_password.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:bg-gray-400">
                        {loading ? t('reset_password.button_sending') : t('reset_password.button_send')}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <p className="text-text-secondary-light dark:text-text-secondary">
                        {t('reset_password.remember_password')} <Link to="/login" className="text-accent hover:underline font-semibold">{t('reset_password.login')}</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;