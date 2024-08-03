import { z } from 'zod';

export const UserInGroup = z.object({
  username: z.string(),
  name: z.string(),
  num_round: z.number(),
  win: z.number(),
  draw: z.number(),
  lose: z.number(),
  point: z.number(),
});

export type UserInGroupType = z.infer<typeof UserInGroup>;

export const Group = z.object({
  id: z.number(),
  tournament: z.number(),
  index: z.number(),
  participants: z.array(z.number()),
  status: z.string(),
  summary: z.object({
    user1: UserInGroup,
    user2: UserInGroup,
    user3: UserInGroup,
  }),
});

export type GroupType = z.infer<typeof Group>;

export const ListGroupRes = z.object({
  groups: z.array(Group),
});

export type ListGroupResType = z.infer<typeof ListGroupRes>;

const Round = z.object({
  id: z.number(),
  tournament: z.number(),
  group: z.number(),
  first_user: z.number(),
  second_user: z.number(),
  first_submission: z.number(),
  second_submission: z.number(),
  num_match: z.number(),
  first_score: z.number(),
  second_score: z.number(),
  status: z.string(),
});

export const DetailGroupRes = z.object({
  group: z.object({
    id: z.number(),
    tournament: z.number().nullable(),
    index: z.number(),
    participants: z.array(z.number()),
    status: z.string(),
  }),
  rounds: z.array(Round),
});

export type DetailGroupResType = z.infer<typeof DetailGroupRes>;
