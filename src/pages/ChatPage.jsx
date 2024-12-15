import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AiChat from './AiChat';

function ChatPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to AiChat component
    navigate('/ai-chat');
  }, [navigate]);

  return <AiChat />;
}

export default ChatPage; 