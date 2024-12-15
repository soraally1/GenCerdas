import { ref, set } from 'firebase/database';
import { database } from '../config/firebase';

const sampleGroups = {
  group1: {
    name: "Web Development Community",
    description: "A community for web developers to share knowledge and collaborate on projects.",
    category: "Development",
    image: "https://source.unsplash.com/random/800x600/?coding",
    type: "featured",
    memberCount: 150,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    status: "active"
  },
  group2: {
    name: "UI/UX Design Hub",
    description: "Connect with fellow designers, share your work, and get feedback from the community.",
    category: "Design",
    image: "https://source.unsplash.com/random/800x600/?design",
    memberCount: 89,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    status: "active"
  },
  group3: {
    name: "Mobile App Developers",
    description: "Discussion forum for mobile app development across all platforms.",
    category: "Development",
    image: "https://source.unsplash.com/random/800x600/?mobile",
    memberCount: 120,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    status: "active"
  },
  group4: {
    name: "Data Science Network",
    description: "Share insights, tools, and techniques in data science and machine learning.",
    category: "Data Science",
    image: "https://source.unsplash.com/random/800x600/?data",
    memberCount: 95,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    status: "active"
  }
};

export const initializeSampleGroups = async () => {
  try {
    const groupsRef = ref(database, 'groups');
    await set(groupsRef, sampleGroups);
    console.log('Sample groups initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing sample groups:', error);
    return false;
  }
};

export default initializeSampleGroups; 