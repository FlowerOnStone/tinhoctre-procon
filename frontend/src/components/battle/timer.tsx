"use client"

import { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [time]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '275px', height: '50px', backgroundColor: '#1C81BA' }}>
      {time > 0 ? (
        <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>Thời gian còn lại: {formatTime(time)}</p>
      ) : (
        <p style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>Hết giờ!</p>
      )}
    </div>
  );
};

export default Timer;
