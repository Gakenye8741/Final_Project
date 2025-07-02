
import { z } from "zod/v4";

export const UserValidator = z.object({
    userId: z.number().optional(),
    firstName: z.string().min(3).max(15).trim(),
    lastName: z.string().min(3).max(15).trim(),
    email: z.email().trim(),
    password: z.string().min(6).max(15).trim(),
    contactPhone: z.string().min(10).max(15).trim(),
    address: z.string().max(50),
});

export const UserLoginValidator = z.object({
    email: z.email().trim(),
    password: z.string().min(6).max(15).trim(),
})