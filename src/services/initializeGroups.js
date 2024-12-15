import { ref, set } from 'firebase/database';
import { database } from '../config/firebase';

const initialGroups = {
  'beasiswa-hub': {
    name: 'Beasiswa Discussion Hub',
    description: 'Grup diskusi utama untuk berbagi informasi beasiswa, tips aplikasi, dan pengalaman.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800',
    category: 'Scholarship',
    memberCount: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    members: {},
    type: 'featured'
  },
  'scholarship-tips': {
    name: 'Tips & Trik Beasiswa',
    description: 'Berbagi tips dan trik dalam mendapatkan beasiswa impian.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=500',
    category: 'Scholarship',
    memberCount: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    members: {}
  },
  'study-abroad': {
    name: 'Study Abroad Community',
    description: 'Komunitas untuk yang ingin atau sedang menempuh pendidikan di luar negeri.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500',
    category: 'Study Abroad',
    memberCount: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    members: {}
  },
  'research-collab': {
    name: 'Research Collaboration',
    description: 'Tempat diskusi dan kolaborasi untuk penelitian akademik.',
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?q=80&w=500',
    category: 'Research',
    memberCount: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    members: {}
  },
  'campus-life': {
    name: 'Campus Life Stories',
    description: 'Berbagi pengalaman dan cerita seru kehidupan kampus.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=500',
    category: 'Campus Life',
    memberCount: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    members: {}
  }
};

export const initializeGroups = async () => {
  try {
    const groupsRef = ref(database, 'groups');
    await set(groupsRef, initialGroups);

    // Create welcome messages for each group
    for (const groupId of Object.keys(initialGroups)) {
      const messagesRef = ref(database, `messages/${groupId}`);
      const welcomeMessage = {
        content: '👋 Welcome to the group! Feel free to start chatting!',
        user: {
          id: 'system',
          name: 'System',
          avatar: '/system-avatar.png'
        },
        type: 'system',
        timestamp: new Date().toISOString()
      };
      await set(messagesRef, { welcome: welcomeMessage });
    }

    console.log('Groups initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing groups:', error);
    throw error;
  }
}; 