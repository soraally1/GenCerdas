import { useCallback } from 'react';

export function useSound() {
  const playMessageSound = useCallback((type) => {
    const audio = new Audio(
      type === 'sent' 
        ? '/sounds/message-sent.mp3'
        : '/sounds/message-received.mp3'
    );
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }, []);

  return { playMessageSound };
} 