import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// User's provided Firebase configuration
const firebaseConfig = {
  apiKey: "",
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
export const db = getFirestore(app);

// Conditionally initialize and export Analytics for browser environments
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then(yes => {
        if (yes) {
            analytics = getAnalytics(app);
        }
    }).catch(err => {
      console.error("Firebase Analytics check failed", err);
    });
}
export { analytics };
