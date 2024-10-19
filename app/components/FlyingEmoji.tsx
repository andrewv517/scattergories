import React, { useEffect, useState } from 'react';

interface FlyingEmojiProps {
  emoji: string;
  duration?: number; // Duration of the flight in milliseconds (default: 3 seconds)
}

const FlyingEmoji = ({ emoji, duration = 3000 }: FlyingEmojiProps) => {
  const [visible, setVisible] = useState(true);
  const offset = Math.floor(Math.random() * 100) - 50;

  useEffect(() => {
    // Set a timeout to hide the emoji after it finishes flying
    const timer = setTimeout(() => {
      setVisible(false); // Set visible to false to remove the emoji
    }, duration);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) {
    return null; // Component will be removed from DOM when visible is false
  }

  return (
    <span
      className="flying-emoji"
      style={{
        position: 'absolute',
        bottom: '0px',
        left: `calc(50% + ${offset}px)`,
        animation: `flyUpAndWiggle ${duration}ms ease-out forwards`,
        fontSize: '2rem',
      }}
    >
      {emoji}
    </span>
  );
};

export default FlyingEmoji;
