import tournamentApiRequest from '@/api/tournament';
import AddTournamentButton from '@/components/tournament/add-tournament';
import TournamentSearch from '@/components/tournament/tournament-search';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

export default async function TournamentsPage({ searchParams }: { searchParams: { name: string; orderBy: string } }) {
  const { tournaments } = await tournamentApiRequest.getListTournament();
  console.log(tournaments)

  let filteredTournaments = tournaments;
  if (searchParams.name) {
    filteredTournaments = tournaments.filter((tournament) =>
      tournament.name.toLowerCase().includes(searchParams.name.toLowerCase())
    );
  }

  return (
    <div className="flex w-full gap-10">
      <div className="flex-[7] flex flex-col gap-5">
        {filteredTournaments.length !== 0 ? (
          filteredTournaments.map((tournament) => (
            <Link key={tournament.id} href={`/tournaments/${tournament.id}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{tournament.name}</CardTitle>
                  <CardDescription>Mô tả</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <p> Không có cuộc thi nào. </p>
        )}
      </div>
      <div className="flex-[3] relative">
        <div className="sticky top-20 flex flex-col gap-3">
          <TournamentSearch />
          <AddTournamentButton />
        </div>
      </div>
    </div>
  );
}
