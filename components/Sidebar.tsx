import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { HomeIcon } from './icons/HomeIcon';
import { LearnIcon } from './icons/LearnIcon';
import { PracticeIcon } from './icons/PracticeIcon';
import { ProgressIcon } from './icons/ProgressIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { BuilderIcon } from './icons/BuilderIcon';
import { ChatIcon } from './icons/ChatIcon';
import { FeedbackIcon } from './icons/FeedbackIcon';

const navItems = [
  { path: '/home', icon: HomeIcon, labelKey: 'sidebar.home' },
  { path: '/learn', icon: LearnIcon, labelKey: 'sidebar.learn' },
  { path: '/practice', icon: PracticeIcon, labelKey: 'sidebar.practice' },
  { path: '/builder', icon: BuilderIcon, labelKey: 'sidebar.builder' },
  { path: '/chat', icon: ChatIcon, labelKey: 'sidebar.chat' },
  { path: '/feedback', icon: FeedbackIcon, labelKey: 'sidebar.feedback' },
  { path: '/progress', icon: ProgressIcon, labelKey: 'sidebar.progress' },
  { path: '/settings', icon: SettingsIcon, labelKey: 'sidebar.settings' },
];

const DesktopSidebar = React.memo(() => {
    const { t } = useLanguage();
    const baseClasses = "flex items-center p-3 my-1 rounded-lg transition-colors duration-200";
    const textClasses = "ms-4 text-lg font-medium";
    const activeClasses = "bg-accent text-white";
    const inactiveClasses = "text-text-secondary-light dark:text-text-secondary hover:bg-secondary-dark/20 dark:hover:bg-secondary/70";

    return (
        <aside className="hidden md:flex w-64 bg-secondary-light dark:bg-primary-dark flex-shrink-0 p-4 flex-col justify-between shadow-lg">
            <div>
                <div className="flex items-center mb-8">
                    <img src="./logo-icon.svg" alt="AI Prompt Master Icon" className="h-10 w-10 mr-3" />
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-300 dark:to-blue-400">
                        {t('sidebar.title')}
                    </span>
                </div>
                <nav>
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
                                >
                                    <item.icon className="h-6 w-6" />
                                    <span className={textClasses}>{t(item.labelKey)}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <div className="text-center text-xs text-text-secondary-light dark:text-gray-500 p-2">
                <p>
                    &copy; {new Date().getFullYear()} | Built by{' '}
                    <a 
                        href="https://uspekhi.web.app" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="USPEKHI Web Design"
                        className="hover:underline text-accent/90 hover:text-accent"
                    >
                        <strong>USPEKHI</strong>
                    </a>
                </p>
            </div>
        </aside>
    );
});

const MobileBottomNav = React.memo(() => {
    const { t } = useLanguage();
    const activeClasses = "text-accent";
    const inactiveClasses = "text-text-secondary-light dark:text-text-secondary";

    // Reorder for mobile to keep most common items accessible
    const mobileNavItems = [
        navItems.find(i => i.path === '/home'),
        navItems.find(i => i.path === '/learn'),
        navItems.find(i => i.path === '/practice'),
        navItems.find(i => i.path === '/builder'),
        navItems.find(i => i.path === '/chat'),
        navItems.find(i => i.path === '/feedback'),
        navItems.find(i => i.path === '/progress'),
        navItems.find(i => i.path === '/settings'),
    ].filter(Boolean) as typeof navItems;


    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-secondary-light dark:bg-primary-dark border-t border-gray-200 dark:border-gray-700 shadow-t-lg">
            <ul className="flex justify-around items-center h-16">
                {mobileNavItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `flex flex-col items-center justify-center w-14 transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
                        >
                            <item.icon className="h-6 w-6 mb-1" />
                            <span className="text-[10px] text-center">{t(item.labelKey)}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
});


const Sidebar = () => {
  return (
    <>
      <DesktopSidebar />
      <MobileBottomNav />
    </>
  );
};

export default Sidebar;