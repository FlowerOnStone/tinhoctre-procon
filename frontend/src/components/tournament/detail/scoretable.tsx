import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const matches = [
  {
    match: 'Match 1',
    player_1: 'Player Name 1',
    player_2: 'Player Name 2',
    score_1: 100,
    score_2: 80,
    winner: 'Player Name 1',
  },
  {
    match: 'Match 2',
    player_1: 'Player Name 1',
    player_2: 'Player Name 2',
    score_1: 100,
    score_2: 80,
    winner: 'Player Name 1',
  },
  {
    match: 'Match 3',
    player_1: 'Player Name 1',
    player_2: 'Player Name 2',
    score_1: 100,
    score_2: 80,
    winner: 'Player Name 1',
  },
];

export function ScoreTable() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-10" style={{ textAlign: 'center' }}>Kết quả thi đấu</h1>
      <Table>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.match} className="cursor-pointer">
                <TableCell style={{ color: match.winner === match.player_1 ? 'black' : '#aaaaaa' }}>
                  <Link href="/statusbar" passHref>{match.player_1}</Link>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Link href="/statusbar" passHref>{match.score_1} - {match.score_2}</Link>
                </TableCell>
                <TableCell style={{ color: match.winner === match.player_2 ? 'black' : '#aaaaaa' }} className="text-right">
                  <Link href="/statusbar" passHref>{match.player_2}</Link>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
