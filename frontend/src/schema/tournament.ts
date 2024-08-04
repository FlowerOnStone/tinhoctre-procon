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
    problem: z.number(),
    creators: z.array(z.number()),
    participants: z.array(z.number()),
    num_group: z.number(),
    start_submission_time: z.string(),
    end_submission_time: z.string(),
    start_combat_time: z.string(),
    end_combat_time: z.string(),
    tournament_table: z.object({
      root: z.number(),
      nodes: z.object({
        "1": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "2": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "3": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "4": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "5": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "6": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "7": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "8": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "9": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "10": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "11": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "12": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "13": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "14": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        }),
        "15": z.object({
            parent: z.number(),
            left_child: z.number(),
            right_child: z.number(),
            left_player: z.string(),
            right_player: z.string(),
            left_score: z.number(),
            right_score: z.number(),
            round: z.number(),
            knockout: z.number()
        })
      })
    })
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
