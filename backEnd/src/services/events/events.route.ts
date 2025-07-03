import { Router } from "express";
import {
  getAllEvents,
  getEventById,
  getEventsByTitle,
  getEventsByCategory,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./events.controller"; 
import { adminAuth, anyAuthenticatedUser } from "../../middleware/bearAuth";

export const eventRouter = Router();

// Event routes definition

// Search events by title 
eventRouter.get("/events-search-title", getEventsByTitle);

// Search events by category 
eventRouter.get("/events-search-category", getEventsByCategory);

// Get all events
eventRouter.get("/events", getAllEvents);

// Get event by ID
eventRouter.get("/events/:id",anyAuthenticatedUser, getEventById);

// Create a new event
eventRouter.post("/events",adminAuth, createEvent);

// Update an existing event

eventRouter.put("/events/:id",adminAuth, updateEvent);

// Delete an existing event
eventRouter.delete("/events/:id", deleteEvent);