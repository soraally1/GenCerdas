import { useState, useEffect } from 'react';

const INITIAL_MESSAGE = {
  type: 'ai',
  content: 'Hai! Apa yang bisa aku bantu hari ini? Jika kamu membutuhkan bantuan mengenai beasiswa baik di dalam maupun luar negeri, aku siap membantu! 😊',
  timestamp: new Date().toISOString()
};

export function useChat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage?.type === 'ai') {
      setIsAiTalking(true);
      const content = lastMessage.content;
      let currentIndex = 0;
      
      setDisplayedContent(content.charAt(0));
      currentIndex = 1;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(prev => prev + content.charAt(currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsAiTalking(false);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [chatHistory]);

  const sendMessage = async (userMessage) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const recentMessages = chatHistory.slice(-5).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: [
            {
              role: "system",
              content: `Kamu adalah G'Gon, asisten AI spesialis beasiswa yang ramah dan membantu...`
            },
            ...recentMessages,
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9,
          frequency_penalty: 0.3,
          presence_penalty: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(response.status === 429 
          ? 'Terlalu banyak permintaan. Mohon tunggu beberapa saat dan coba lagi.'
          : `Error: ${response.status}`
        );
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Format respons tidak valid');
      }

      return data.choices[0].message.content;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    message,
    setMessage,
    chatHistory,
    setChatHistory,
    isLoading,
    isAiTalking,
    displayedContent,
    error,
    sendMessage
  };
} 