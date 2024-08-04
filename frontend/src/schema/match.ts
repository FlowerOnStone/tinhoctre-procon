import {z} from 'zod'

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
    })
})

export type MatchType = z.infer<typeof Match>