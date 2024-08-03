import { z } from 'zod';

export const ListTimezone = z.array(
  z.object({
    id: z.number(),
    zone: z.string(),
    location: z.string(),
    offset: z.number(),
    offset_dst: z.number(),
  })
);

export type ListTimezoneType = z.infer<typeof ListTimezone>;

export const ListProgrammingLanguage = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
  })
);

export type ListProgrammingLanguageType = z.infer<typeof ListProgrammingLanguage>;
