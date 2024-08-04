import http from '@/lib/http';
import { ChallengePostType, ChallengePutResType, ChallengePutType, ChallengeResType } from '@/schema/challenge';

const challengeApiRequest = {
  postChallenge: (body: ChallengePostType) => http.post<ChallengeResType>(`/api/challenge/`, body),
  updateChallenge: (id: string, body: ChallengePutType) => http.put<ChallengePutResType>(`/api/challenge/${id}/`, body)
};

export default challengeApiRequest;
