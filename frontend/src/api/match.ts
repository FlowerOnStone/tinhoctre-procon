import http from '@/lib/http';
import { MatchType } from '@/schema/match';

const matchApiRequest = {
  getMatch: (id: string) => http.get<MatchType>(`/api/match/${id}/`),
};

export default matchApiRequest;
