import { z } from 'zod';
import { Round } from './match';

export const Challenge = z.object({
    id: z.number(),
    first_user: z.number(),
    second_user: z.number(),
    status: z.string(),
    round: z.number(),
})

export const ChallengeRes = z.object({
    message: z.string(),
    challenge: Challenge,
})

export const ChallengePost = z.object({
    user: z.number(),
    problem: z.number(),
})

export const ChallengePut = z.object({
    status: z.string()
})

export const ChallengePutRes = z.object({
    message: z.string(),
    challenge: Challenge,
})

export type ChallengePutResType = z.infer<typeof ChallengePutRes>

export type ChallengePutType = z.infer<typeof ChallengePut>

export type ChallengePostType = z.infer<typeof ChallengePost>

export type ChallengeResType = z.infer<typeof ChallengeRes>
