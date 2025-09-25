import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import { LanguageProvider } from './hooks/useLanguage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LearnPage = React.lazy(() => import('./pages/LearnPage'));
const PracticePage = React.lazy(() => import('./pages/PracticePage'));
const ProgressPage = React.lazy(() => import('./pages/ProgressPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const PromptBuilderPage = React.lazy(() => import('./pages/PromptBuilderPage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const FeedbackPage = React.lazy(() => import('./pages/FeedbackPage'));

const LoadingFallback = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
);

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <div className="flex h-screen bg-primary-light dark:bg-primary">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-0">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />

                      <Route path="/" element={<Navigate to="/home" />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/learn" element={<LearnPage />} />
                      <Route path="/practice" element={<PracticePage />} />
                      <Route path="/builder" element={<PromptBuilderPage />} />
                      <Route path="/chat" element={<ChatPage />} />
                      <Route path="/feedback" element={<FeedbackPage />} />
                      
                      <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </div>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HashRouter>
  );
}