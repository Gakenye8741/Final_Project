import { eq, desc, ilike } from "drizzle-orm";
import db from "../../drizzle/db";
import {
  users,
  bookings,
  events,
  venues,
  payments,
  supportTickets,
  TInsertUser,
  TSelectUser,
} from "../../drizzle/schema";

// Get all users
export const getAllUsersService = async (): Promise<TSelectUser[]> => {
  return await db.query.users.findMany({
    orderBy: [desc(users.userId)],
  });
};

// Get user by ID
export const getUserByIdService = async (
  userId: number
): Promise<TSelectUser | undefined> => {
  return await db.query.users.findFirst({
    where: eq(users.userId, userId),
  });
};

// Get user by last name (case-insensitive, partial match)
export const getUserByLastNameService = async (
  lastName: string
): Promise<TSelectUser[]> => {
  return await db.query.users.findMany({
    where: ilike(users.lastName, `%${lastName}%`),
  });
};

// Get full user profile with all related data
export const getUserWithDetailsService = async (userId: number) => {
  return await db.query.users.findFirst({
    where: eq(users.userId, userId),
    with: {
      bookings: {
        with: {
          event: {
            with: {
              venue: true,
            },
          },
          payments: true,
        },
      },
      supportTickets: true,
    },
  });
};

// Create a new user
export const createUserService = async (
  user: TInsertUser
): Promise<string> => {
  await db.insert(users).values(user).returning();
  return "User created successfully ✅";
};

// Update an existing user
export const updateUserService = async (
  userId: number,
  user: Partial<TInsertUser>
): Promise<string> => {
  await db.update(users).set(user).where(eq(users.userId, userId));
  return "User updated successfully 🔄";
};

// Delete user by ID
export const deleteUserService = async (userId: number): Promise<string> => {
  await db.delete(users).where(eq(users.userId, userId));
  return "User deleted successfully ❌";
};
