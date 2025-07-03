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
import { adminAuth, anyAuthenticatedUser } from "../../middleware/bearAuth";


export const userRouter = Router();

// User routes definition

// Get user by last name (ilike search)
userRouter.get("/users-search",adminAuth, getUserByLastName);

// Get all users
userRouter.get("/users",adminAuth, getUsers);

// Get user by ID
userRouter.get("/users/:id",adminAuth, getUserById);



// Get full user details including bookings/payments
userRouter.get("/users/:id/details",anyAuthenticatedUser, getUserDetails);

// Create a new user
userRouter.post("/users", adminAuth,createUser);


// Update an existing user
userRouter.put("/users/:id",anyAuthenticatedUser, updateUser);

// Delete an existing user
userRouter.delete("/users/:id",anyAuthenticatedUser, deleteUser);


