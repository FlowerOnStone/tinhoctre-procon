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

const isPowerOfTwo = (n: number): boolean => {
  if (n <= 0) return false;
  return (n & (n - 1)) === 0;
};

export const CreateTournamentForm = z.object({
  name: z.string(),
  num_group: z.coerce
    .number()
    .int()
    .positive({
      message: 'Số lượng nhóm phải là số nguyên dương',
    })
    .refine(isPowerOfTwo, {
      message: 'Số lượng nhóm phải là lũy thừa của 2',
    }),
  participants: z.array(z.number()),
  problem: z.number(),
  start_submission_time: z.date(),
  end_submission_time: z.date(),
  start_combat_time: z.date(),
  end_combat_time: z.date(),
});

export type CreateTournamentFormType = z.infer<typeof CreateTournamentForm>;
