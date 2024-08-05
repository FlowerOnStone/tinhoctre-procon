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
    '0': UserInGroup,
    '1': UserInGroup,
    '2': UserInGroup,
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
  summary: z.object({
    '0': UserInGroup,
    '1': UserInGroup,
    '2': UserInGroup,
  }),
});

export type DetailGroupResType = z.infer<typeof DetailGroupRes>;

export const Participant = z.object({
  id: z.number(),
  username: z.string(),
  first_name: z.string(),
  challenge: z.object({
    id: z.number(),
    first_user : z.number(),
    second_user : z.number(),
    problem: z.number(),
    status: z.string(),
    round: z.number(),
  })
})

export const ParticipantRes = z.object({
  participants: z.array(Participant),
});

export type ParticipantType = z.infer<typeof Participant>;

export type ParticipantResType = z.infer<typeof ParticipantRes>;

export const CreateGroupReq = z.object({
  groups: z.array(z.array(z.coerce.number())),
  numMatchRoundOf16: z.number(),
  numMatchQuarterFinal: z.number(),
  numMatchSemiFinal: z.number(),
  numMatchFinal: z.number(),
  group_num_match: z.number(),
});

export type CreateGroupReqType = z.infer<typeof CreateGroupReq>;

export type CreateGroupReqBody = {
  groups: number[][];
  num_matchs: number[];
  group_num_match: number;
};
