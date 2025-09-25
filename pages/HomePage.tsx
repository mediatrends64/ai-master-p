import React from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../components/Card';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { TCREI_MODULES } from '../constants';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';

const HomePage = () => {
    const { currentUser } = useAuth();
    const { t } = useLanguage();
    const progressData = [
        { name: 'Completed', value: 2 },
        { name: 'In Progress', value: 1 },
        { name: 'Not Started', value: 2 },
    ];
    const COLORS = ['#4ADE80', '#F97316', '#4A5568'];
    const currentLesson = TCREI_MODULES[2]; // Mock data

    const getGreeting = () => {
        if (!currentUser || currentUser.isAnonymous) {
            return t('home.greeting_guest');
        }
        const username = currentUser.email?.split('@')[0] || 'Prompt Engineer';
        return t('home.greeting_user', { name: username });
    };

    const greeting = getGreeting();

    return (
        <div className="animate-fade-in text-text-primary-light dark:text-text-primary">
            <div className="flex justify-between items-start mb-8">
                <header>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-400 dark:to-amber-300">{greeting}</h1>
                    <p className="text-lg text-text-secondary-light dark:text-text-secondary mt-2">{t('home.subtitle')}</p>
                </header>
                 <div className="flex-shrink-0">
                    <ThemeSwitcher />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content: Current Lesson & Daily Challenge */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                        <h2 className="text-2xl font-semibold mb-2 text-text-primary-light dark:text-text-primary">{t('home.continue_lesson')}</h2>
                        <div className="flex items-start p-4 bg-primary-light/50 dark:bg-primary-dark/50 rounded-lg">
                            <span className="text-4xl me-4">{currentLesson.emoji}</span>
                            <div>
                                <h3 className="text-xl font-bold text-accent">{t(currentLesson.titleKey)}</h3>
                                <p className="text-text-secondary-light dark:text-text-secondary mb-4">{t(currentLesson.subtitleKey)}</p>
                                <Link to="/learn" className="inline-block px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transform hover:scale-105 transition-all duration-200">
                                    {t('home.go_to_lesson')}
                                </Link>
                            </div>
                        </div>
                    </Card>
                    <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                         <h2 className="text-2xl font-semibold mb-2 text-text-primary-light dark:text-text-primary">{t('home.daily_challenge')}</h2>
                         <p className="text-text-secondary-light dark:text-text-secondary mb-4">{t('home.daily_challenge_prompt')}</p>
                         <Link to="/practice" className="inline-block px-4 py-2 border border-accent text-accent font-semibold rounded-lg hover:bg-accent hover:text-white transform hover:scale-105 transition-all duration-200">
                             {t('home.start_challenge')}
                         </Link>
                    </Card>
                </div>

                {/* Sidebar Content: Progress Overview */}
                <Card className="md:col-span-1 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
                    <h2 className="text-2xl font-semibold mb-4 text-center text-text-primary-light dark:text-text-primary">{t('home.progress_title')}</h2>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={progressData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {progressData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold fill-text-primary-light dark:fill-text-primary">
                                    {t('home.progress_percentage')}
                                </text>
                                 <text x="50%" y="65%" textAnchor="middle" dominantBaseline="central" className="text-sm fill-text-secondary-light dark:fill-text-secondary">
                                    {t('home.progress_complete')}
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                     <p className="text-center text-text-secondary-light dark:text-text-secondary mt-4">{t('home.progress_summary')}</p>
                </Card>
            </div>
        </div>
    );
};

export default React.memo(HomePage);