import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const { currentUser, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-400 dark:to-amber-300">{t('settings.title')}</h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary mt-2">{t('settings.subtitle')}</p>
            </header>

            <div className="max-w-2xl">
                <Card>
                    <h2 className="text-2xl font-semibold mb-4">{t('settings.appearance.title')}</h2>
                    <div className="flex items-center justify-between">
                        <span className="text-lg text-text-primary-light dark:text-text-primary">{t('settings.appearance.dark_mode')}</span>
                        <button
                            onClick={toggleTheme}
                            className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-300 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <span
                                className={`${
                                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                            />
                        </button>
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary mt-2">
                        {t('settings.appearance.current_mode', { mode: theme === 'dark' ? t('settings.appearance.modes.dark') : t('settings.appearance.modes.light') })}
                    </p>
                </Card>

                <Card className="mt-6">
                    <h2 className="text-2xl font-semibold mb-4">{t('settings.account.title')}</h2>
                     {currentUser && (
                        <div className="space-y-4">
                            <p className="text-text-secondary-light dark:text-text-secondary">
                                {t('settings.account.logged_in_as')}
                                <span className="font-semibold text-text-primary-light dark:text-text-primary ms-2">
                                    {currentUser.isAnonymous ? t('settings.account.guest') : currentUser.email}
                                </span>
                            </p>
                            <button 
                                onClick={handleLogout}
                                className="w-full md:w-auto px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
                            >
                                {t('settings.account.logout')}
                            </button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;