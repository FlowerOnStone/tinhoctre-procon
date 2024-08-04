import { z } from 'zod';

export const Problem = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  public_visible: z.boolean(),
  creator: z.array(z.number()),
  body: z.string(),
  pdf: z.string().nullable(),
  time_limit: z.number(),
  memory_limit: z.number(),
  allow_language: z.string(),
});

export type ProblemType = z.infer<typeof Problem>;

export const DetailProblemRes = z.object({
  problem: Problem,
});

export type DetailProblemResType = z.infer<typeof DetailProblemRes>;

export const ListProblemsRes = z.object({
  problem: Problem,
});

export type ListProblemsResType = z.infer<typeof ListProblemsRes>;

export const ProblemListRes = z.array(
  z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    public_visible: z.boolean(),
  })
);

export type ProblemListResType = z.infer<typeof ProblemListRes>;
