import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TournamentBracket from '@/components/bracket/page';
import GeneralTournamentPage from '@/components/tournament/general/page';
import SubmitPage from '@/app/submit/page';
import ParticipantsPage from '@/components/tournament/participants/participants';
import Problems from '@/components/tournament/problems/problems';
import tournamentApiRequest from '@/api/tournament';

export default async function TournamentDetailPage({ params }: { params: { id: string } }) {
  const { tournament } = await tournamentApiRequest.getDetailTournament(params.id);

  return (
    <div style={{margin: '0px 50px'}}>
      <h1 className="text-4xl font-bold text-gray-700 mb-4">{tournament?.name}</h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 flex justify-between items-center">
        <p className="text-gray-700">Cuộc thi này sẽ được tổ chức vào ngày 2021-01-01</p>
        <button className="text-blue-500 hover:underline">Thêm vào Google Calendar</button>
      </div>

      <h2 className="text-2xl font-bold text-gray-700 mb-4">Mô tả</h2>

      <div className="flex justify-between mb-6">
        <div className="w-2/3 pr-8">
          <p className="mb-4">This is the first tournament</p>
          <p className="mb-4 font-bold">
            The tournament will be held on 2021-01-01. The top 200 contestants will win prizes.
          </p>
          <p className="mb-4">The tournament will be held on 2021-01-01. The top 200 contestants will win prizes.</p>
        </div>

        <div className="w-1/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-yellow-500 mr-2">🏆</span> Phần thưởng
            </h3>
            <table className="w-full">
              <tbody>
                {[
                  { rank: '1st', prize: 5000 },
                  { rank: '2nd', prize: 2500 },
                  { rank: '3rd', prize: 1000 },
                  { rank: 'Participate', prize: 5 },
                ].map((item, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="py-2">{item.rank}</td>
                    <td className="py-2 text-right">{item.prize} $</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Tabs defaultValue="problems">
        <TabsList className="w-full flex justify-start" style={{ height: 50, borderRadius: 0 }}>
          <TabsTrigger value="problems" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Bài toán
          </TabsTrigger>
          <TabsTrigger value="participants" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Thí sinh tham gia
          </TabsTrigger>
          <TabsTrigger value="group" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Vòng bảng
          </TabsTrigger>
          <TabsTrigger value="bracket" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Vòng loại trực tiếp
          </TabsTrigger>
          <TabsTrigger value="submission" className="truncate justify-center min-w-[200px] h-[40px] rounded-none">
            Bài nộp
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
