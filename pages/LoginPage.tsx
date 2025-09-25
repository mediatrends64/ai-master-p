import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import Card from '../components/Card';
import { GoogleIcon } from '../components/icons/GoogleIcon';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signInWithGoogle } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Failed to log in.');
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGoogle();
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google.');
        }
        setLoading(false);
    }
    
    return (
        <div className="flex justify-center items-center min-h-full">
            <Card className="max-w-md w-full animate-fade-in">
                <h2 className="text-3xl font-bold text-center mb-6 text-text-primary-light dark:text-text-primary">{t('login.title')}</h2>
                {error && <p className="bg-red-500/20 text-red-500 p-3 rounded-md mb-4">{error}</p>}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label className="block text-text-secondary-light dark:text-text-secondary">{t('login.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-text-secondary-light dark:text-text-secondary">{t('login.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 p-2 bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none"
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:bg-gray-400">
                        {loading ? t('login.button_logging_in') : t('login.button_login')}
                    </button>
                </form>
                
                <div className="my-4 flex items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    <span className="mx-4 text-text-secondary-light dark:text-text-secondary">{t('login.or')}</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                </div>

                <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-primary-light/50 dark:hover:bg-primary-dark/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50">
                    <GoogleIcon className="h-5 w-5 me-2" />
                    {t('login.google_signin')}
                </button>

                 <div className="text-center mt-4 text-sm">
                    <Link to="/home" className="text-accent hover:underline">
                        {t('login.continue_guest')}
                    </Link>
                </div>
                
                <div className="mt-6 text-center text-sm">
                    <p className="text-text-secondary-light dark:text-text-secondary">
                        <Link to="/reset-password" className="text-accent hover:underline">{t('login.forgot_password')}</Link>
                    </p>
                    <p className="text-text-secondary-light dark:text-text-secondary mt-2">
                        {t('login.no_account')} <Link to="/register" className="text-accent hover:underline font-semibold">{t('login.signup')}</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;