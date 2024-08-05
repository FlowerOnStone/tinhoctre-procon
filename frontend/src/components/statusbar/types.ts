// src/types.ts
export type SquareValue = 'X' | 'O' | null;

export interface BoardProps {
  squares: SquareValue[];
  currentPlayer: 'X' | 'O';
}
