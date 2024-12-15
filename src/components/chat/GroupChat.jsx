import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ChatInput from './ChatInput';
import { sendMessage, subscribeToMessages, getGroupDetails } from '../../services/communityService';

function GroupChat() {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
        const details = await getGroupDetails(groupId);
        setGroupInfo(details);
      } catch (err) {
        console.error('Failed to load group details:', err);
        setError('Failed to load group information');
      }
    };

    loadGroupInfo();
  }, [groupId]);

  useEffect(() => {
    // Subscribe to messages
    const unsubscribe = subscribeToMessages(groupId, (newMessages) => {
      setMessages(newMessages.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      ));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && !searchQuery) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, searchQuery]);

  const handleSendMessage = async (content, emoji = null) => {
    if ((!content.trim() && !emoji) || isLoading) return;

    setIsLoading(true);
    try {
      const messageContent = emoji || content;
      await sendMessage(groupId, {
        content: messageContent,
        user: {
          id: currentUser.uid,
          name: currentUser.displayName || 'Anonymous',
          avatar: currentUser.photoURL || '/images/default-avatar.jpg'
        },
        replyTo: replyTo ? {
          id: replyTo.id,
          content: replyTo.content,
          user: replyTo.user.name
        } : null
      });
      setReplyTo(null);
      setShowEmoji(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFB827] via-[#FF9636] to-[#FF8144] p-4">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {groupInfo?.image && (
                <img
                  src={groupInfo.image}
                  alt={groupInfo?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {groupInfo?.name || 'Group Chat'}
                </h2>
                <p className="text-sm text-gray-500">
                  {groupInfo?.memberCount || 0} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-600"
                title="Emoji"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
          {/* Search Messages */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search in conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.user.id === currentUser.uid ? 'flex-row-reverse' : ''
              }`}
            >
              <img
                src={message.user.avatar}
                alt={message.user.name}
                className="w-8 h-8 rounded-full ring-2 ring-white"
              />
              <div className={`flex flex-col ${
                message.user.id === currentUser.uid ? 'items-end' : ''
              }`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-gray-800 text-sm">
                    {message.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {message.replyTo && (
                  <div className={`mt-1 px-3 py-1 rounded-lg text-sm ${
                    message.user.id === currentUser.uid
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-xs text-gray-500">
                      Reply to {message.replyTo.user}
                    </p>
                    <p className="line-clamp-1">{message.replyTo.content}</p>
                  </div>
                )}
                <div className={`mt-1 px-4 py-2 rounded-lg max-w-md group relative ${
                  message.user.id === currentUser.uid
                    ? 'bg-orange-500 text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  <p>{message.content}</p>
                  <button
                    onClick={() => handleReply(message)}
                    className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${
                      message.user.id === currentUser.uid ? '-left-8' : '-right-8'
                    }`}
                  >
                    <svg className="w-5 h-5 text-gray-500 hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span>Someone is typing...</span>
            </div>
          )}
        </div>
        
        {/* Reply Preview */}
        {replyTo && (
          <div className="px-4 py-2 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-500">
                    Reply to {replyTo.user.name}
                  </p>
                  <p className="text-sm text-gray-800 line-clamp-1">
                    {replyTo.content}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReplyTo(null)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="p-4 border-t bg-white/50">
          <ChatInput
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            isLoading={isLoading}
            placeholder={replyTo ? `Reply to ${replyTo.user.name}...` : "Type your message..."}
            showEmoji={showEmoji}
          />
        </div>
      </div>
    </div>
  );
}

export default GroupChat; 