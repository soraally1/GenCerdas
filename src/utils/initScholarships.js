import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { scholarshipData } from '../data/scholarshipData';

export async function initializeScholarships() {
  try {
    const scholarshipsRef = collection(db, 'scholarships');
    
    // Check if scholarships already exist
    const snapshot = await getDocs(scholarshipsRef);
    if (!snapshot.empty) {
      console.log('Scholarships already initialized');
      return;
    }

    // Add all scholarships
    const promises = scholarshipData.map(scholarship => 
      addDoc(scholarshipsRef, {
        ...scholarship,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    );

    await Promise.all(promises);
    console.log('Scholarships initialized successfully');
  } catch (error) {
    console.error('Error initializing scholarships:', error);
  }
} 