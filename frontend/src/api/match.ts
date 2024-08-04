import http from '@/lib/http';
import { MatchType, RoundType } from '@/schema/match';

const matchApiRequest = {
  getMatch: (id: string) => http.get<MatchType>(`/api/match/${id}/`),
  getRound: (id: string) => http.get<RoundType>(`/api/round/${id}/`),
};

export default matchApiRequest;
