import { useRef, useEffect } from 'react';
import IdleAnimation from '../assets/animation/Idle.mp4';
import TalkAnimation from '../assets/animation/Talk.mp4';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import Mascot from '../components/chat/Mascot';
import ErrorMessage from '../components/chat/ErrorMessage';
import { useChat } from '../hooks/useChat';
import { useSound } from '../hooks/useSound';

function AiChat() {
  const {
    message,
    setMessage,
    chatHistory,
    setChatHistory,
    isLoading,
    isAiTalking,
    displayedContent,
    error,
    sendMessage
  } = useChat();

  const { playMessageSound } = useSound();
  const chatContainerRef = useRef(null);
  const shouldScrollRef = useRef(true);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (shouldScrollRef.current && chatContainerRef.current) {
      const scrollToBottom = () => {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      };

      // Delay scroll to account for content rendering
      requestAnimationFrame(scrollToBottom);
    }
  }, [chatHistory, displayedContent]);

  const handleScroll = (e) => {
    const element = e.target;
    const isScrolledNearBottom = 
      element.scrollHeight - element.scrollTop - element.clientHeight < 100;
    shouldScrollRef.current = isScrolledNearBottom;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');
    
    // Add user message with timestamp
    setChatHistory(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);
    
    playMessageSound('sent');

    try {
      const aiResponse = await sendMessage(userMessage);
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        content: aiResponse,
        timestamp: new Date().toISOString()
      }]);
      playMessageSound('received');
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        content: error.message || 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFB827] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 min-h-screen flex flex-col justify-center relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 pt-12 md:pt-20">
          {/* Chat Container */}
          <div className="w-full md:w-1/2 max-w-2xl md:sticky md:top-8">
            <div 
              className="bg-white/90 backdrop-blur-lg rounded-[32px] shadow-2xl p-6 h-[600px] flex flex-col relative overflow-hidden border border-white/20 transform hover:scale-[1.02] transition-all duration-300"
              role="region"
              aria-label="Chat conversation"
            >
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white to-transparent z-10 flex items-center px-6">
                <h2 className="text-xl font-semibold text-gray-800">Chat with G&apos;Gon</h2>
              </div>

              {/* Messages Container */}
              <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto space-y-6 p-4 pt-16 pb-4 scrollbar-thin scrollbar-thumb-orange-500/50 hover:scrollbar-thumb-orange-500 scrollbar-track-transparent"
                style={{ maxHeight: "calc(100% - 80px)" }}
              >
                {chatHistory.map((chat, index) => (
                  <ChatMessage
                    key={`${chat.timestamp || index}-${chat.type}`}
                    message={chat}
                    isLatest={index === chatHistory.length - 1}
                    displayedContent={displayedContent}
                  />
                ))}
                
                {isLoading && (
                  <div className="flex items-center space-x-3 p-4 bg-white/80 rounded-2xl shadow-lg w-fit animate-pulse">
                    {[0, 1, 2].map((i) => (
                      <div 
                        key={i}
                        className={`w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce ${
                          i > 0 ? `delay-${i}00` : ''
                        }`} 
                        role="presentation"
                      />
                    ))}
                  </div>
                )}

                {error && <ErrorMessage message={error} />}
              </div>

              {/* Input Container with gradient background */}
              <div className="relative mt-4 bg-gradient-to-t from-white via-white to-transparent pt-6">
                <ChatInput
                  message={message}
                  setMessage={setMessage}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Mascot Container */}
          <div className="w-full md:w-1/2 lg:w-[45%] flex justify-center items-center md:sticky md:top-8">
            <div className="relative w-full max-w-[500px] aspect-square p-8">
              <Mascot
                isAiTalking={isAiTalking}
                IdleAnimation={IdleAnimation}
                TalkAnimation={TalkAnimation}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiChat; 