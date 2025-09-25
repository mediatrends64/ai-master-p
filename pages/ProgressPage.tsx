import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import { useLanguage } from '../hooks/useLanguage';

const moduleProgressData = [
  { name: 'Task', score: 100 },
  { name: 'Context', score: 85 },
  { name: 'Refs', score: 50 },
  { name: 'Eval', score: 20 },
  { name: 'Iterate', score: 0 },
];

const staticAchievements = [
    { key: 'prompt_master', completed: false },
    { key: 'chain_thinker', completed: false },
    { key: 'ai_advocate', completed: true },
    { key: 'contributor', completed: false },
    { key: 'streak_keeper', completed: true },
];

const ProgressPage = () => {
  const { t } = useLanguage();

  const achievements = useMemo(() => staticAchievements.map(ach => ({
    ...ach,
    name: t(`progress.achievements.${ach.key}.name`),
    description: t(`progress.achievements.${ach.key}.description`)
  })), [t]);

  return (
    <div className="animate-fade-in text-text-primary-light dark:text-text-primary">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-400 dark:to-amber-300">{t('progress.title')}</h1>
        <p className="text-lg text-text-secondary-light dark:text-text-secondary mt-2">{t('progress.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-semibold mb-4">{t('progress.mastery_title')}</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={moduleProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="name" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 37, 64, 0.8)',
                    borderColor: '#F97316',
                    color: '#E0E6EB'
                  }}
                  cursor={{ fill: 'rgba(249, 115, 22, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="score" fill="#F97316" name={t('progress.mastery_legend')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-2xl font-semibold mb-4">{t('progress.achievements_title')}</h2>
          <div className="space-y-3">
            {achievements.map((ach) => (
              <div
                key={ach.name}
                className={`flex items-center p-3 rounded-lg ${
                  ach.completed ? 'bg-green-500/10' : 'bg-primary-light/50 dark:bg-primary-dark/50'
                }`}
              >
                <span className={`text-2xl me-4 ${ach.completed ? 'opacity-100' : 'opacity-40'}`}>
                  {ach.completed ? '🏆' : '🏅'}
                </span>
                <div>
                  <h3 className={`font-semibold ${ach.completed ? 'text-green-400' : 'text-text-primary-light dark:text-text-primary'}`}>
                    {ach.name}
                  </h3>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(ProgressPage);