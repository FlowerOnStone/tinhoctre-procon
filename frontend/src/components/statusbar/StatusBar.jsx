"use client"
import Avatar from '../avatar/Avatar';
import React, { useState, useEffect } from 'react';

function getWidth(score) {
  let percentage = 0.5;
  if ((score[0] + score[1]) !== 0) percentage = (score[0]) / (score[0] + score[1]);
  if (percentage > 0.9 || percentage < 0.1) {
    if (percentage > 0.9) percentage = 0.9;
    else percentage = 0.1;
  }
  let width = 100 * percentage;
  return width;
}

const StatusBar = () => {
  const [score, setScore] = useState([0, 0]);
  const [scoreHistory, setScoreHistory] = useState([]); 
  const [width, setWidth] = useState(getWidth(score));
  const [isPlaying, setIsPlaying] = useState(true); 

  useEffect(() => {
    setWidth(getWidth(score));
  }, [score]);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(() => {
        changeScore();
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const changeScore = () => {
    setScoreHistory([...scoreHistory, score]); 
    setScore([Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]);
  };

  const revertScore = () => {
    if (scoreHistory.length > 0) {
      const lastScore = scoreHistory.pop(); 
      setScore(lastScore); 
      setScoreHistory(scoreHistory); 
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying); 
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ margin: '1.7vh 1.7vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', border: '0.2vh solid #424243', borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', margin: '2vh 0' }}>
          <Avatar />

          <div style={{ backgroundColor: '#1c81ba', width: `${width}vh`, height: '4vh', display: 'flex', alignItems: 'center', transition: 'width 0.5s ease' }}>
            <strong style={{ color: '#ffffff', marginLeft: '1.5vh', fontSize: '1.7vh' }}>{score[0]}</strong>
          </div>

          <div style={{ backgroundColor: '#ff883e', width: `${100 - width}vh`, height: '4vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', transition: 'width 0.5s ease' }}>
            <strong style={{ color: '#ffffff', marginRight: '1.5vh', fontSize: '1.7vh' }}>{score[1]}</strong>
          </div>

          <Avatar />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh', width: '100%', backgroundColor: '#eeeeee', color: 'black' }}>
          GameScreen
        </div>

        <div style={{ width: '100%', backgroundColor: '#424243', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '4vh' }}>
          {/* Buttons to change and revert score */}
          <div style={{ display: 'flex' }}>
            <button onClick={revertScore} style={{marginRight: '1rem'}}>
              <p style={{ color: '#ffffff', fontSize: '1.7vh' }}>Revert</p>
            </button>
            <button onClick={togglePlayPause} style={{ marginRight: '1rem' }}>
              <p style={{ color: '#ffffff', fontSize: '1.7vh' }}>{isPlaying ? 'Pause' : 'Play'}</p>
            </button>
            <button onClick={changeScore} >
              <p style={{ color: '#ffffff', fontSize: '1.7vh' }}>Update</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
