import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { startChat } from '../services/geminiService';
import { Message, SavedChat } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { SendIcon } from '../components/icons/SendIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { BotIcon } from '../components/icons/BotIcon';
import { SaveIcon } from '../components/icons/SaveIcon';
import { ExportIcon } from '../components/icons/ExportIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { ShareIcon } from '../components/icons/ShareIcon';

const LoadingDots = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const ChatPage = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [chatName, setChatName] = useState('');
  const [chatNameError, setChatNameError] = useState('');
  const [chatToDelete, setChatToDelete] = useState<SavedChat | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const chat = useRef<ReturnType<typeof startChat> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chat.current = startChat();
    try {
        const chats = JSON.parse(localStorage.getItem('saved_chats') || '[]').sort((a: SavedChat, b: SavedChat) => a.name.localeCompare(b.name));
        setSavedChats(chats);
    } catch (error) {
        console.error("Failed to load saved chats:", error);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat.current) return;

    const userMessage: Message = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      const stream = await chat.current.sendMessageStream({ message: userMessage.text });
      
      let modelResponse = '';
      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
          return newMessages;
        });
      }

    } catch (err) {
      console.error(err);
      setError(t('chat.error_generic'));
      setMessages(prev => prev.filter((_, i) => i !== prev.length -1)); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const getFormattedChatContent = () => {
    return messages.map(msg => {
        const prefix = msg.role === 'user' ? t('chat.export_format.user') : t('chat.export_format.model');
        return `${prefix}\n${msg.text}\n\n`;
    }).join('');
  };

  const handleExportTxt = () => {
    const chatContent = getFormattedChatContent();
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = messages.length > 0 ? messages[0].text.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'chat';
    link.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.txt`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (messages.length === 0) return;

    const chatContent = getFormattedChatContent();
    const shareData = {
      title: t('chat.share_title'),
      text: chatContent,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing chat:", err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(chatContent);
        showSuccessMessage(t('chat.share_fallback_copied'));
      } catch (err) {
        console.error("Failed to copy chat to clipboard:", err);
      }
    }
  };


  const handleOpenSaveModal = () => {
    setChatName('');
    setChatNameError('');
    setIsSaveModalOpen(true);
  };
  
  const handleSaveChat = () => {
    if (!chatName.trim()) {
      setChatNameError(t('chat.save_modal.error_empty'));
      return;
    }
    try {
      const newChat: SavedChat = { name: chatName.trim(), messages };
      const updatedChats = savedChats.filter(c => c.name !== newChat.name);
      updatedChats.push(newChat);
      updatedChats.sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem('saved_chats', JSON.stringify(updatedChats));
      setSavedChats(updatedChats);
      setIsSaveModalOpen(false);
      showSuccessMessage(t('chat.save_success'));
    } catch (error) {
      console.error("Failed to save chat:", error);
      setChatNameError("Failed to save chat.");
    }
  };

  const handleLoadChat = (chatToLoad: SavedChat) => {
    setMessages(chatToLoad.messages);
    chat.current = startChat(); // Reset chat history in the model
    showSuccessMessage(t('chat.load_success'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const openDeleteModal = (chat: SavedChat) => {
    setChatToDelete(chat);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteChat = () => {
    if (!chatToDelete) return;
    try {
      const updatedChats = savedChats.filter(c => c.name !== chatToDelete.name);
      localStorage.setItem('saved_chats', JSON.stringify(updatedChats));
      setSavedChats(updatedChats);
      setIsDeleteModalOpen(false);
      setChatToDelete(null);
      showSuccessMessage(t('chat.delete_success'));
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };


  return (
    <div className="animate-fade-in">
        <div className="flex flex-col h-full max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-6rem)]">
            <header className="flex justify-between items-start mb-8 flex-shrink-0">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-400 dark:to-amber-300">{t('chat.title')}</h1>
                    <p className="text-lg text-text-secondary-light dark:text-text-secondary mt-2">{t('chat.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    <button onClick={handleShare} disabled={messages.length === 0} className="flex items-center px-3 py-2 text-sm bg-secondary-light dark:bg-secondary border border-gray-300 dark:border-gray-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ShareIcon className="w-4 h-4 me-2" /> {t('chat.share_chat')}
                    </button>
                    <button onClick={handleOpenSaveModal} disabled={messages.length === 0} className="flex items-center px-3 py-2 text-sm bg-secondary-light dark:bg-secondary border border-gray-300 dark:border-gray-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <SaveIcon className="w-4 h-4 me-2" /> {t('chat.save_chat')}
                    </button>
                    <button onClick={handleExportTxt} disabled={messages.length === 0} className="flex items-center px-3 py-2 text-sm bg-secondary-light dark:bg-secondary border border-gray-300 dark:border-gray-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ExportIcon className="w-4 h-4 me-2" /> {t('chat.export_txt')}
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto mb-4 p-4 bg-secondary-light dark:bg-secondary rounded-lg shadow-inner">
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white"><BotIcon className="w-5 h-5" /></div>}
                            <div className={`max-w-xl p-3 rounded-2xl ${
                                msg.role === 'user'
                                    ? 'bg-accent text-white rounded-br-none'
                                    : 'bg-primary-light dark:bg-primary-dark text-text-primary-light dark:text-text-primary rounded-bl-none'
                            }`}>
                                {msg.text ? <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre> : <LoadingDots />}
                            </div>
                            {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white"><UserIcon className="w-5 h-5" /></div>}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="flex-shrink-0">
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                <form onSubmit={handleSubmit} className="relative">
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); } }} placeholder={t('chat.placeholder')} className="w-full resize-none h-12 p-3 pe-12 bg-secondary border border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition-shadow text-text-primary" rows={1} disabled={isLoading} />
                    <button type="submit" disabled={isLoading || !input.trim()} aria-label={t('chat.button_send')} className="absolute end-2.5 bottom-2.5 p-2 bg-accent text-white rounded-full hover:bg-accent-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>

        <div className="mt-8">
            <Card>
                <h2 className="text-2xl font-semibold mb-4">{t('chat.saved_chats.title')}</h2>
                {successMessage && (<div className="mb-4 p-3 bg-green-500/20 text-green-500 text-center rounded-md animate-fade-in">{successMessage}</div>)}
                {savedChats.length > 0 ? (
                    <ul className="space-y-3 max-h-72 overflow-y-auto">
                        {savedChats.map(chatItem => (
                            <li key={chatItem.name} className="flex items-center justify-between p-3 bg-primary-light/50 dark:bg-primary-dark/50 rounded-lg animate-fade-in">
                                <span className="font-medium text-text-primary-light dark:text-text-primary">{chatItem.name}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleLoadChat(chatItem)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors" title={t('chat.saved_chats.load')}>
                                        <ExportIcon className="w-5 h-5 transform -rotate-90" />
                                    </button>
                                    <button onClick={() => openDeleteModal(chatItem)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors" title={t('chat.saved_chats.delete')}>
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-text-secondary-light dark:text-text-secondary">{t('chat.saved_chats.empty')}</p>
                )}
            </Card>
        </div>

        <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title={t('chat.save_modal.title')}>
            <div>
                <label htmlFor="chat-name" className="block text-sm font-medium text-text-primary-light dark:text-text-primary mb-2">{t('chat.save_modal.label')}</label>
                <input type="text" id="chat-name" value={chatName} onChange={(e) => { setChatName(e.target.value); if(chatNameError) setChatNameError(''); }} placeholder={t('chat.save_modal.placeholder')} className="w-full p-2 bg-primary-light/50 dark:bg-primary-dark/50 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-accent focus:outline-none" />
                {chatNameError && <p className="text-red-500 text-sm mt-1">{chatNameError}</p>}
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">{t('chat.save_modal.cancel')}</button>
                    <button onClick={handleSaveChat} className="px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors">{t('chat.save_modal.save')}</button>
                </div>
            </div>
        </Modal>

        <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title={t('chat.delete_modal.title')}>
            <p className="text-text-secondary-light dark:text-text-secondary">{t('chat.delete_modal.message', { name: chatToDelete?.name || '' })}</p>
            <div className="mt-6 flex justify-end gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">{t('chat.delete_modal.cancel')}</button>
                <button onClick={confirmDeleteChat} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">{t('chat.delete_modal.confirm')}</button>
            </div>
        </Modal>
    </div>
  );
};

export default ChatPage;