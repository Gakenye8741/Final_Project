import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  getUserByLastName,
  getUserDetails
} from "./user.controller";


export const userRouter = Router();

// User routes definition

// Get user by last name (ilike search)
userRouter.get("/users-search", getUserByLastName);

// Get all users
userRouter.get("/users", getUsers);

// Get user by ID
userRouter.get("/users/:id", getUserById);



// Get full user details including bookings/payments
userRouter.get("/users/:id/details", getUserDetails);

// Create a new user
userRouter.post("/users", createUser);

// Update an existing user
userRouter.put("/users/:userId",  updateUser);

// Delete an existing user
userRouter.delete("/users/:id", deleteUser);
