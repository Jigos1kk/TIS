import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z.string({
        error: 'First Name is required',
    })
        .min(2, 'First Name is too short')
        .max(100, 'First Name is too long')
        .trim(),
    
    lastName: z.string()
        .min(2, 'Last Name is too short')
        .max(100, 'Last Name is too long')
        .trim()
        .optional(),
    
    email: z.string({
        error: 'Email is required',
    })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
    
    password: z.string({
        error: 'Password is required',
    })
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    
    username: z.string({
        error: 'Username is required',
    })
        .min(3, 'Username is too short')
        .max(50, 'Username is too long')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
    
    locale: z.string()
        .length(2, 'Locale must be 2 characters')
        .default('ru')
        .optional(),
    
    timezone: z.string()
        .max(50, 'Timezone is too long')
        .default('Europe/Moscow')
        .optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;