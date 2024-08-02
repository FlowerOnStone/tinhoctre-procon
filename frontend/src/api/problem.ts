import http from '@/lib/http';
import { DetailProblemResType } from '@/schema/problem';

const problemsApiRequest = {
  getDetailProblem: (slug: string) => http.get<DetailProblemResType>(`/api/problem/${slug}/`),
};

export default problemsApiRequest;
