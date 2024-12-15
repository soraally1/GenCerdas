import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export const addPodcast = async (podcastData) => {
  try {
    const podcastRef = collection(db, 'podcasts');
    const newPodcast = {
      ...podcastData,
      listens: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(podcastRef, newPodcast);
    return docRef.id;
  } catch (error) {
    console.error('Error adding podcast:', error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const categoryRef = collection(db, 'podcast-categories');
    const docRef = await addDoc(categoryRef, categoryData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}; 