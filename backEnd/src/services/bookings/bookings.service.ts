

import { eq, desc } from "drizzle-orm";
import db from "../../drizzle/db";
import {
  bookings,
  users,
  events,
  payments,
  TInsertBooking,
  TSelectBooking,
  bookingStatusEnum
} from "../../drizzle/schema";

// Get all bookings
export const getAllBookingsService = async (): Promise<TSelectBooking[]> => {
  return await db.query.bookings.findMany({
    orderBy: [desc(bookings.createdAt)],
    with: {
      user: true,
      event: true,
      payments: true,
    },
  });
};

// Get booking by ID
export const getBookingByIdService = async (
  bookingId: number
): Promise<TSelectBooking | undefined> => {
  return await db.query.bookings.findFirst({
    where: eq(bookings.bookingId, bookingId),
    with: {
      user: true,
      event: true,
      payments: true,
    },
  });
};

// Get bookings by User ID
export const getBookingsByUserIdService = async (
  userId: number
): Promise<TSelectBooking[]> => {
  return await db.query.bookings.findMany({
    where: eq(bookings.userId, userId),
    orderBy: [desc(bookings.createdAt)],
    with: {
      event: true,
      payments: true,
    },
  });
};

// Get bookings by Event ID
export const getBookingsByEventIdService = async (
  eventId: number
): Promise<TSelectBooking[]> => {
  return await db.query.bookings.findMany({
    where: eq(bookings.eventId, eventId),
    orderBy: [desc(bookings.createdAt)],
    with: {
      user: true,
      payments: true,
    },
  });
};

// Create a new booking
export const createBookingService = async (
  booking: TInsertBooking
): Promise<string> => {
  await db.insert(bookings).values(booking).returning();
  return "Booking created successfully ✅";
};

// Update an existing booking
export const updateBookingService = async (
  bookingId: number,
  booking: Partial<TInsertBooking>
): Promise<string> => {
  await db.update(bookings).set(booking).where(eq(bookings.bookingId, bookingId));
  return "Booking updated successfully 🔄";
};

// Delete booking by ID
export const deleteBookingService = async (bookingId: number): Promise<string> => {
  await db.delete(bookings).where(eq(bookings.bookingId, bookingId));
  return "Booking deleted successfully ❌";
};