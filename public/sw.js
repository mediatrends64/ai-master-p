
const CACHE_NAME = 'ai-prompt-master-v2';
// List of all files and CDN links to be cached for full offline functionality.
const URLS_TO_CACHE = [
  // Core App Shell
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json',
  '/logo-icon.svg',
  '/robots.txt',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',

  // Core Scripts
  '/index.tsx',
  '/App.tsx',
  '/firebase.ts',
  '/types.ts',

  // Hooks
  '/hooks/useAuth.tsx',
  '/hooks/useLanguage.tsx',
  '/hooks/useTheme.tsx',

  // Services
  '/services/geminiService.ts',
  '/services/feedbackService.ts',

  // Constants
  '/constants.ts',
  '/constants/languages.ts',

  // Pages
  '/pages/HomePage.tsx',
  '/pages/LearnPage.tsx',
  '/pages/PracticePage.tsx',
  '/pages/ProgressPage.tsx',
  '/pages/SettingsPage.tsx',
  '/pages/LoginPage.tsx',
  '/pages/RegisterPage.tsx',
  '/pages/ResetPasswordPage.tsx',
  '/pages/PromptBuilderPage.tsx',
  '/pages/ChatPage.tsx',
  '/pages/FeedbackPage.tsx',

  // Components
  '/components/Card.tsx',
  '/components/Header.tsx',
  '/components/Modal.tsx',
  '/components/PersonaSelector.tsx',
  '/components/ProtectedRoute.tsx',
  '/components/Sidebar.tsx',
  '/components/ThemeSwitcher.tsx',

  // Icons
  '/components/icons/BotIcon.tsx',
  '/components/icons/BuilderIcon.tsx',
  '/components/icons/ChatIcon.tsx',
  '/components/icons/CheckmarkIcon.tsx',
  '/components/icons/ClearIcon.tsx',
  '/components/icons/ClipboardIcon.tsx',
  '/components/icons/ExportIcon.tsx',
  '/components/icons/FeedbackIcon.tsx',
  '/components/icons/GoogleIcon.tsx',
  '/components/icons/HomeIcon.tsx',
  '/components/icons/LearnIcon.tsx',
  '/components/icons/PracticeIcon.tsx',
  '/components/icons/ProgressIcon.tsx',
  '/components/icons/SaveIcon.tsx',
  '/components/icons/SendIcon.tsx',
  '/components/icons/SettingsIcon.tsx',
  '/components/icons/ShareIcon.tsx',
  '/components/icons/TrashIcon.tsx',
  '/components/icons/UserIcon.tsx',
  
  // Translations
  '/translations/en.json',
  '/translations/de.json',
  '/translations/fr.json',
  '/translations/es.json',
  '/translations/ar.json',
  '/translations/zh.json',
  '/translations/vi.json',
  '/translations/fil.json',
  '/translations/ja.json',
  '/translations/hi.json',

  // CDN Dependencies
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react-router-dom@7.9.1',
  'https://aistudiocdn.com/react@19.1.1',
  'https://aistudiocdn.com/recharts@3.2.1',
  'https://aistudiocdn.com/@google/genai@1.20.0',
  'https://aistudiocdn.com/react-dom@19.1.1',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Bypass the HTTP cache to fetch fresh resources during installation
        const requests = URLS_TO_CACHE.map(url => new Request(url, { cache: 'reload' }));
        return cache.addAll(requests);
      })
  );
});

// Use a "Network falling back to cache" strategy
self.addEventListener('fetch', event => {
  // We only want to handle GET requests. Other requests, like POST to an API,
  // should be handled by the browser's default network behavior.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    // 1. Try to fetch from the network
    fetch(event.request)
      .then(networkResponse => {
        // If the network fetch is successful, cache the response and return it
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      })
      .catch(() => {
        // 2. If the network fetch fails (e.g., offline), try to get it from the cache
        return caches.match(event.request).then(cachedResponse => {
          // Return the cached response if it exists, otherwise the fetch will fail
          return cachedResponse;
        });
      })
  );
});


// Update a service worker and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});