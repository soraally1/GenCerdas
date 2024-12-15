import { initializeFirestore } from '../utils/firestoreSetup';

const runSetup = async () => {
  try {
    await initializeFirestore();
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
};

runSetup(); 