import React, { useState, useEffect } from 'react';

type SquareValue = 'X' | 'O' | null;

interface Move {
  player: number;
  x: number;
  y: number;
}

const initialBoard: SquareValue[] = Array(9).fill(null);

const GameScreen: React.FC<{ moves: Move[] }> = ({ moves }) => {
  const [squares, setSquares] = useState<SquareValue[]>(initialBoard);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);

  useEffect(() => {
    if (currentMoveIndex < moves.length) {
      const intervalId = setInterval(() => {
        updateBoard();
      }, 1000); // Update every second

      return () => clearInterval(intervalId);
    }
  }, [currentMoveIndex, moves]);

  const updateBoard = () => {
    if (currentMoveIndex < moves.length) {
      const move = moves[currentMoveIndex];
      const symbol: SquareValue = move.player === 1 ? 'X' : 'O';
      const index = move.y * 3 + move.x;
      setSquares((prev) => {
        const newBoard = [...prev];
        newBoard[index] = symbol;
        return newBoard;
      });
      setCurrentMoveIndex(currentMoveIndex + 1);
    }
  };

  const renderSquare = (index: number) => (
    <td key={index} style={{ width: '100px', height: '100px', textAlign: 'center', verticalAlign: 'middle', border: '1px solid #999' }}>
      {squares[index]}
    </td>
  );

  return (
    <table style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </tr>
        <tr>
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </tr>
        <tr>
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </tr>
      </tbody>
    </table>
  );
};

export default GameScreen;