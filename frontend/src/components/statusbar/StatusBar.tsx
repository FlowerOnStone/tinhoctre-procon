"use client"
import React, { useState, useEffect, useRef } from 'react';
import Avatar from '../avatar/Avatar';
import GameScreen from './gamescreen';
import { MatchType } from '@/schema/match';
import matchApiRequest from '@/api/match';

export default function StatusBar({ id }: { id: string }) {
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [scoreHistory, setScoreHistory] = useState<[number, number][]>([]);
  const [width, setWidth] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const [match, setMatch] = useState<MatchType | null>(null);
  const [moves, setMoves] = useState<{ player: number; x: number; y: number }[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0); // Index to keep track of current move
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(0); // Index for player points

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const matchRes = await matchApiRequest.getMatch(id);
        setMatch(matchRes);

        // Set initial score based on the last value in player_1_points and player_2_points
        const player1Points = matchRes.match.history.player_1_points;
        const player2Points = matchRes.match.history.player_2_points;

        const latestPlayer1Score = player1Points[player1Points.length - 1];
        const latestPlayer2Score = player2Points[player2Points.length - 1];
        
        setScore([latestPlayer1Score, latestPlayer2Score]);
        setWidth(getWidth([latestPlayer1Score, latestPlayer2Score]));

        const generatedMoves = matchRes.match.history.status.map((entry) => {
          const [playerStr, xStr, yStr] = entry.split(' ');
          return { player: parseInt(playerStr, 10), x: parseInt(xStr, 10), y: parseInt(yStr, 10) };
        });
        setMoves(generatedMoves);

      } catch (error) {
        console.error('Failed to fetch match', error);
      }
    };
    fetchRequest();
  }, [id]);

  useEffect(() => {
    setWidth(getWidth(score));
  }, [score]);

  useEffect(() => {
    if (isPlaying) {
      intervalIdRef.current = setInterval(() => {
        if (
  (match?.match.history.player_1_points?.length ?? 0) > currentPointIndex &&
  (match?.match.history.player_2_points?.length ?? 0) > currentPointIndex
) {
          changeScore();
        } else {
          clearInterval(intervalIdRef.current!);
          intervalIdRef.current = null;
          setIsPlaying(false); // Stop playing when points are exhausted
        }
      }, 1000);
    } else if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isPlaying, currentPointIndex, match]);

  const getWidth = (score: [number, number]): number => {
    let percentage = 0.5;
    if ((score[0] + score[1]) !== 0) percentage = (score[0]) / (score[0] + score[1]);
    if (percentage > 0.9 || percentage < 0.1) {
      percentage = percentage > 0.9 ? 0.9 : 0.1;
    }
    return 100 * percentage;
  };

  const changeScore = () => {
    if (match) {
      const player1Points = match.match.history.player_1_points;
      const player2Points = match.match.history.player_2_points;

      // Update score based on the current point index
      const newScore: [number, number] = [player1Points[currentPointIndex], player2Points[currentPointIndex]];
      
      setScoreHistory([...scoreHistory, score]);
      setScore(newScore);
      setCurrentPointIndex(currentPointIndex + 1); // Move to the next point
    }
  };

  const revertScore = () => {
    if (scoreHistory.length > 0) {
      const lastScore = scoreHistory[scoreHistory.length - 1];
      console.log('Reverting to score:', lastScore);
      setScore(lastScore);
      setScoreHistory(scoreHistory.slice(0, -1)); // Remove the last item from history
    } else {
      console.log('No history to revert to');
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
          <GameScreen moves={moves} />
        </div>

        <div style={{ width: '100%', backgroundColor: '#424243', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '4vh' }}>
          <div style={{ display: 'flex' }}>
            <button onClick={revertScore} style={{ marginRight: '1rem' }}>
              <p style={{ color: '#ffffff', fontSize: '1.7vh' }}>Revert</p>
            </button>
            <button onClick={togglePlayPause} style={{ marginRight: '1rem' }}>
              <p style={{ color: '#ffffff', fontSize: '1.7vh' }}>{isPlaying ? 'Pause' : 'Play'}</p>
            </button>
            <button onClick={changeScore}>
              <p style={{ color: '#ffffff', fontSize: '1.7vh' }}>Update</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
