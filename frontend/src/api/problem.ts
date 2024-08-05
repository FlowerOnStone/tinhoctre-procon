import http from '@/lib/http';
import { DetailProblemResType, ProblemListResType } from '@/schema/problem';

const problemsApiRequest = {
  getDetailProblem: (slug: string) => http.get<DetailProblemResType>(`/api/problem/${slug}/`),
  getProblems: () => http.get<ProblemListResType>('/api/problem/'),
};

export default problemsApiRequest;
