'use client';
import tournamentApiRequest from '@/api/tournament';
import { DetailTournamentResType } from '@/schema/tournament';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function TournamentBracket({ id }: { id: string }) {
  const [bracket, setBracket] = useState<DetailTournamentResType | null>(null);
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const tournamentBracketRes = await tournamentApiRequest.getDetailTournament(id);
        setBracket(tournamentBracketRes);

        // handle response
      } catch (error) {
        console.log('Hiện tại chưa có bracket.');
      }
    };

    fetchRequest();
  }, [id]);
  console.log(bracket);
  const rows = Array.from({ length: 30 }, (_, index) => index + 1);
  const columns = Array.from({ length: 10 }, (_, index) => `Column ${index + 1}`);
  const round1 = Array.from({ length: 30 }, (_, index) => index).filter((num) => num % 4 === 0 || num % 4 === 1);
  const round2 = [2, 3, 10, 11, 18, 19, 26, 27];
  const round3 = [6, 7, 22, 23];
  const round4 = [14, 15];

  const startIndexRound1 = Array.from({ length: 30 }, (_, index) => index).filter((num) => num % 4 === 0);
  const startIndexRound2 = Array.from({ length: 30 }, (_, index) => index).filter((num) => num % 8 === 2);
  const startIndexRound3 = Array.from({ length: 30 }, (_, index) => index).filter((num) => num % 16 === 6);

  const endIndexRound1 = Array.from({ length: 30 }, (_, index) => index).filter((num) => num % 8 === 2);
  const endIndexRound2 = Array.from({ length: 30 }, (_, index) => index).filter((num) => num % 16 === 6);
  const endIndexRound3 = Array.from({ length: 30 }, (_, index) => index).filter((num) => num % 30 === 14);

  const middleIndexRound1 = Array.from({ length: 30 }, (_, index) => index).filter(
    (num) => num % 8 >= 1 && num % 8 <= 4
  );
  const middleIndexRound2 = Array.from({ length: 30 }, (_, index) => index).filter(
    (num) => num % 16 >= 3 && num % 16 <= 10
  );
  const middleIndexRound3 = Array.from({ length: 30 }, (_, index) => index).filter(
    (num) => num % 30 >= 7 && num % 30 <= 22
  );
  const getCellStyle = (rowIndex: number, colIndex: number) => {
    if (
      (colIndex === 2 && endIndexRound1.includes(rowIndex)) ||
      (colIndex === 5 && endIndexRound2.includes(rowIndex)) ||
      (colIndex === 8 && endIndexRound3.includes(rowIndex))
    ) {
      return {
        padding: '8px',
        border: '',
        borderBottom: '1px solid black',
      };
    }

    if (
      (colIndex === 1 && startIndexRound1.includes(rowIndex)) ||
      (colIndex === 4 && startIndexRound2.includes(rowIndex)) ||
      (colIndex === 7 && startIndexRound3.includes(rowIndex))
    ) {
      return {
        padding: '8px',
        border: '',
        borderBottom: '1px solid black',
        borderRight:
          (colIndex === 1 && middleIndexRound1.includes(rowIndex)) ||
          (colIndex === 4 && middleIndexRound2.includes(rowIndex)) ||
          (colIndex === 7 && middleIndexRound3.includes(rowIndex))
            ? '1px solid black'
            : '',
      };
    } else if (
      (colIndex === 1 && middleIndexRound1.includes(rowIndex)) ||
      (colIndex === 4 && middleIndexRound2.includes(rowIndex)) ||
      (colIndex === 7 && middleIndexRound3.includes(rowIndex))
    ) {
      return {
        padding: '8px',
        border: '',
        borderRight: '1px solid black',
      };
    }

    if (
      (colIndex === 0 && round1.includes(rowIndex)) ||
      (colIndex === 3 && round2.includes(rowIndex)) ||
      (colIndex === 6 && round3.includes(rowIndex)) ||
      (colIndex === 9 && round4.includes(rowIndex))
    ) {
      return {
        padding: '8px',
        border: '1px solid white',
        backgroundColor: '#15518b',
        color: 'white',
        fontWeight: '600',
      };
    }
    return { border: '' };
  };

  const getMatch = (rowIndex: number, colIndex: number) => {
    const round16 = [1, 3, 5, 7, 9, 11, 13, 15];
    const quarterfinal = [2, 6, 10, 14];
    const semifinal = [4, 12];
    const final = [8];

    if (
      (round16.includes(Math.round((rowIndex + 1) / 2)) && colIndex === 0) ||
      (quarterfinal.includes(Math.round((rowIndex + 1) / 2)) && colIndex === 3) ||
      (semifinal.includes(Math.round((rowIndex + 1) / 2)) && colIndex === 6) ||
      (final.includes(Math.ceil((rowIndex + 1) / 2)) && colIndex === 9)
    ) {
      const node =
        bracket?.tournament?.tournament_table?.nodes[
          Math.round((rowIndex + 1) / 2).toString() as keyof typeof bracket.tournament.tournament_table.nodes
        ];

      if (node) {
        if (rowIndex % 2 === 0) {
          return {
            player: node.left_player,
            score: node.left_score === -1 ? '' : node.left_score,
            round: node.round === -1 ? '' : node.round,
          };
        } else {
          return {
            player: node.right_player,
            score: node.right_score === -1 ? '' : node.right_score,
            round: node.round === -1 ? '' : node.round,
          };
        }
      }
    }

    return {
      player: 'N/A',
      score: '',
      round: '',
    }; // Return undefined if no match is found
  };

  return (
    <div>
      <h1 className="text-3xl mb-4 mt-8 font-bold">Vòng loại trực tiếp</h1>
      <div style={{ backgroundColor: '#f1f5f9', padding: '30px 30px' }}>
        {bracket === null ? (
          <p style={{ textAlign: 'center' }}>Hiện tại chưa có bảng vòng loại trực tiếp</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {rows.map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((_, colIndex) => {
                    const style = getCellStyle(rowIndex, colIndex);
                    return (
                      <td
                        onMouseEnter={(e) => {
                          if (style.border !== '') {
                            (e.currentTarget as HTMLTableCellElement).style.backgroundColor = '#ff8b3e';
                            (e.currentTarget as HTMLTableCellElement).style.transition = '0.3s';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (style.border !== '') {
                            (e.currentTarget as HTMLTableCellElement).style.backgroundColor = '#15518b';
                            (e.currentTarget as HTMLTableCellElement).style.transition = '0.3s';
                          }
                        }}
                        key={`${rowIndex}-${colIndex}`}
                        style={style || {}}
                      >
                        <Link href={`/round/${getMatch(rowIndex, colIndex).round}/`}>
                          <span>{style.border !== '' ? getMatch(rowIndex, colIndex).player : ''}</span>
                          <span
                            style={{
                              float: 'right',
                              backgroundColor: 'white',
                              color: 'black',
                              padding: '0px 4px',
                              fontWeight: '800',
                            }}
                          >
                            {style.border !== '' ? getMatch(rowIndex, colIndex).score : ''}
                          </span>
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
