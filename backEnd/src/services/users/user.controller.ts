import { Request, Response } from "express";
import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  getUserByLastNameService,
  getUserWithDetailsService,
  updateUserService
} from "./user.service";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await getAllUsersService();
    if (!allUsers || allUsers.length === 0) {
      res.status(404).json({ message: "No users found" });
    } else {
      res.status(200).json(allUsers);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }
  try {
    const user = await getUserByIdService(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user" });
  }
};

// Get user by last name (partial match, case-insensitive)
export const getUserByLastName = async (req: Request, res: Response) => {
  const lastName = req.query.lastName as string;

    if (!lastName) {
         res.status(400).json({ error: "Missing lastName query parameter" });
         return;
    }

    try {
        const users = await getUserByLastNameService(lastName);
        if (!users || users.length === 0) {
             res.status(404).json({ message: "No users found with that last name" });
             return;
        }

        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message || "Error searching users" });
    }
};

// Get full user profile with all related data
export const getUserDetails = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }
  try {
    const userDetails = await getUserWithDetailsService(userId);
    if (!userDetails) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(userDetails);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch user details" });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const result = await createUserService({ firstName, lastName, email, password });
    res.status(201).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create user" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const result = await updateUserService(userId, { firstName, lastName, email, password });
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update user" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }
  try {
    const result = await deleteUserService(userId);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
};
