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
import { adminAuth, anyAuthenticatedUser } from "../../middleware/bearAuth";

export const bookingRouter = Router();

// Booking routes definition

// Get all bookings
bookingRouter.get("/bookings",adminAuth, getAllBookings);

// Get booking by ID
bookingRouter.get("/bookings/:id",adminAuth, getBookingById);

// Get all bookings for a specific user
bookingRouter.get("/bookings/user/:userId",anyAuthenticatedUser, getBookingsByUserId);

// Get all bookings for a specific event
bookingRouter.get("/bookings/event/:eventId",adminAuth, getBookingsByEventId);

// Create a new booking
bookingRouter.post("/bookings",anyAuthenticatedUser,createBooking);

// Update an existing booking
bookingRouter.put("/bookings/:id",anyAuthenticatedUser ,updateBooking);

// Delete an existing booking
bookingRouter.delete("/bookings/:id",anyAuthenticatedUser, deleteBooking);