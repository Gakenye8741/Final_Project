import { Router } from "express";
import { createUser, loginUser } from "./auth.controller";

export const authRouter = Router();

// Auth routes definition
// Register a new user
authRouter.post('/auth/register', createUser);

// Login A user
authRouter.post('/auth/login', loginUser); 