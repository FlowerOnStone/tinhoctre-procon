import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
  } from "@/components/ui/table";
import {  RoundType } from "@/schema/match";
  import Link from "next/link";

  
  interface ScoreTableProps {
    data: RoundType | null; // Accept null for initial state
  }
  
  export function ScoreTable({ data }: ScoreTableProps) {
    if (!data || data.matchs.length === 0) {
      return (
        <div>
          <p className="text-center">Hiện không có trận thi đấu nào.</p>       
        </div>
      
        );
    }
  
    return (
      <div>
        <h1 className="text-2xl font-bold mb-10" style={{ textAlign: 'center' }}>Kết quả thi đấu</h1>
        <Table>
          <TableBody>
            {data.matchs.map((match, index) => (
            <Link href={`/statusbar/${match.id}/`} passHref>
              <div>
                <TableRow key={match.id} className="cursor-pointer hover:bg-[#14518B] transition duration-300 text-black hover:text-white flex">
                  <TableCell
                    className={`${match.status === 'F' ? 'hover:text-white' : 'text-gray-400 hover:text-white'} ${match.status === 'F' ? 'hover:font-bold' : ''} flex-1`}
                  >
                    {data.round.first_user.first_name}
                  </TableCell>
                  <TableCell className="text-center hover:text-white flex-1">
                    {match.status === 'N' ? "Chưa thi đấu" : `${match.first_score} - ${match.second_score}`}
                  </TableCell>
                  <TableCell
                    className={`text-right ${match.status === 'S' ? 'hover:text-white' : 'text-gray-400 hover:text-white'} ${match.status === 'S' ? 'hover:font-bold' : ''} flex-1`}
                  >
                    {data.round.second_user.first_name}
                  </TableCell>
                </TableRow>
              </div>
            </Link>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  