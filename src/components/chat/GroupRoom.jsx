import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ChatInput from './ChatInput';
import { sendMessage, checkGroupMembership, getGroupDetails, getGroupMembers } from '../../services/communityService';
import { ref, onValue, off, set, remove, update } from 'firebase/database';
import { database } from '../../config/firebase';
import PropTypes from 'prop-types';

// Add these CSS classes at the top of your file
const messageStyles = {
  sent: "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-none hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group-hover:scale-[1.02] hover:ring-2 hover:ring-orange-300/50",
  received: "bg-white text-gray-800 rounded-tl-none hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group-hover:scale-[1.02] border border-gray-100 hover:border-orange-200",
  system: "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 font-medium shadow-sm transform hover:-translate-y-0.5 transition-all duration-300 px-6 py-2 rounded-full backdrop-blur-sm",
  image: "p-2 bg-white hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group-hover:scale-[1.02] hover:ring-2 hover:ring-orange-200/50 rounded-2xl",
};

function ImageViewer({ image, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <div className="relative max-w-7xl w-full animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          title="Close (Esc)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Controls */}
        <div className="absolute -top-12 left-0 flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(!isZoomed);
            }}
            className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center gap-2"
            title={isZoomed ? "Zoom Out" : "Zoom In"}
          >
            {isZoomed ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
                <span className="text-sm">Zoom Out</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <span className="text-sm">Zoom In</span>
              </>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(image, '_blank');
            }}
            className="text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 flex items-center gap-2"
            title="Open Original"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="text-sm">Open Original</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white/100 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Image */}
        <div className={`relative overflow-hidden rounded-lg ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <img
            src={image}
            alt="Full size"
            className={`w-full h-auto rounded-lg shadow-2xl transition-all duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
            }`}
            onClick={handleImageClick}
            onLoad={handleImageLoad}
            style={{ maxHeight: '85vh', objectFit: 'contain' }}
          />
        </div>

        {/* Image Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Click to {isZoomed ? 'zoom out' : 'zoom in'} • Press ESC to close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ImageViewer.propTypes = {
  image: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

function GroupRoom() {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [isTyping, setIsTyping] = useState({ userId: null, userName: null });
  const [searchMessages, setSearchMessages] = useState('');
  const [members, setMembers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [memberCount, setMemberCount] = useState(0);
  const [viewingImage, setViewingImage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);

  // Update user's online status and handle presence
  useEffect(() => {
    if (currentUser && groupId) {
      // Set up presence system
      const userStatusRef = ref(database, `groups/${groupId}/onlineMembers/${currentUser.uid}`);
      const connectedRef = ref(database, '.info/connected');

      const handleConnectedChange = (snapshot) => {
        if (snapshot.val() === true) {
          // When we disconnect, remove this device
          set(userStatusRef, true).catch(console.error);
          // Remove the user from online members when they disconnect
          set(userStatusRef, null).catch(console.error);
        }
      };

      onValue(connectedRef, handleConnectedChange);

      // Set initial online status
      set(userStatusRef, true).catch(console.error);

      return () => {
        // Cleanup
        off(connectedRef);
        set(userStatusRef, null).catch(console.error);
      };
    }
  }, [currentUser, groupId]);

  // Check membership and load group details
  useEffect(() => {
    let mounted = true;
    const loadGroupData = async () => {
      if (!currentUser) {
        navigate('/login', { state: { from: `/group/${groupId}` } });
        return;
      }

      try {
        if (!mounted) return;
        setIsLoading(true);
        setError(null);

        // Check membership first
        const isMember = await checkGroupMembership(groupId, currentUser.uid);
        if (!mounted) return;
        
        if (!isMember) {
          setError('You are not a member of this group');
          setIsLoading(false);
          return;
        }

        // Load group details
        const groupDetails = await getGroupDetails(groupId);
        if (!mounted) return;
        
        if (!groupDetails) {
          setError('Group not found');
          setIsLoading(false);
          return;
        }

        setGroupInfo(groupDetails);
        setMemberCount(groupDetails.memberCount || 0);

        // Load group members
        const groupMembers = await getGroupMembers(groupId);
        if (!mounted) return;
        setMembers(groupMembers);

        // Set up real-time listeners
        const onlineMembersRef = ref(database, `groups/${groupId}/onlineMembers`);
        const groupRef = ref(database, `groups/${groupId}`);
        const messagesRef = ref(database, `messages/${groupId}`);

        // Subscribe to online status
        const unsubscribeOnline = onValue(onlineMembersRef, (snapshot) => {
          if (!mounted) return;
          if (snapshot.exists()) {
            setOnlineMembers(Object.keys(snapshot.val()));
          } else {
            setOnlineMembers([]);
          }
        });

        // Subscribe to group updates
        const unsubscribeGroup = onValue(groupRef, (snapshot) => {
          if (!mounted) return;
          const data = snapshot.val();
          if (data) {
            setMemberCount(data.memberCount || 0);
            setGroupInfo(prev => ({ ...prev, ...data }));
          }
        });

        // Subscribe to messages
        const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
          if (!mounted) return;
          const messagesData = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              messagesData.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
            setMessages(messagesData.sort((a, b) => 
              new Date(a.timestamp) - new Date(b.timestamp)
            ));
          } else {
            setMessages([]);
          }
        });

        setIsLoading(false);

        // Cleanup subscriptions
        return () => {
          unsubscribeOnline();
          unsubscribeGroup();
          unsubscribeMessages();
        };
      } catch (err) {
        console.error('Error accessing group:', err);
        if (mounted) {
          setError(err.message || 'Failed to access group');
          setIsLoading(false);
        }
      }
    };

    loadGroupData();

    return () => {
      mounted = false;
    };
  }, [groupId, currentUser, navigate]);

  // Update the message read tracking
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollToBottom(!isNearBottom);

      // Mark messages as read when scrolled to bottom
      if (isNearBottom) {
        setUnreadCount(0);
      }
    }
  };

  // Update auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current && !searchMessages) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const shouldScroll = scrollHeight - scrollTop - clientHeight < 100;

      if (shouldScroll) {
        chatContainerRef.current.scrollTop = scrollHeight;
        setUnreadCount(0);
      }
    }
  }, [messages, searchMessages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setUnreadCount(0);
    }
  };

  const handleSendMessage = async (messageData) => {
    if (!currentUser) return;

    try {
      const timestamp = new Date().toISOString();
      const messageContent = {
        type: messageData.type,
        content: messageData.content,
        user: {
          id: currentUser.uid,
          name: currentUser.displayName || 'Anonymous',
          avatar: currentUser.photoURL || '/default-avatar.png'
        },
        timestamp
      };

      await sendMessage(groupId, messageContent);
      
      // Clear typing indicator
      setIsTyping({ userId: null, userName: null });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Scroll to bottom after sending message
      scrollToBottom();
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    }
  };

  const handleTyping = () => {
    setIsTyping({
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Anonymous'
    });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping({ userId: null, userName: null });
    }, 2000);
  };

  const filteredMessages = messages.filter(message => {
    const searchTerm = searchMessages.toLowerCase();
    
    // Handle different message types
    switch (message.type) {
      case 'text':
        return message.content.toLowerCase().includes(searchTerm) ||
               message.user?.name?.toLowerCase().includes(searchTerm);
      
      case 'image':
        return message.user?.name?.toLowerCase().includes(searchTerm);
      
      case 'mixed':
        return message.content.text.toLowerCase().includes(searchTerm) ||
               message.user?.name?.toLowerCase().includes(searchTerm);
      
      case 'system':
        return message.content.toLowerCase().includes(searchTerm);
      
      default:
        return false;
    }
  });

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleImageClick = (imageUrl) => {
    setViewingImage(imageUrl);
  };

  const handleDeleteMessage = async (messageId) => {
    if (!currentUser) return;
    
    try {
      const messageRef = ref(database, `messages/${groupId}/${messageId}`);
      await remove(messageRef);
      
      // Add system message about deletion
      const systemMessage = {
        type: 'system',
        content: `${currentUser.displayName} deleted a message`,
        timestamp: new Date().toISOString()
      };
      await sendMessage(groupId, systemMessage);
    } catch (err) {
      console.error('Failed to delete message:', err);
      setError('Failed to delete message');
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    if (!currentUser) return;
    
    try {
      const messageRef = ref(database, `messages/${groupId}/${messageId}`);
      await update(messageRef, {
        content: newContent,
        edited: true,
        editedAt: new Date().toISOString()
      });
      
      setEditingMessage(null);
    } catch (err) {
      console.error('Failed to edit message:', err);
      setError('Failed to edit message');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFB827] via-[#FF9636] to-[#FF8144] p-4 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading chat room...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFB827] via-[#FF9636] to-[#FF8144] p-4 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-800 mb-4">{error}</p>
          <button
            onClick={() => navigate('/komunitas')}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all transform hover:scale-105"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFB827] via-[#FF9636] to-[#FF8144] p-4">
      {viewingImage && (
        <ImageViewer
          image={viewingImage}
          onClose={() => setViewingImage(null)}
        />
      )}
      
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl h-[85vh] flex mt-24 border border-white/20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative z-10">
          {/* Group Header */}
          <div className="p-4 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                  {groupInfo?.image ? (
                    <img 
                      src={groupInfo.image} 
                      alt={groupInfo.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-500/20 group-hover:ring-orange-500/50 transition-all duration-300 transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center ring-2 ring-orange-500/20 group-hover:ring-orange-500/50 transition-all duration-300 transform group-hover:scale-105">
                      <span className="text-2xl text-orange-500 font-semibold">
                        {groupInfo?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-green-400 to-green-500 w-5 h-5 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] text-white font-medium shadow-lg transform group-hover:scale-110 transition-transform">
                    {onlineMembers.length}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-orange-500 transition-colors flex items-center gap-2">
                    {groupInfo?.name || 'Loading...'}
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-medium">
                      {memberCount} members
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1 text-green-500">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      {onlineMembers.length} online now
                    </span>
                    <span>•</span>
                    <span className="text-gray-400">
                      Last active {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMembers(!showMembers)}
                  className={`p-2.5 rounded-xl transition-all relative group ${
                    showMembers 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'hover:bg-orange-50 text-gray-600 hover:text-orange-500'
                  }`}
                  title="Toggle Members"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100">
                    {memberCount}
                  </span>
                </button>
                <button
                  onClick={() => navigate('/komunitas')}
                  className="p-2.5 hover:bg-red-50 rounded-xl transition-all text-gray-600 hover:text-red-500 hover:rotate-90 transform duration-300"
                  title="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Messages */}
            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in conversation..."
                  value={searchMessages}
                  onChange={(e) => setSearchMessages(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm bg-white/50 backdrop-blur-sm transition-all placeholder:text-gray-400"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchMessages && (
                  <button
                    onClick={() => setSearchMessages('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            onScroll={handleScroll}
          >
            {filteredMessages.map((message, index) => {
              const showDate = index === 0 || 
                formatMessageDate(message.timestamp) !== formatMessageDate(filteredMessages[index - 1].timestamp);
              const isFirstInGroup = index === 0 || 
                message.user?.id !== filteredMessages[index - 1].user?.id;
              const isLastInGroup = index === filteredMessages.length - 1 || 
                message.user?.id !== filteredMessages[index + 1].user?.id;
              
              return (
                <div key={message.id} className="animate-fadeIn">
                  {showDate && (
                    <div className="flex items-center justify-center my-6">
                      <div className="bg-orange-50 text-orange-600 px-4 py-1 rounded-full text-sm font-medium shadow-sm">
                        {formatMessageDate(message.timestamp)}
                      </div>
                    </div>
                  )}
                  <div className={`flex items-start gap-3 group ${
                    message.type === 'system' 
                      ? 'justify-center' 
                      : message.user?.id === currentUser?.uid 
                        ? 'flex-row-reverse' 
                        : ''
                  } ${!isFirstInGroup ? 'mt-1' : 'mt-4'}`}>
                    {message.type === 'system' ? (
                      <div className={messageStyles.system}>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <>
                        {isFirstInGroup && (
                          <div className="relative group animate-fadeIn">
                            {message.user.avatar ? (
                              <img
                                src={message.user.avatar}
                                alt={message.user.name}
                                className="w-8 h-8 rounded-full ring-2 ring-white/80 group-hover:ring-orange-500/20 transition-all transform group-hover:scale-110 hover:rotate-6"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 ring-2 ring-white/80 group-hover:ring-orange-500/20 transition-all transform group-hover:scale-110 hover:rotate-6 flex items-center justify-center">
                                <span className="text-sm font-semibold text-orange-500">
                                  {message.user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            {onlineMembers.includes(message.user.id) && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white animate-pulse"></div>
                            )}
                          </div>
                        )}
                        <div className={`flex flex-col ${
                          message.user.id === currentUser?.uid ? 'items-end' : ''
                        }`}>
                          {isFirstInGroup && (
                            <div className="flex items-center gap-2 mb-1 animate-fadeIn">
                              <span className="text-sm font-medium text-gray-800 hover:text-orange-500 transition-colors cursor-default">
                                {message.user.name}
                              </span>
                              <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-default">
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {message.edited && (
                                <span className="text-xs text-gray-400 italic hover:text-orange-400 transition-colors cursor-default">
                                  (edited)
                                </span>
                              )}
                            </div>
                          )}
                          <div className="relative group animate-fadeIn">
                            <div className={`px-4 py-2 rounded-2xl max-w-md transition-all duration-200 backdrop-blur-sm relative group ${
                              message.type === 'image' || message.type === 'mixed' 
                                ? messageStyles.image
                                : message.user.id === currentUser?.uid
                                  ? messageStyles.sent
                                  : messageStyles.received
                            } ${
                              !isFirstInGroup && message.user.id === currentUser?.uid 
                                ? 'rounded-tr-xl' 
                                : ''
                            } ${
                              !isFirstInGroup && message.user.id !== currentUser?.uid 
                                ? 'rounded-tl-xl' 
                                : ''
                            } mt-2`}>
                              {message.type === 'mixed' ? (
                                <div className="space-y-2">
                                  <div className="relative group overflow-hidden rounded-xl">
                                    <img 
                                      src={message.content.image} 
                                      alt="Shared image"
                                      className="max-w-sm rounded-xl cursor-zoom-in hover:scale-[1.02] transition-transform duration-300"
                                      onClick={() => handleImageClick(message.content.image)}
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-sm">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageClick(message.content.image);
                                          }}
                                          className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all transform hover:scale-110"
                                          title="View full size"
                                        >
                                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                          </svg>
                                        </button>
                                        {message.user.id === currentUser?.uid && (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Are you sure you want to delete this message?')) {
                                                  handleDeleteMessage(message.id);
                                                }
                                              }}
                                              className="p-2 bg-white/20 hover:bg-red-500/60 rounded-full transition-all transform hover:scale-110"
                                              title="Delete message"
                                            >
                                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                              </svg>
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="relative group">
                                    {message.user.id === currentUser?.uid && (
                                      <div className="absolute -right-16 top-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-row items-start gap-1 pt-1">
                                        <button
                                          onClick={() => setEditingMessage(message)}
                                          className="p-2 rounded-lg bg-white hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-all hover:scale-105 shadow-md hover:shadow-orange-500/20 flex items-center gap-1"
                                          title="Edit message"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                          </svg>
                                          <span className="text-xs">Edit</span>
                                        </button>
                                        <button
                                          onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this message?')) {
                                              handleDeleteMessage(message.id);
                                            }
                                          }}
                                          className="p-2 rounded-lg bg-white hover:bg-red-50 text-gray-600 hover:text-red-500 transition-all hover:scale-105 shadow-md hover:shadow-red-500/20 flex items-center gap-1"
                                          title="Delete message"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          <span className="text-xs">Delete</span>
                                        </button>
                                      </div>
                                    )}
                                    <p className={`whitespace-pre-wrap break-words px-2 pb-1 ${
                                      message.user.id === currentUser?.uid ? 'text-white' : 'text-gray-800'
                                    }`}>
                                      {message.content.text}
                                    </p>
                                  </div>
                                </div>
                              ) : message.type === 'image' ? (
                                <div className="relative group overflow-hidden rounded-xl">
                                  <img 
                                    src={message.content} 
                                    alt="Shared image"
                                    className="max-w-sm rounded-xl cursor-zoom-in hover:scale-[1.02] transition-transform duration-300"
                                    onClick={() => handleImageClick(message.content)}
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleImageClick(message.content);
                                        }}
                                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all transform hover:scale-110"
                                        title="View full size"
                                      >
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                      </button>
                                      {message.user.id === currentUser?.uid && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this message?')) {
                                              handleDeleteMessage(message.id);
                                            }
                                          }}
                                          className="p-2 bg-white/20 hover:bg-red-500/60 rounded-full transition-all transform hover:scale-110"
                                          title="Delete message"
                                        >
                                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : editingMessage?.id === message.id ? (
                                <div className="min-w-[200px] relative">
                                  <div className="absolute -top-6 left-0 text-xs text-gray-500 flex items-center gap-2">
                                    <span className="flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                      Editing message
                                    </span>
                                  </div>
                                  <textarea
                                    autoFocus
                                    defaultValue={message.content}
                                    className="w-full p-3 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-800 text-sm resize-none shadow-sm"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleEditMessage(message.id, e.target.value);
                                      } else if (e.key === 'Escape') {
                                        setEditingMessage(null);
                                      }
                                    }}
                                    onBlur={(e) => {
                                      if (e.target.value !== message.content) {
                                        handleEditMessage(message.id, e.target.value);
                                      } else {
                                        setEditingMessage(null);
                                      }
                                    }}
                                  />
                                  <div className="mt-2 flex items-center justify-between text-xs">
                                    <div className="text-gray-400 flex items-center gap-2">
                                      <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Press Enter to save
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Esc to cancel
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => setEditingMessage(null)}
                                        className="px-2 py-1 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={(e) => handleEditMessage(message.id, e.target.previousSibling.previousSibling.value)}
                                        className="px-2 py-1 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative group">
                                  {message.user.id === currentUser?.uid && (
                                    <div className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-row items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full p-1 shadow-lg">
                                      <button
                                        onClick={() => setEditingMessage(message)}
                                        className="p-1.5 rounded-full hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-all hover:scale-105 flex items-center gap-1"
                                        title="Edit message"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span className="text-xs">Edit</span>
                                      </button>
                                      <div className="w-px h-4 bg-gray-200"></div>
                                      <button
                                        onClick={() => {
                                          if (window.confirm('Are you sure you want to delete this message?')) {
                                            handleDeleteMessage(message.id);
                                          }
                                        }}
                                        className="p-1.5 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-500 transition-all hover:scale-105 flex items-center gap-1"
                                        title="Delete message"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span className="text-xs">Delete</span>
                                      </button>
                                    </div>
                                  )}
                                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {isLastInGroup && !isFirstInGroup && (
                            <span className="text-xs text-gray-400 mt-1 hover:text-gray-600 transition-colors cursor-default animate-fadeIn">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {isTyping.userId && (
              <div className={`flex items-center gap-3 px-4 py-2 animate-fadeIn ${
                isTyping.userId === currentUser?.uid ? 'justify-end' : 'justify-start'
              }`}>
                {isTyping.userId !== currentUser?.uid && (
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center ring-2 ring-white/80">
                      <span className="text-sm font-semibold text-orange-500">
                        {isTyping.userName?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                  </div>
                )}
                <div className={`bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 ${
                  isTyping.userId === currentUser?.uid ? 'bg-orange-50' : ''
                }`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {isTyping.userId === currentUser?.uid ? 'You are typing...' : `${isTyping.userName} is typing...`}
                  </span>
                </div>
                {isTyping.userId === currentUser?.uid && (
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center ring-2 ring-white/80">
                      <span className="text-sm font-semibold text-orange-500">
                        {isTyping.userName?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Scroll to Bottom Button */}
          {showScrollToBottom && (
            <div className="absolute bottom-24 right-8 animate-fadeIn">
              <button
                onClick={scrollToBottom}
                className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all group relative hover:scale-110"
                title="Scroll to bottom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}
          
          {/* Input */}
          <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
            <ChatInput
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
              isLoading={isLoading}
              placeholder="Type your message..."
            />
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-72 border-l border-gray-200 bg-white/50 backdrop-blur-sm overflow-y-auto animate-slideInRight">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">Members</h3>
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm font-medium">
                  {memberCount}
                </span>
              </div>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/90 transition-all duration-300 group hover:shadow-md">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 ring-2 ring-white/80 group-hover:ring-orange-500/20 transition-all transform group-hover:scale-110 hover:rotate-6 flex items-center justify-center">
                        <span className="text-lg font-semibold text-orange-500">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {onlineMembers.includes(member.id) && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-orange-500 transition-colors">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {onlineMembers.includes(member.id) ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-green-600">Online</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            <span>Offline</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupRoom; 