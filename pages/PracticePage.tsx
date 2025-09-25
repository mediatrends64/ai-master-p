import React, { useState } from 'react';
import Card from '../components/Card';
import { analyzePrompt } from '../services/geminiService';
import { PromptAnalysis, Persona } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import PersonaSelector from '../components/PersonaSelector';
import { LANGUAGES } from '../constants/languages';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-accent animate-pulse"></div>
        <div className="w-4 h-4 rounded-full bg-accent animate-pulse delay-75"></div>
        <div className="w-4 h-4 rounded-full bg-accent animate-pulse delay-150"></div>
    </div>
);


const AnalysisResult: React.FC<{ analysis: PromptAnalysis }> = ({ analysis }) => {
    const { t, locale } = useLanguage();
    const scoreColor = analysis.score >= 80 ? 'text-green-500' : analysis.score >= 50 ? 'text-yellow-500' : 'text-red-500';
    
    return (
        <Card className="mt-6 animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">{t('practice.results_title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <div className="flex flex-col items-center justify-center bg-primary-light/50 dark:bg-primary-dark/50 p-4 rounded-lg">
                    <span className={`text-5xl font-bold ${scoreColor}`}>{analysis.score}</span>
                    <span className="text-text-secondary-light dark:text-text-secondary">{t('practice.score')}</span>
                 </div>
                 <div className="md:col-span-2 space-y-4">
                    <div>
                        <h4 className="font-semibold text-lg text-green-500">{t('practice.strengths')}</h4>
                        <ul className="list-disc list-inside text-text-secondary-light dark:text-text-secondary">
                            {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold text-lg text-yellow-500">{t('practice.improvements')}</h4>
                        <ul className="list-disc list-inside text-text-secondary-light dark:text-text-secondary">
                            {analysis.improvements.map((i, idx) => <li key={idx}>{i}</li>)}
                        </ul>
                    </div>
                 </div>
            </div>
            
            <div>
                <h4 className="font-semibold text-lg text-accent">{t('practice.improved_prompt')}</h4>
                <pre className="mt-2 p-3 bg-primary-light/50 dark:bg-primary-dark/50 rounded-md text-sm text-text-primary-light dark:text-text-primary whitespace-pre-wrap font-mono">
                    <code>{analysis.rewrittenPrompt}</code>
                </pre>
            </div>
            
            {locale !== 'en' && analysis.translatedRewrittenPrompt && (
                <div className="mt-6">
                    <h4 className="font-semibold text-lg text-accent">{t('practice.translated_prompt_title')}</h4>
                    <pre className="mt-2 p-3 bg-primary-light/50 dark:bg-primary-dark/50 rounded-md text-sm text-text-primary-light dark:text-text-primary whitespace-pre-wrap font-mono">
                        <code>{analysis.translatedRewrittenPrompt}</code>
                    </pre>
                </div>
            )}
        </Card>
    );
};


const PracticePage = () => {
    const [prompt, setPrompt] = useState('');
    const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
    const [analysis, setAnalysis] = useState<PromptAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t, locale } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let finalPrompt = prompt.trim();

        if (!finalPrompt) {
            setError(t('practice.error_empty'));
            return;
        }

        if (selectedPersona) {
            const personaText = `Act as a ${selectedPersona.englishName}.`;
            finalPrompt = `${personaText}\n\n${finalPrompt}`;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        try {
            const lang = LANGUAGES.find(l => l.code === locale);
            const languageName = lang ? lang.name : 'English';
            const result = await analyzePrompt(finalPrompt, languageName, locale);
            setAnalysis(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-400 dark:to-amber-300">{t('practice.title')}</h1>
                <p className="text-lg text-text-secondary-light dark:text-text-secondary mt-2">{t('practice.subtitle')}</p>
            </header>
            <Card>
                <form onSubmit={handleSubmit}>
                    <PersonaSelector
                        selectedPersona={selectedPersona}
                        onSelectPersona={setSelectedPersona}
                    />
                    <label htmlFor="prompt-input" className="block text-lg font-medium text-text-primary-light dark:text-text-primary mb-2">
                        {t('practice.label')}
                    </label>
                    <textarea
                        id="prompt-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('practice.placeholder')}
                        className="w-full h-40 p-3 bg-secondary border border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition-shadow text-text-primary"
                        disabled={isLoading}
                    />
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 w-full md:w-auto px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 transform hover:scale-[1.02] active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? <LoadingSpinner /> : t('practice.button_analyze')}
                    </button>
                </form>
            </Card>

            {analysis && <AnalysisResult analysis={analysis} />}
        </div>
    );
};

export default PracticePage;