import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import Card from '../components/Card';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError(t('register.error_password_mismatch'));
        }
        setLoading(true);
        setError('');
        try {
            await register(email, password);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Failed to create an account.');
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-full">
            <Card className="max-w-md w-full animate-fade-in">
                <h2 className="text-3xl font-bold text-center mb-6 text-text-primary-light dark:text-text-primary">{t('register.title')}</h2>
                {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-text-secondary-light dark:text-text-secondary">{t('register.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-text-secondary-light dark:text-text-secondary">{t('register.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 p-2 bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                            minLength={6}
                        />
                    </div>
                    <div>
                        <label className="block text-text-secondary-light dark:text-text-secondary">{t('register.confirm_password')}</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full mt-1 p-2 bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:bg-gray-400">
                        {loading ? t('register.button_signing_up') : t('register.button_signup')}
                    </button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <p className="text-text-secondary-light dark:text-text-secondary">
                        {t('register.has_account')} <Link to="/login" className="text-accent hover:underline font-semibold">{t('register.login')}</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;