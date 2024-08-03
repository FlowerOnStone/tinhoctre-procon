import http from '@/lib/http';
import { ListProblemsResType } from '@/schema/problem';
import { ListTournamentResType, DetailTournamentResType } from '@/schema/tournament';

const tournamentApiRequest = {
  getListTournament: () => http.get<ListTournamentResType>('/api/tournament/'),
  getDetailTournament: (id: string) => http.get<DetailTournamentResType>(`/api/tournament/${id}/`),
  getProblemsByTournament: (id: string) => http.get<ListProblemsResType>(`/api/tournament/${id}/problem/`),
};

export default tournamentApiRequest;
