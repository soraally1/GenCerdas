import { db } from '../config/firebase';
import { serverTimestamp, setDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';


// Function to set up user progress
export const setupUserProgress = async (userId, userData) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: serverTimestamp(),
    });
    console.log("User progress initialized successfully");
  } catch (error) {
    console.error("Error setting up user progress:", error);
    throw error;
  }
};


// Function to update play count for a podcast
export const updatePlayCount = async (podcastId) => {
  try {
    const podcastRef = doc(db, 'podcast', podcastId);
    await updateDoc(podcastRef, {
      Played: increment(1),
    });
    console.log('Play count updated');
  } catch (error) {
    console.error('Error updating play count:', error);
    throw error;
  }
};

// Function to perform initial Firestore setup
export const setupFirestore = async (userId) => {
  try {
    if (!userId) {
      throw new Error('userId is required for Firestore setup');
    }

    // Initialize podcast data
    await initializePodcastData(userId);

    // Initialize other data structures if needed
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        stats: {
          completedTasks: 0,
          attendedMeetings: 0,
          totalXP: 0,
          level: 1,
          streak: 0,
          totalMinutesLearned: 0,
          rank: "Pelajar Perunggu",
          nextRankXP: 2000,
          podcastsListened: 0,
          totalPodcastMinutes: 0
        },
        achievements: [],
        recentMilestones: []
      });
    }

    console.log('Firestore setup completed successfully');
  } catch (error) {
    console.error('Error during Firestore setup:', error);
    throw error;
  }
};

const initializePodcastData = async (userId) => {
  try {
    if (!userId) {
      throw new Error('userId is required');
    }

    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();

    // Check if document exists and has podcastData
    if (!userDoc.exists() || !userData || !userData.podcastData) {
      const initialPodcastData = {
        listenedPodcasts: [],
        totalMinutesListened: 0,
        favorites: [],
        lastListened: null,
        achievements: {
          totalPodcasts: 0,
          totalTime: 0,
          streaks: 0,
          categories: []
        }
      };

      await setDoc(userDocRef, {
        podcastData: initialPodcastData
      }, { merge: true });

      return initialPodcastData;
    }

    return userData.podcastData;
  } catch (error) {
    console.error('Error initializing podcast data:', error);
    throw error;
  }
};

export { initializePodcastData };

export default setupUserProgress;
