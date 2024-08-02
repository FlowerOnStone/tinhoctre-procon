'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TournamentBracket from '@/components/bracket/page';
import GeneralTournamentPage from '@/components/tournament/general/page';
import SubmitPage from '@/app/submit/page';
import ParticipantsPage from '@/components/tournament/participants/participants';
import Problems from '@/components/tournament/problems/problems';
import tournamentApiRequest from '@/api/tournament';
import { useEffect, useState } from 'react';
import { DetailTournamentResType } from '@/schema/tournament';

export default function TournamentDetailPage({ params }: { params: { id: string } }) {
  const [tournament, setTournament] = useState<DetailTournamentResType['tournament'] | null>(null);
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await tournamentApiRequest.getDetailTournament(params.id);
        setTournament(res.tournament);
      } catch (error) {
        alert('Failed to fetch tournament detail');
      }
    };
    fetchRequest();
  }, [params.id]);

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-700 mb-4">{tournament?.name}</h1>

      <div className="flex flex-col gap-1 mb-4">
        <div>
          Người tạo:
          {tournament?.creators.map((creator, index) => (
            <span key={index}>&nbsp; {creator}</span>
          ))}
        </div>

        <div>Số lượng group: {tournament?.num_group}</div>

        <div>
          Thời gian đăng ký: {tournament?.start_submission_time} - {tournament?.end_submission_time}
        </div>

        <div>
          Thời gian thi đấu: {tournament?.start_combat_time} - {tournament?.end_combat_time}
        </div>
      </div>

      <Tabs defaultValue="problems">
        <TabsList className="w-full flex justify-start h-12 rounded-none">
          <TabsTrigger value="problems" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Problems
          </TabsTrigger>
          <TabsTrigger value="participants" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Participants
          </TabsTrigger>
          <TabsTrigger value="group" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Group
          </TabsTrigger>
          <TabsTrigger value="bracket" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Bracket
          </TabsTrigger>
          <TabsTrigger value="submission" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Submission
          </TabsTrigger>
        </TabsList>
        <TabsContent value="problems">
          <Problems />
        </TabsContent>
        <TabsContent value="participants">
          <ParticipantsPage />
        </TabsContent>
        <TabsContent value="group">
          <GeneralTournamentPage />
        </TabsContent>
        <TabsContent value="bracket">
          <TournamentBracket />
        </TabsContent>
        <TabsContent value="submission">
          <SubmitPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
