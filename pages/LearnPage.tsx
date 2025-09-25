
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { TCREI_MODULES } from '../constants';
import { LearningModule } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { CheckmarkIcon } from '../components/icons/CheckmarkIcon';

const PROGRESS_STORAGE_KEY = 'tcrei_module_progress';

const Module: React.FC<{ module: LearningModule, isOpen: boolean, onToggle: () => void }> = ({ module, isOpen, onToggle }) => {
    const { t } = useLanguage();
    return (
        <Card className="mb-4 animate-slide-in-up overflow-hidden">
            <button
                className="w-full text-start flex justify-between items-center"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <div className="flex items-center flex-grow">
                     <span className="text-3xl me-4">{module.emoji}</span>
                     <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-text-primary">{t(module.titleKey)}</h2>
                            {module.progress === 100 && (
                                <div className="flex items-center text-green-500" aria-label="Module completed">
                                    <CheckmarkIcon className="h-5 w-5 me-1" />
                                    <span className="font-semibold text-sm">Completed</span>
                                </div>
                            )}
                        </div>
                        <p className="text-md text-text-secondary-light dark:text-text-secondary mt-1">{t(module.subtitleKey)}</p>
                        <div className="mt-3">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out" 
                                    style={{ width: `${module.progress}%` }}
                                    role="progressbar"
                                    aria-valuenow={module.progress}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`${t(module.titleKey)} progress`}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <span className={`transform transition-transform duration-300 text-2xl ms-4 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    &#9660;
                </span>
            </button>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen mt-6' : 'max-h-0'}`}>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <p className="mb-6 text-lg text-text-secondary-light dark:text-text-secondary">{t(module.descriptionKey)}</p>
                    {module.content.map((item, index) => (
                        <div key={index} className="mb-4 last:mb-0">
                            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{t(item.titleKey)}</h4>
                            <p className="text-text-secondary-light dark:text-text-secondary">{t(item.textKey)}</p>
                            {item.example && (
                                <pre className="mt-2 p-3 bg-primary-light/50 dark:bg-primary-dark/50 rounded-md text-sm text-slate-800 dark:text-text-primary whitespace-pre-wrap font-mono">
                                    <code>{item.example}</code>
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

const LearnPage = () => {
    const [openModuleId, setOpenModuleId] = useState<string | null>(null);
    const { t } = useLanguage();
    
    // Initialize state from constants, but allow it to be updated.
    const [modules, setModules] = useState<LearningModule[]>(TCREI_MODULES);

    // Load progress from localStorage on initial render
    useEffect(() => {
        try {
            const savedProgressJSON = localStorage.getItem(PROGRESS_STORAGE_KEY);
            if (savedProgressJSON) {
                const savedProgress = JSON.parse(savedProgressJSON) as Record<string, number>;
                // Create a new array with updated progress
                const updatedModules = TCREI_MODULES.map(module => ({
                    ...module,
                    progress: savedProgress[module.id] !== undefined ? savedProgress[module.id] : module.progress,
                }));
                setModules(updatedModules);
            }
        } catch (error) {
            console.error("Failed to load or parse progress from localStorage:", error);
        }
    }, []);

    // Save progress to localStorage whenever modules state changes
    useEffect(() => {
        try {
            const progressToSave = modules.reduce((acc, module) => {
                acc[module.id] = module.progress;
                return acc;
            }, {} as Record<string, number>);
            localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressToSave));
        } catch (error) {
            console.error("Failed to save progress to localStorage:", error);
        }
    }, [modules]);


    const handleToggle = (moduleId: string) => {
        const newOpenModuleId = openModuleId === moduleId ? null : moduleId;
        setOpenModuleId(newOpenModuleId);

        // When a module is opened (viewed), its progress is updated to 100%.
        // This state is persisted to localStorage by a separate useEffect hook.
        // We only update if the progress is not already 100 to avoid unnecessary re-renders.
        if (newOpenModuleId !== null) {
            const moduleToUpdate = modules.find(m => m.id === moduleId);
            if (moduleToUpdate && moduleToUpdate.progress < 100) {
                setModules(prevModules =>
                    prevModules.map(module =>
                        module.id === moduleId ? { ...module, progress: 100 } : module
                    )
                );
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-400 dark:to-amber-300">{t('learn.title')}</h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary mt-2">{t('learn.subtitle')}</p>
            </header>
            <div>
                {modules.map((module) => (
                    <Module
                        key={module.id}
                        module={module}
                        isOpen={openModuleId === module.id}
                        onToggle={() => handleToggle(module.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default LearnPage;
