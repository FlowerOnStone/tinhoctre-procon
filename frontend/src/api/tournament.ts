import http from '@/lib/http';
import { ListTournamentResType, DetailTournamentResType } from '@/schema/tournament';

const tournamentApiRequest = {
  getListTournament: () => http.get<ListTournamentResType>('/api/tournament/'),
  getDetailTournament: (id: string) => http.get<DetailTournamentResType>(`/api/tournament/${id}/`),
};

export default tournamentApiRequest;
