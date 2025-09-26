import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FeedbackData {
  rating: number;
  comment: string;
  userId?: string;
  locale?: string;
}

export const submitFeedback = async (feedback: FeedbackData) => {
  try {
    await addDoc(collection(db, 'feedback'), {
      ...feedback,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error writing document to Firestore: ", error);
    throw new Error("Could not submit feedback. Please try again later.");
  }
};
