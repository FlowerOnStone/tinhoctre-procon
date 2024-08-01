import { z } from 'zod';

export const ListTournamentRes = z.object({
  tournaments: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ),
});

export type ListTournamentResType = z.infer<typeof ListTournamentRes>;

export const DetailTournamentRes = z.object({
  tournament: z.object({
    id: z.number(),
    name: z.string(),
    creators: z.array(z.number()),
    participants: z.array(z.number()),
    tournament_table: z.object({
      type: z.string(),
      left: z.string(),
      right: z.string(),
      left_path: z.object({
        type: z.string(),
        left: z.string(),
        right: z.string(),
        left_path: z.object({
          type: z.string(),
          left: z.string(),
          right: z.string(),
          left_path: z.object({
            type: z.string(),
            left: z.string(),
            right: z.string(),
            num_match: z.string(),
            round: z.string(),
          }),
          right_path: z.object({
            type: z.string(),
            left: z.string(),
            right: z.string(),
            num_match: z.string(),
            round: z.string(),
          }),
          num_match: z.string(),
          round: z.string(),
        }),
        right_path: z.object({
          type: z.string(),
          left: z.string(),
          right: z.string(),
          left_path: z.object({
            type: z.string(),
            left: z.string(),
            right: z.string(),
            num_match: z.string(),
            round: z.string(),
          }),
          right_path: z.object({
            type: z.string(),
            left: z.string(),
            right: z.string(),
            num_match: z.string(),
            round: z.string(),
          }),
          num_match: z.string(),
          round: z.string(),
        }),
        num_match: z.string(),
        round: z.string(),
      }),
      right_path: z.object({
        type: z.string(),
        left: z.string(),
        right: z.string(),
        left_path: z.object({
          type: z.string(),
          left: z.string(),
          right: z.string(),
          left_path: z.object({
            type: z.string(),
            left: z.string(),
            right: z.string(),
            num_match: z.string(),
            round: z.string(),
          }),
          right_path: z.object({
            type: z.string(),
            left: z.string(),
            right: z.string(),
            num_match: z.string(),
            round: z.string(),
          }),
          num_match: z.string(),
          round: z.string(),
        }),
        right_path: z.object({
          type: z.string(),
          left: z.string(),
          right: z.string(),
          left_path: z.object({
            type: z.string(),
            left: z.string(),
            right: z.string(),
            num_match: z.string(),
            round: z.string(),
          }),
          right_path: z.object({
            type: z.string(),
            left: z.string(),
            right: z.string(),
            num_match: z.string(),
            round: z.string(),
          }),
          num_match: z.string(),
          round: z.string(),
        }),
        num_match: z.string(),
        round: z.string(),
      }),
      num_match: z.string(),
      round: z.string(),
    }),
    num_group: z.number(),
    start_submission_time: z.string(),
    end_submission_time: z.string(),
    start_combat_time: z.string(),
    end_combat_time: z.string(),
  }),
});

export type DetailTournamentResType = z.infer<typeof DetailTournamentRes>;
