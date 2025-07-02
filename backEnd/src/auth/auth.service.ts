import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TInsertUser, TSelectUser, users } from "../drizzle/schema";


// Registering A New User
export const createUserServices = async(user: TInsertUser): Promise<string> =>{
    await db.insert(users).values(user).returning();
    return "User created successfully 🎉";
}

// geting user by email 
export const getUserByEmailServices = async(userEmail: string): Promise<TSelectUser | undefined> =>{
    return await db.query.users.findFirst({
        where: eq(users.email,userEmail)
    })
}