import { z } from 'zod';

export const Match = z.object({
  match: z.object({
    id: z.number(),
    type: z.number(),
    testcase: z.number(),
    status: z.string(),
    history: z.object({
      seed: z.string(),
      initial_status: z.string(),
      player_1_points: z.array(z.number()),
      player_2_points: z.array(z.number()),
      status: z.array(z.string()),
    }),
    first_score: z.number(),
    second_score: z.number(),
  }),
});

export type MatchType = z.infer<typeof Match>;

export const RoundRes = z.object({
  id: z.number(),
  tournament: z.string(),
  group: z.number(),
  first_user: z.object({
    id: z.number(),
    username: z.string(),
    first_name: z.string(),
  }),
  second_user: z.object({
    id: z.number(),
    username: z.string(),
    first_name: z.string(),
  }),
  first_submission: z.number(),
  second_submission: z.number(),
  num_match: z.number(),
  first_score: z.number(),
  second_score: z.number(),
  status: z.string(),
});

export const Round = z.object({
  round: RoundRes,
  matchs: z.array(
    z.object({
      id: z.number(),
      type: z.number(),
      testcase: z.number(),
      status: z.string(),
      history: z.object({
        seed: z.string(),
        initial_status: z.string(),
        player_1_points: z.array(z.number()),
        player_2_points: z.array(z.number()),
        status: z.array(z.string()),
      }),
      first_score: z.number(),
      second_score: z.number(),
    })
  ),
});

export type RoundType = z.infer<typeof Round>;

export type RoundResType = z.infer<typeof RoundRes>;

export const RoundListRes = z.object({
  rounds: z.array(RoundRes),
});

export type RoundListResType = z.infer<typeof RoundListRes>;
