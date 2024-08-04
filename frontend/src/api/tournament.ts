import http from '@/lib/http';
import { MessageType } from '@/schema/common';
import { ListProblemsResType } from '@/schema/problem';
import { ListTournamentResType, DetailTournamentResType } from '@/schema/tournament';

const tournamentApiRequest = {
  getListTournament: () => http.get<ListTournamentResType>('/api/tournament/', { cache: 'no-store' }),
  getDetailTournament: (id: string) => http.get<DetailTournamentResType>(`/api/tournament/${id}/`),
  getProblemsByTournament: (id: string) => http.get<ListProblemsResType>(`/api/tournament/${id}/problem/`),
  createTournament: (data: FormData) => http.post<MessageType>('/api/tournament/', data),
};

export default tournamentApiRequest;
