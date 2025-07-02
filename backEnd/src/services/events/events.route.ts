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

export const eventRouter = Router();

// Event routes definition

// Search events by title 
eventRouter.get("/events-search-title", getEventsByTitle);

// Search events by category 
eventRouter.get("/events-search-category", getEventsByCategory);

// Get all events
eventRouter.get("/events", getAllEvents);

// Get event by ID
eventRouter.get("/events/:id", getEventById);

// Create a new event
eventRouter.post("/events", createEvent);

// Update an existing event

eventRouter.put("/events/:eventId", updateEvent);

// Delete an existing event
eventRouter.delete("/events/:id", deleteEvent);