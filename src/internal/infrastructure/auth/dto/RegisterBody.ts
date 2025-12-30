import {z} from 'zod';

export const RegisterBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;