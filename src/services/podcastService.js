import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  doc, 
  getDoc, 
  updateDoc, 
  increment, 
  addDoc 
} from 'firebase/firestore';
import { updatePlayCount } from '../utils/firestoreSetup';

const COLLECTION_NAME = 'podcast';

const podcastService = {
  // Get all categories
  getCategories: async () => {
    try {
      const categoriesRef = collection(db, 'CategoryID');
      const querySnapshot = await getDocs(categoriesRef);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async getAllPodcasts() {
    try {
      const podcastsRef = collection(db, 'podcast');
      const q = query(
        podcastsRef, 
        orderBy('CreatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching all podcasts:', error);
      throw error;
    }
  },

  // Get popular podcasts
  getPopularPodcasts: async () => {
    try {
      const podcastsRef = collection(db, 'podcast');
      const q = query(
        podcastsRef,
        where('played', '>', 2),
        orderBy('Played', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching popular podcasts:', error);
      throw error;
    }
  },

  // Get podcast by ID
  getPodcastById: async (id) => {
    try {
      const podcastRef = doc(db, 'podcast', id);
      const podcastDoc = await getDoc(podcastRef);

      if (!podcastDoc.exists()) {
        throw new Error('Podcast not found');
      }

      return {
        id: podcastDoc.id,
        ...podcastDoc.data()
      };
    } catch (error) {
      console.error('Error fetching podcast:', error);
      throw error;
    }
  },

  // Get podcasts by category
  getPodcastsByCategory: async (categoryId) => {
    try {
      const podcastsRef = collection(db, 'podcast'); 
      const q = query(
        podcastsRef,
        where('CategoryID', '==', categoryId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
  
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching podcasts by category:', error);
      throw error;
    }
  },

  // Get podcast audio URL
  getPodcastAudio: async (podcastId) => {
    try {
      const podcastRef = doc(db, 'podcast', podcastId);
      const podcastDoc = await getDoc(podcastRef);

      if (!podcastDoc.exists()) {
        throw new Error('Podcast not found');
      }

      const data = podcastDoc.data();
      if (!data.SoundURL) {
        throw new Error('Audio URL not found for this podcast');
      }

      return data.SoundURL;
    } catch (error) {
      console.error('Error fetching podcast audio:', error);
      throw error;
    }
  },

  // Update listen count
  updateListenCount: async (podcastId) => {
    try {
      const podcastRef = doc(db, 'podcasts', podcastId);
      const podcastDoc = await getDoc(podcastRef);

      if (!podcastDoc.exists()) {
        throw new Error('Podcast not found');
      }

      await updateDoc(podcastRef, {
        listens: increment(1)
      });
    } catch (error) {
      console.error('Error updating listen count:', error);
      throw error;
    }
  },

  addPodcast: async () => {
    try {
      await addDoc(collection(db, 'podcast'), {
        Title: "BasicToefl",
        Description: "Selamat datang di BasicTOEFL Podcast...",
        ImageURL: "https://ibb.co.com/yVsQcdp",
        SoundURL: "",
        CategoryID: "TOEFL",
        Played: 0,
        createdAt: new Date() // Add timestamp
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  },

  // Update play count when podcast is played
  updatePlayCount: async (podcastId) => {
    try {
      await updatePlayCount(podcastId);
    } catch (error) {
      console.error('Error updating play count:', error);
      throw error;
    }
  }
};

export default podcastService; 