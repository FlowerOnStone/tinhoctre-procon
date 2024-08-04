import { z } from 'zod';

export const SubmissionReq = z.object({
  source: z.string(),
  language: z.coerce.number(),
});

export type SubmissionReqType = z.infer<typeof SubmissionReq>;

export const Submission = z.object({
  id: z.number(),
  submission_time: z.string(),
  user: z.string(),
  problem: z.string(),
  language: z.string(),
  status: z.string(),
});

export type SubmissionType = z.infer<typeof Submission>;

export type ListSubmissionRes = SubmissionType[];

export enum SubmissionStatus {
  'CE' = 'Compile Error',
  'CS' = 'Correct Solution',
  'QU' = 'In Queue',
  'PR' = 'Processing',
}
