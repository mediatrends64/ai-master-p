import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// Fix: Use a namespace import for Firebase Analytics to resolve module resolution issues.
import * as firebaseAnalytics from "firebase/analytics";

// User's provided Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-tpK5-b6WehUirWcV0hVoiohm6iSPfWM",
  authDomain: "ai-prompt-m.firebaseapp.com",
  projectId: "ai-prompt-m",
  storageBucket: "ai-prompt-m.appspot.com",
  messagingSenderId: "419404071773",
  appId: "1:419404071773:web:106ba3d21aff8087a21eb4",
  measurementId: "G-VR3QSP0H09"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Conditionally initialize and export Analytics for browser environments
let analytics;
if (typeof window !== 'undefined') {
    // Fix: Call `isSupported` and `getAnalytics` from the imported namespace.
    firebaseAnalytics.isSupported().then(yes => {
        if (yes) {
            analytics = firebaseAnalytics.getAnalytics(app);
        }
    }).catch(err => {
      console.error("Firebase Analytics check failed", err);
    });
}
export { analytics };