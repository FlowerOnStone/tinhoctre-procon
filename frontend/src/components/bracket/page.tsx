"use client";
import Link from "next/link";
import React from "react";

const TournamentBracket: React.FC = () => {
  const data = {
    round1: {
      game1: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game2: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game3: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game4: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game5: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game6: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game7: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game8: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
    },

    round2: {
      game1: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game2: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game3: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game4: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
    },

    round3: {
      game1: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
      game2: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
    },

    round4: {
      game1: {
        player1: {
          name: "Player 1",
          score: 10,
        },
        player2: {
          name: "Player 2",
          score: 8,
        },
      },
    },
  };

  const rows = Array.from({ length: 30 }, (_, index) => index + 1);
  const columns = Array.from(
    { length: 10 },
    (_, index) => `Column ${index + 1}`
  );
  const round1 = Array.from({ length: 30 }, (_, index) => index).filter(
    (num) => num % 4 === 0 || num % 4 === 1
  );
  const round2 = [2, 3, 10, 11, 18, 19, 26, 27];
  const round3 = [6, 7, 22, 23];
  const round4 = [13, 14];

  const startIndexRound1 = Array.from(
    { length: 30 },
    (_, index) => index
  ).filter((num) => num % 4 === 0);
  const startIndexRound2 = Array.from(
    { length: 30 },
    (_, index) => index
  ).filter((num) => num % 8 === 2);
  const startIndexRound3 = Array.from(
    { length: 30 },
    (_, index) => index
  ).filter((num) => num % 16 === 6);

  const endIndexRound1 = Array.from({ length: 30 }, (_, index) => index).filter(
    (num) => num % 8 === 2
  );
  const endIndexRound2 = Array.from({ length: 30 }, (_, index) => index).filter(
    (num) => num % 16 === 6
  );
  const endIndexRound3 = Array.from({ length: 30 }, (_, index) => index).filter(
    (num) => num % 30 === 13
  );

  const middleIndexRound1 = Array.from(
    { length: 30 },
    (_, index) => index
  ).filter((num) => num % 8 >= 1 && num % 8 <= 4);
  const middleIndexRound2 = Array.from(
    { length: 30 },
    (_, index) => index
  ).filter((num) => num % 16 >= 3 && num % 16 <= 10);
  const middleIndexRound3 = Array.from(
    { length: 30 },
    (_, index) => index
  ).filter((num) => num % 30 >= 7 && num % 30 <= 22);
  const getCellStyle = (rowIndex: number, colIndex: number) => {
    if (
      (colIndex === 2 && endIndexRound1.includes(rowIndex)) ||
      (colIndex === 5 && endIndexRound2.includes(rowIndex)) ||
      (colIndex === 8 && endIndexRound3.includes(rowIndex))
    ) {
      return {
        padding: "8px",
        border: "",
        borderBottom: "1px solid black",
      };
    }

    if (
      (colIndex === 1 && startIndexRound1.includes(rowIndex)) ||
      (colIndex === 4 && startIndexRound2.includes(rowIndex)) ||
      (colIndex === 7 && startIndexRound3.includes(rowIndex))
    ) {
      return {
        padding: "8px",
        border: "",
        borderBottom: "1px solid black",
        borderRight:
          (colIndex === 1 && middleIndexRound1.includes(rowIndex)) ||
          (colIndex === 4 && middleIndexRound2.includes(rowIndex)) ||
          (colIndex === 7 && middleIndexRound3.includes(rowIndex))
            ? "1px solid black"
            : "",
      };
    } else if (
      (colIndex === 1 && middleIndexRound1.includes(rowIndex)) ||
      (colIndex === 4 && middleIndexRound2.includes(rowIndex)) ||
      (colIndex === 7 && middleIndexRound3.includes(rowIndex))
    ) {
      return {
        padding: "8px",
        border: "",
        borderRight: "1px solid black",
      };
    }

    if (
      (colIndex === 0 && round1.includes(rowIndex)) ||
      (colIndex === 3 && round2.includes(rowIndex)) ||
      (colIndex === 6 && round3.includes(rowIndex)) ||
      (colIndex === 9 && round4.includes(rowIndex))
    ) {
      return {
        padding: "8px",
        border: "1px solid white",
        backgroundColor: "#15518b",
        color: "white",
        fontWeight: "600",
      };
    }
    return { border: "" };
  };

  const getMatch = (rowIndex: number, colIndex: number) => {
    if (colIndex === 1) {
    }
    return "";
  };

  return (
    <div>
      <h1 className="text-3xl mb-4 mt-8 font-bold">Vòng loại trực tiếp</h1>
      <div style={{backgroundColor: '#f1f5f9', padding: '30px 30px'}}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {rows.map((_, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((_, colIndex) => {
                const style = getCellStyle(rowIndex, colIndex);
                return (
                  <>
                  
                    <td
                      onMouseEnter={(e) => {
                        if (style.border !== "") {
                          ( e.currentTarget as HTMLTableCellElement ).style.backgroundColor = "#ff8b3e";
                          ( e.currentTarget as HTMLTableCellElement ).style.transition = '0.3s'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (style.border !== "") {
                          ( e.currentTarget as HTMLTableCellElement ).style.backgroundColor = "#15518b";
                          ( e.currentTarget as HTMLTableCellElement ).style.transition = '0.3s'
                        }
                      }}
                      key={`${rowIndex}-${colIndex}`}
                      style={style || {}}
                    >
                      <Link href={'/statusbar'}>
                      <span>
                        {style.border !== ""  ? `Row ${rowIndex}, Col ${colIndex + 1}` : ""}
                      </span>
                      <span style={{float: 'right', backgroundColor: 'white', color: 'black', padding: '0px 4px', fontWeight: '800'}}>
                        {style.border !== ""  ? 10 : ""}
                      </span>
                      </Link>
                    </td>
                    
                  </>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TournamentBracket;
