import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/Card';
import { Persona, SavedPrompt } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import PersonaSelector from '../components/PersonaSelector';
import { ExportIcon } from '../components/icons/ExportIcon';
import { ClipboardIcon } from '../components/icons/ClipboardIcon';
import { CheckmarkIcon } from '../components/icons/CheckmarkIcon';
import Modal from '../components/Modal';
import { ClearIcon } from '../components/icons/ClearIcon';
import { SaveIcon } from '../components/icons/SaveIcon';
import { TrashIcon } from '../components/icons/TrashIcon';

const ExamplesSection: React.FC<{
    titleKey: string;
    example1Key: string;
    example2Key: string;
    onExampleClick: (text: string) => void;
}> = ({ titleKey, example1Key, example2Key, onExampleClick }) => {
    const { t } = useLanguage();
    return (
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold text-text-primary-light dark:text-text-primary mb-2">
                {t(titleKey)}
            </h4>
            <div className="space-y-2">
                <button
                    onClick={() => onExampleClick(t(example1Key))}
                    className="w-full text-left p-3 rounded-md bg-primary-light/50 dark:bg-primary-dark/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary whitespace-pre-wrap">
                        <span className="font-sans me-2">💡</span> {t(example1Key)}
                    </p>
                </button>
                <button
                    onClick={() => onExampleClick(t(example2Key))}
                    className="w-full text-left p-3 rounded-md bg-primary-light/50 dark:bg-primary-dark/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary whitespace-pre-wrap">
                        <span className="font-sans me-2">💡</span> {t(example2Key)}
                    </p>
                </button>
            </div>
        </div>
    );
};

const PromptBuilderPage = () => {
    const { t } = useLanguage();
    const [task, setTask] = useState('');
    const [context, setContext] = useState('');
    const [references, setReferences] = useState('');
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const [openSection, setOpenSection] = useState('task');
    const [isCopied, setIsCopied] = useState(false);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [promptName, setPromptName] = useState('');
    const [promptNameError, setPromptNameError] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
    const [promptToDelete, setPromptToDelete] = useState<SavedPrompt | null>(null);

    const previewRef = useRef<HTMLPreElement>(null);
    
    const SUGGESTION_THRESHOLD = 2000;
    const WARNING_THRESHOLD = 4000;

    useEffect(() => {
        try {
            const prompts = JSON.parse(localStorage.getItem('saved_prompts') || '[]').sort((a: SavedPrompt, b: SavedPrompt) => a.name.localeCompare(b.name));
            setSavedPrompts(prompts);
        } catch (error) {
            console.error("Failed to load saved prompts:", error);
            setSavedPrompts([]);
        }
    }, []);
    
    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(''), 3000);
    };

    const assemblePrompt = () => {
        const parts = [];
        if (selectedPersona) {
            parts.push(`Act as a ${selectedPersona.englishName}.`);
        }
        if (task.trim()) {
            parts.push(task.trim());
        }
        if (context.trim()) {
            parts.push(`\nContext:\n${context.trim()}`);
        }
        if (references.trim()) {
            parts.push(`\nExamples:\n${references.trim()}`);
        }
        return parts.join('\n\n');
    };

    const finalPrompt = assemblePrompt();
    const isPromptEmpty = !task.trim() && !context.trim() && !references.trim() && !selectedPersona;

    const createFileName = () => {
        if (task.trim()) {
            return task.trim().toLowerCase().split(/\s+/).slice(0, 5).join('_').replace(/[^a-z0-9_]/g, '') || 'prompt';
        }
        return 'prompt';
    };

    const handleExportTxt = () => {
        const fileName = createFileName();
        const blob = new Blob([finalPrompt], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportJson = () => {
        const fileName = createFileName();
        const promptObject = {
            persona: selectedPersona ? selectedPersona.englishName : null,
            task: task.trim(),
            context: context.trim(),
            references: references.trim(),
            fullPrompt: finalPrompt
        };
        const jsonString = JSON.stringify(promptObject, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCopy = () => {
        if (finalPrompt && navigator.clipboard) {
            navigator.clipboard.writeText(finalPrompt).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };
    
    const handleClearAll = () => {
        setTask('');
        setContext('');
        setReferences('');
        setSelectedPersona(null);
        setIsClearModalOpen(false);
    };

    const handleOpenSaveModal = () => {
        setPromptName('');
        setPromptNameError('');
        setIsSaveModalOpen(true);
    };

    const handleSavePrompt = () => {
        if (!promptName.trim()) {
            setPromptNameError(t('builder.save_modal.error_empty'));
            return;
        }

        try {
            const newPrompt: SavedPrompt = {
                name: promptName.trim(),
                task,
                context,
                references,
                persona: selectedPersona,
            };

            const updatedPrompts = savedPrompts.filter(p => p.name !== newPrompt.name);
            updatedPrompts.push(newPrompt);
            updatedPrompts.sort((a, b) => a.name.localeCompare(b.name));

            localStorage.setItem('saved_prompts', JSON.stringify(updatedPrompts));
            setSavedPrompts(updatedPrompts);
            
            setIsSaveModalOpen(false);
            setPromptName('');
            setPromptNameError('');

            showFeedback(t('builder.save_success'));

        } catch (error) {
            console.error("Failed to save prompt to localStorage:", error);
            setPromptNameError("Failed to save prompt. Please try again.");
        }
    };

    const handleLoadPrompt = (prompt: SavedPrompt) => {
        setTask(prompt.task || '');
        setContext(prompt.context || '');
        setReferences(prompt.references || '');
        setSelectedPersona(prompt.persona || null);
        
        showFeedback(t('builder.load_success'));
    
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const openDeleteModal = (prompt: SavedPrompt) => {
        setPromptToDelete(prompt);
        setIsDeleteModalOpen(true);
    };
    
    const confirmDeletePrompt = () => {
        if (!promptToDelete) return;
        try {
            const updatedPrompts = savedPrompts.filter(p => p.name !== promptToDelete.name);
            localStorage.setItem('saved_prompts', JSON.stringify(updatedPrompts));
            setSavedPrompts(updatedPrompts);
            
            setIsDeleteModalOpen(false);
            setPromptToDelete(null);
            
            showFeedback(t('builder.delete_success'));
        } catch (error) {
            console.error("Failed to delete prompt:", error);
        }
    };

    const sections = [
        { id: 'task', titleKey: 'builder.task_title', descriptionKey: 'builder.task_description', emoji: '🎯', isComplete: !!(task.trim() || selectedPersona) },
        { id: 'context', titleKey: 'builder.context_title', descriptionKey: 'builder.context_description', emoji: '📚', isComplete: !!context.trim() },
        { id: 'references', titleKey: 'builder.references_title', descriptionKey: 'builder.references_description', emoji: '📄', isComplete: !!references.trim() },
    ];
    
    const renderCharacterCount = (length: number) => {
        let color = 'text-text-secondary-light dark:text-text-secondary';
        let message: string | null = null;

        if (length > WARNING_THRESHOLD) {
            color = 'text-red-500 font-medium';
            message = t('builder.warnings.too_long');
        } else if (length > SUGGESTION_THRESHOLD) {
            color = 'text-yellow-500';
            message = t('builder.warnings.getting_long');
        }

        return (
            <div className={`text-xs mt-2 transition-colors duration-300 ${color}`}>
                {message && <p className="mb-1 text-left">{message}</p>}
                <p className="text-right font-mono">{`${length} / ${WARNING_THRESHOLD}`}</p>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-400 dark:to-amber-300">{t('builder.title')}</h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary mt-2">{t('builder.subtitle')}</p>
            </header>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Builder Accordion */}
                <div className="space-y-4">
                    {sections.map((section, index) => {
                        const isOpen = openSection === section.id;
                        return (
                             <Card key={section.id} className="overflow-hidden transition-all duration-300 p-0">
                                <button
                                    className="w-full text-start flex justify-between items-center p-6"
                                    onClick={() => setOpenSection(isOpen ? '' : section.id)}
                                    aria-expanded={isOpen}
                                    aria-controls={`section-content-${section.id}`}
                                >
                                    <div className="flex items-center">
                                        <span className={`flex items-center justify-center h-8 w-8 rounded-full ${section.isComplete ? 'bg-green-500' : 'bg-accent'} text-white font-bold text-sm me-4`}>
                                            {section.isComplete ? <CheckmarkIcon className="h-4 w-4" /> : index + 1}
                                        </span>
                                        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary">
                                            {section.emoji} {t(section.titleKey)}
                                        </h2>
                                    </div>
                                    <span className={`transform transition-transform duration-300 text-2xl ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                                        &#9660;
                                    </span>
                                </button>
                                <div
                                    id={`section-content-${section.id}`}
                                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
                                >
                                    <div className="px-6 pb-6">
                                        <p className="text-text-secondary-light dark:text-text-secondary mb-4">{t(section.descriptionKey)}</p>
                                        {section.id === 'task' && (
                                            <>
                                                <PersonaSelector selectedPersona={selectedPersona} onSelectPersona={setSelectedPersona} />
                                                <div>
                                                    <textarea value={task} onChange={(e) => setTask(e.target.value)} placeholder={t('builder.task_placeholder')} className="w-full h-32 p-3 bg-secondary border border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition-shadow text-text-primary" />
                                                    {renderCharacterCount(task.length)}
                                                </div>
                                                <ExamplesSection
                                                    titleKey="builder.task_examples.title"
                                                    example1Key="builder.task_examples.example1"
                                                    example2Key="builder.task_examples.example2"
                                                    onExampleClick={setTask}
                                                />
                                            </>
                                        )}
                                        {section.id === 'context' && (
                                            <div>
                                                <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder={t('builder.context_placeholder')} className="w-full h-32 p-3 bg-secondary border border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition-shadow text-text-primary" />
                                                {renderCharacterCount(context.length)}
                                                <ExamplesSection
                                                    titleKey="builder.context_examples.title"
                                                    example1Key="builder.context_examples.example1"
                                                    example2Key="builder.context_examples.example2"
                                                    onExampleClick={setContext}
                                                />
                                            </div>
                                        )}
                                        {section.id === 'references' && (
                                            <div>
                                                <textarea value={references} onChange={(e) => setReferences(e.target.value)} placeholder={t('builder.references_placeholder')} className="w-full h-32 p-3 bg-secondary border border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition-shadow text-text-primary" />
                                                {renderCharacterCount(references.length)}
                                                <ExamplesSection
                                                    titleKey="builder.references_examples.title"
                                                    example1Key="builder.references_examples.example1"
                                                    example2Key="builder.references_examples.example2"
                                                    onExampleClick={setReferences}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                             </Card>
                        );
                    })}
                </div>

                {/* Live Preview and Actions */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <Card>
                         <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{t('builder.preview_title')}</h2>
                             <button onClick={handleCopy} disabled={!finalPrompt} className="flex items-center px-3 py-1.5 text-sm bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <ClipboardIcon className={`w-4 h-4 me-2 ${isCopied ? 'text-green-500' : ''}`} />
                                {isCopied ? t('builder.copied') : t('builder.copy')}
                            </button>
                         </div>
                         <pre ref={previewRef} className="mt-2 p-3 min-h-[20rem] overflow-y-auto bg-secondary border border-gray-600 rounded-md text-sm text-text-primary whitespace-pre-wrap font-mono">
                            <code>{finalPrompt || t('builder.preview_placeholder')}</code>
                        </pre>

                        <hr className="my-6 border-gray-200 dark:border-gray-700"/>
                        
                        <div className="space-y-4">
                            <button onClick={handleOpenSaveModal} disabled={isPromptEmpty} className="w-full flex items-center justify-center px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                <SaveIcon className="w-5 h-5 me-2" /> {t('builder.save_prompt')}
                            </button>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleExportTxt} disabled={!finalPrompt} className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-text-primary-light dark:text-text-primary font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50">
                                    <ExportIcon className="w-5 h-5 me-2" /> {t('builder.export_txt')}
                                </button>
                                 <button onClick={handleExportJson} disabled={!finalPrompt} className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-text-primary-light dark:text-text-primary font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50">
                                    <ExportIcon className="w-5 h-5 me-2" /> {t('builder.export_json')}
                                </button>
                            </div>

                             <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-600">
                                <button onClick={() => setIsClearModalOpen(true)} disabled={isPromptEmpty} className="w-full flex items-center justify-center px-4 py-2 border border-red-500/50 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 disabled:border-gray-400 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed">
                                    <ClearIcon className="w-5 h-5 me-2" /> {t('builder.clear_all')}
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2 mt-8">
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4">{t('builder.saved_prompts.title')}</h2>
                        {feedbackMessage && ( <div className="mb-4 p-3 bg-green-500/20 text-green-500 text-center rounded-md animate-fade-in"> {feedbackMessage} </div> )}
                        {savedPrompts.length > 0 ? (
                            <ul className="space-y-3 max-h-96 overflow-y-auto">
                                {savedPrompts.map(prompt => (
                                    <li key={prompt.name} className="flex items-center justify-between p-3 bg-primary-light/50 dark:bg-primary-dark/50 rounded-lg animate-fade-in">
                                        <span className="font-medium text-text-primary-light dark:text-text-primary">{prompt.name}</span>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleLoadPrompt(prompt)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors" title={t('builder.saved_prompts.load')} >
                                                <ExportIcon className="w-5 h-5 transform -rotate-90" />
                                            </button>
                                            <button onClick={() => openDeleteModal(prompt)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors" title={t('builder.saved_prompts.delete')} >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-text-secondary-light dark:text-text-secondary">{t('builder.saved_prompts.empty')}</p>
                        )}
                    </Card>
                </div>
            </div>

            <Modal isOpen={isClearModalOpen} onClose={() => setIsClearModalOpen(false)} title={t('builder.clear_modal.title')}>
                <p className="text-text-secondary-light dark:text-text-secondary">{t('builder.clear_modal.message')}</p>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={() => setIsClearModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-primary-light dark:text-text-primary font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        {t('builder.clear_modal.cancel')}
                    </button>
                    <button onClick={handleClearAll} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                        {t('builder.clear_modal.confirm')}
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title={t('builder.save_modal.title')}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="prompt-name" className="block text-sm font-medium text-text-primary-light dark:text-text-primary"> {t('builder.save_modal.label')} </label>
                        <input type="text" id="prompt-name" value={promptName} onChange={(e) => { setPromptName(e.target.value); if (promptNameError) setPromptNameError(''); }} placeholder={t('builder.save_modal.placeholder')} className="mt-1 w-full p-2 bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none" />
                        {promptNameError && <p className="text-red-500 text-sm mt-1">{promptNameError}</p>}
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-primary-light dark:text-text-primary font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                            {t('builder.save_modal.cancel')}
                        </button>
                        <button onClick={handleSavePrompt} className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors">
                            {t('builder.save_modal.save')}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title={t('builder.delete_modal.title')} >
                <p className="text-text-secondary-light dark:text-text-secondary"> {t('builder.delete_modal.message', { name: promptToDelete?.name || '' })} </p>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-primary-light dark:text-text-primary font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        {t('builder.delete_modal.cancel')}
                    </button>
                    <button onClick={confirmDeletePrompt} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                        {t('builder.delete_modal.confirm')}
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PromptBuilderPage;