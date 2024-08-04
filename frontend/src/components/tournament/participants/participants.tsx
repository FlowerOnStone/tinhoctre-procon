import React, { useState, useEffect } from "react";
import groupsApiRequest from "@/api/group";
import { ParticipantResType } from "@/schema/group";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/app/app-provider";
import tournamentApiRequest from "@/api/tournament";
import { DetailTournamentResType } from "@/schema/tournament";
import challengeApiRequest from "@/api/challenge";
import { useRouter } from 'next/navigation';
import matchApiRequest from "@/api/match";

export default function Participants({ id }: { id: string }) {
  const router = useRouter();
  
  const [participants, setParticipants] = useState<ParticipantResType | null>(
    null
  );
  const [tournament, setTournament] = useState<DetailTournamentResType | null>(null)

  const { user } = useAppContext();
  // console.log("current user", user)

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const participantRes = await groupsApiRequest.getParticipants(id);
        setParticipants(participantRes);
      } catch (error) {
        alert("Failed to fetch participants");
      }
    };
    fetchRequest();
  }, [id]);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const tournamentRes = await tournamentApiRequest.getDetailTournament(id);
        setTournament(tournamentRes)
        
      } catch (error) {
        alert("Failed to fetch tournament");
      }
    };
    fetchRequest();
  }, [id]);

  console.log(tournament)
  const renderCustomTable = () => {
    if (!participants) return null;

    const createChallenge = async (id: number, problem: number) => {
      try {
        console.log(problem)
        await challengeApiRequest.postChallenge({user: id, problem: problem})
      } catch (error) {
        alert("Failed to create challenge");
      }
      window.location.reload()
    }

    const rejectChallenge = async (id: number) => {
      try {
        await challengeApiRequest.updateChallenge(id.toString(), { status: 'REJECT' });
      } catch (error) {
        alert("Failed to reject challenge");
      }
      window.location.reload()
    }
    
    const acceptChallenge = async (id: number) => {
      try {
        const response = await challengeApiRequest.updateChallenge(id.toString(), { status: 'ACCEPT' });
        console.log(response)
        router.replace(`/round/${response.challenge.round}`)
      } catch (error) {
        alert("Failed to accept challenge");
      }
      //window.location.reload()
    }

    const viewRound = async (id: number) => {
      try {
        const response = await matchApiRequest.getRound(id.toString());
        router.replace(`/round/${id}`)
      } catch (error) {
        alert("Failed to view round");
      }
      //window.location.reload()
    }

    const cancelChallenge = async (id: number) => {
      try {
        await challengeApiRequest.updateChallenge(id.toString(), { status: 'CANCEL' });
      } catch (error) {
        alert("Failed to cancel challenge");
      }
      window.location.reload()
    }


    // Split participants into a 2D array with 3 columns and 8 rows
    const rows = [];
    for (let i = 0; i < participants.participants.length; i += 3) {
      rows.push(participants.participants.slice(i, i + 3));
    }
    console.log(participants)
    return (
      <div>
        <h1 className="text-3xl mb-4 mt-8 font-bold">
          Danh sách thí sinh tham gia
        </h1>
        <table className="border-collapse border border-gray-300 w-full">
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((participant, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-4">
                    <div className="flex justify-between items-center">
                      <span>{participant.first_name}</span>
                      <div>
                        {
                          participant.challenge?.status === "I" ? <Button className="border border-gray-300 bg-[#eeeeee] text-black hover:text-white" onClick={()=>viewRound(participant.challenge?.round)}>Xem trận đấu</Button> :
                          (participant.challenge?.first_user === user?.id ? <Button onClick={()=>cancelChallenge(participant.challenge.id)} className="bg-[#FF8B3E]">Hủy thách đấu</Button> : 
                          (
                            participant.challenge?.second_user === user?.id ? 
                            <>
                              <Button onClick={()=>acceptChallenge(participant.challenge.id)} className="bg-[#28a745]">
                                Chấp nhận
                              </Button>
                              <Button onClick={()=>rejectChallenge(participant.challenge.id)} className="ml-2 bg-[#e03444]">
                                Từ chối
                              </Button>
                            </>
                            :
                            (participant.id !== user?.id && tournament?.tournament.problem != undefined ? <Button onClick={()=>createChallenge(participant.id, tournament?.tournament.problem)} className="bg-[#1C81BA]">Thách đấu</Button> : <></>))
              
                          )
                       }
                      </div>
                    </div>
                  </td>
                ))}
                {row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map((_, colIndex) => (
                    <td
                      key={`empty-${colIndex}`}
                      className="border border-gray-300 p-2 text-center"
                    />
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return <div>{renderCustomTable()}</div>;
}
