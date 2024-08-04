import { z } from 'zod';

export const LoginBody = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(2, {
    message: '',
  }),
});

export type LoginBodyType = z.infer<typeof LoginBody>;

export const RegisterBody = z
  .object({
    username: z.string(),
    password: z.string().min(8, {
      message: '',
    }),
    confirmPassword: z.string().min(8, {
      message: '',
    }),
    email: z.string().email({
      message: '',
    }),
    first_name: z.string().min(2, {
      message: '',
    }),
    last_name: z.string(),
    preferred_language: z.coerce.number(),
    timezone: z.coerce.number(),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: '',
        path: ['confirmPassword'],
      });
    }
  });

export type RegisterBodyType = z.infer<typeof RegisterBody>;

export const User = z.object({
  id: z.number(),
  username: z.string(),
  first_name: z.string(),
  is_admin: z.boolean(),
});

export type UserType = z.infer<typeof User>;

export const LoginRes = z.object({
  user: User,
  token: z.string(),
  is_admin: z.boolean(),
});

export type LoginResType = z.infer<typeof LoginRes>;

export type RegisterResType = LoginResType;

export const UserRes = z.object({
  id: z.number(),
  username: z.string(),
  first_name: z.string(),
});

export type UserResType = z.infer<typeof UserRes>;

export type UserListResType = UserResType[];
