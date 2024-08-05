import http from '@/lib/http';
import { MatchType, RoundListResType, RoundType } from '@/schema/match';

const matchApiRequest = {
  getMatch: (id: string) => http.get<MatchType>(`/api/match/${id}/`),
  getRound: (id: string) => http.get<RoundType>(`/api/round/${id}/`),
  createMatch: (id: string) => http.post<MatchType>(`/api/round/${id}/create_match/`, {}),
  getAllRound: () => http.get<RoundListResType>('/api/round/'),
};

export default matchApiRequest;
