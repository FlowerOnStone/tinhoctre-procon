import http from '@/lib/http';
import { ListSubmissionRes, SubmissionReqType } from './../schema/submission';
import { MessageType } from '@/schema/common';

const submitApiRequest = {
  submitCode: (slug: string, body: SubmissionReqType) => http.post<MessageType>(`api/problem/${slug}/submit/`, body),
  getProblemSubmission: (slug: string) => http.get<ListSubmissionRes>(`api/problem/${slug}/submission/`),
};

export default submitApiRequest;
