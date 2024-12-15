import { ref, get, set, push, onValue, off } from 'firebase/database';
import { database } from '../config/firebase';

// Groups
export const createGroup = async (groupData) => {
  if (!groupData.name) {
    throw new Error('Group name is required');
  }

  const groupRef = ref(database, 'groups');
  const newGroupRef = push(groupRef);
  
  try {
    const groupPayload = {
      ...groupData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      memberCount: 1, // Start with creator as first member
      members: {
        [groupData.createdBy]: {
          joinedAt: new Date().toISOString(),
          role: 'admin',
          ...groupData.creatorProfile
        }
      },
      status: 'active'
    };

    await set(newGroupRef, groupPayload);

    // Create welcome message for new group
    await sendMessage(newGroupRef.key, {
      content: `👋 Welcome to ${groupData.name}! This group was created by ${groupData.creatorProfile?.name || 'an admin'}.`,
      user: {
        id: 'system',
        name: 'System',
        avatar: '/system-avatar.png'
      },
      type: 'system'
    });

    return newGroupRef.key;
  } catch (error) {
    console.error('Error creating group:', error);
    throw new Error('Failed to create group');
  }
};

export const getGroups = async () => {
  const groupsRef = ref(database, 'groups');
  const snapshot = await get(groupsRef);
  if (!snapshot.exists()) return [];
  
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...data
  }));
};

export const joinGroup = async (groupId, userId, userData) => {
  if (!groupId || !userId) {
    throw new Error('Group ID and User ID are required');
  }

  const groupRef = ref(database, `groups/${groupId}`);
  const userRef = ref(database, `users/${userId}/groups/${groupId}`);
  
  try {
    // Get or create group data
    const groupSnapshot = await get(groupRef);
    let groupData = groupSnapshot.val();

    if (!groupData) {
      // If group doesn't exist, create it
      groupData = {
        name: 'New Group',
        createdAt: new Date().toISOString(),
        memberCount: 0,
        members: {}
      };
    }

    // Update group data
    await set(groupRef, {
      ...groupData,
      memberCount: (groupData.memberCount || 0) + 1,
      members: {
        ...(groupData.members || {}),
        [userId]: {
          joinedAt: new Date().toISOString(),
          ...userData
        }
      },
      lastUpdated: new Date().toISOString()
    });

    // Update user's groups
    await set(userRef, {
      joinedAt: new Date().toISOString(),
      name: groupData.name
    });

    // Send welcome message
    await sendMessage(groupId, {
      content: `👋 ${userData.name || 'A new user'} has joined the group!`,
      user: {
        id: 'system',
        name: 'System',
        avatar: '/system-avatar.png'
      },
      type: 'system'
    });

    return true;
  } catch (error) {
    console.error('Error joining group:', error);
    throw new Error('Failed to join group');
  }
};

// Messages
export const sendMessage = async (groupId, messageData) => {
  const messagesRef = ref(database, `messages/${groupId}`);
  const newMessageRef = push(messagesRef);
  
  try {
    await set(newMessageRef, {
      ...messageData,
      timestamp: new Date().toISOString()
    });
    return newMessageRef.key;
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message');
  }
};

export const subscribeToMessages = (groupId, callback) => {
  const messagesRef = ref(database, `messages/${groupId}`);
  onValue(messagesRef, (snapshot) => {
    const messages = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    callback(messages);
  });

  // Return unsubscribe function
  return () => off(messagesRef);
};

// Users
export const updateUserStatus = async (userId, isOnline) => {
  const userStatusRef = ref(database, `users/${userId}/status`);
  await set(userStatusRef, {
    state: isOnline ? 'online' : 'offline',
    lastChanged: new Date().toISOString()
  });
};

export const subscribeToUserStatus = (callback) => {
  const usersRef = ref(database, 'users');
  onValue(usersRef, (snapshot) => {
    const users = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        users.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
    }
    callback(users);
  });

  return () => off(usersRef);
};

export const updateUserProfile = async (userId, userData) => {
  const userRef = ref(database, `users/${userId}`);
  await set(userRef, {
    ...userData,
    lastUpdated: new Date().toISOString()
  });
};

export const getUserProfile = async (userId) => {
  const userRef = ref(database, `users/${userId}`);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) return null;
  return snapshot.val();
};

export const checkGroupMembership = async (groupId, userId) => {
  if (!groupId || !userId) {
    throw new Error('Group ID and User ID are required');
  }

  try {
    const memberRef = ref(database, `groups/${groupId}/members/${userId}`);
    const snapshot = await get(memberRef);
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking group membership:', error);
    throw new Error('Failed to check group membership');
  }
};

export const getGroupDetails = async (groupId) => {
  if (!groupId) {
    throw new Error('Group ID is required');
  }

  try {
    const groupRef = ref(database, `groups/${groupId}`);
    const snapshot = await get(groupRef);
    console.log('Group snapshot:', snapshot.val());
    
    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: groupId,
      ...snapshot.val()
    };
  } catch (err) {
    console.error('Error getting group details:', err);
    throw new Error('Failed to get group details');
  }
};

export const getGroupMembers = async (groupId) => {
  const membersRef = ref(database, `groups/${groupId}/members`);
  const snapshot = await get(membersRef);
  if (!snapshot.exists()) return [];
  
  return Object.entries(snapshot.val()).map(([id, data]) => ({
    id,
    ...data
  }));
};

export const getAvailableChats = async (userId) => {
  // Get all groups the user is a member of
  const userGroupsRef = ref(database, `users/${userId}/groups`);
  const snapshot = await get(userGroupsRef);
  if (!snapshot.exists()) return [];

  const groups = snapshot.val();
  const availableUsers = new Set();

  // Get all members from these groups
  await Promise.all(
    Object.keys(groups).map(async (groupId) => {
      const members = await getGroupMembers(groupId);
      members.forEach(member => {
        if (member.id !== userId) {
          availableUsers.add(JSON.stringify(member));
        }
      });
    })
  );

  // Convert back to array and parse JSON
  return Array.from(availableUsers).map(user => JSON.parse(user));
};

// Add a new function to leave a group
export const leaveGroup = async (groupId, userId) => {
  if (!groupId || !userId) {
    throw new Error('Group ID and User ID are required');
  }

  const groupRef = ref(database, `groups/${groupId}`);
  const memberRef = ref(database, `groups/${groupId}/members/${userId}`);
  const userGroupRef = ref(database, `users/${userId}/groups/${groupId}`);

  try {
    const groupSnapshot = await get(groupRef);
    if (!groupSnapshot.exists()) {
      throw new Error('Group not found');
    }

    const groupData = groupSnapshot.val();
    
    // Update group data
    await set(groupRef, {
      ...groupData,
      memberCount: Math.max(0, (groupData.memberCount || 1) - 1),
      lastUpdated: new Date().toISOString()
    });

    // Remove member from group
    await set(memberRef, null);
    
    // Remove group from user's groups
    await set(userGroupRef, null);

    return true;
  } catch (error) {
    console.error('Error leaving group:', error);
    throw new Error('Failed to leave group');
  }
};

// Add a function to update group settings
export const updateGroupSettings = async (groupId, userId, updates) => {
  if (!groupId || !userId) {
    throw new Error('Group ID and User ID are required');
  }

  try {
    // Check if user is admin
    const memberRef = ref(database, `groups/${groupId}/members/${userId}`);
    const memberSnapshot = await get(memberRef);
    const memberData = memberSnapshot.val();

    if (!memberData || memberData.role !== 'admin') {
      throw new Error('Only group admins can update group settings');
    }

    const groupRef = ref(database, `groups/${groupId}`);
    const groupSnapshot = await get(groupRef);
    const groupData = groupSnapshot.val();

    if (!groupData) {
      throw new Error('Group not found');
    }

    // Update group settings
    await set(groupRef, {
      ...groupData,
      ...updates,
      lastUpdated: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error updating group settings:', error);
    throw new Error('Failed to update group settings');
  }
};

export const updateGroupInfo = async (groupId, updateData) => {
  if (!groupId) {
    throw new Error('Group ID is required');
  }

  const groupRef = ref(database, `groups/${groupId}`);
  
  try {
    const snapshot = await get(groupRef);
    if (!snapshot.exists()) {
      throw new Error('Group not found');
    }

    const currentData = snapshot.val();
    
    await set(groupRef, {
      ...currentData,
      ...updateData,
      lastUpdated: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error updating group:', error);
    throw new Error('Failed to update group');
  }
};
  