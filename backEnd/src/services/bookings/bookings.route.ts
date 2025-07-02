// routes/booking.routes.ts

import { Router } from "express";
import {
  getAllBookings,
  getBookingById,
  getBookingsByUserId,
  getBookingsByEventId,
  createBooking,
  updateBooking,
  deleteBooking,
} from "./bookings.controller"; 

export const bookingRouter = Router();

// Booking routes definition

// Get all bookings
bookingRouter.get("/bookings", getAllBookings);

// Get booking by ID
bookingRouter.get("/bookings/:id", getBookingById);

// Get all bookings for a specific user
bookingRouter.get("/bookings/user/:userId", getBookingsByUserId);

// Get all bookings for a specific event
bookingRouter.get("/bookings/event/:eventId", getBookingsByEventId);

// Create a new booking
bookingRouter.post("/bookings", createBooking);

// Update an existing booking
bookingRouter.put("/bookings/:id", updateBooking);

// Delete an existing booking
bookingRouter.delete("/bookings/:id", deleteBooking);