import { Request, Response } from "express";
import {
  getAllBookingsService,
  getBookingByIdService,
  getBookingsByUserNationalIdService,
  getBookingsByEventIdService,
  createBookingService,
  updateBookingService,
  deleteBookingService,
} from "./bookings.service";

// Get all bookings
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const allBookings = await getAllBookingsService();
    if (!allBookings || allBookings.length === 0) {
      res.status(404).json({ message: "🔍 No bookings found" });
    } else {
      res.status(200).json(allBookings);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to retrieve bookings") });
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "🚫 Invalid booking ID" });
    return;
  }
  try {
    const booking = await getBookingByIdService(bookingId);
    if (!booking) {
      res.status(404).json({ message: "🔍 Booking not found" });
    } else {
      res.status(200).json(booking);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to retrieve booking") });
  }
};

// ✅ Get bookings by User National ID
export const getBookingsByUserNationalId = async (req: Request, res: Response) => {
  const nationalId = parseInt(req.params.nationalId);
  if (isNaN(nationalId)) {
    res.status(400).json({ error: "🚫 Invalid national ID" });
    return;
  }

  try {
    const bookings = await getBookingsByUserNationalIdService(nationalId);
    if (!bookings || bookings.length === 0) {
      res.status(404).json({ message: `🔍 No bookings found for national ID ${nationalId}` });
    } else {
      res.status(200).json(bookings);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve bookings for national ID ${nationalId}`) });
  }
};

// Get bookings by Event ID
export const getBookingsByEventId = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  if (isNaN(eventId)) {
    res.status(400).json({ error: "🚫 Invalid event ID" });
    return;
  }
  try {
    const bookings = await getBookingsByEventIdService(eventId);
    if (!bookings || bookings.length === 0) {
      res.status(404).json({ message: `🔍 No bookings found for event ID ${eventId}` });
    } else {
      res.status(200).json(bookings);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve bookings for event ID ${eventId}`) });
  }
};

// Create new booking
export const createBooking = async (req: Request, res: Response) => {
  const { userId, eventId, quantity, totalAmount, bookingStatus } = req.body;

  if (!userId || !eventId || !quantity || !totalAmount) {
    res.status(400).json({ error: "⚠️ Essential fields (userId, eventId, quantity, totalAmount) are required" });
    return;
  }

  const parsedUserId = parseInt(userId);
  const parsedEventId = parseInt(eventId);
  const parsedQuantity = parseInt(quantity);
  const parsedTotalAmount = parseFloat(totalAmount);

  if (isNaN(parsedUserId) || isNaN(parsedEventId) || isNaN(parsedQuantity) || isNaN(parsedTotalAmount)) {
    res.status(400).json({ error: "🚫 Invalid data types for userId, eventId, quantity, or totalAmount" });
    return;
  }

  try {
    const newBooking = {
      userId: parsedUserId,
      eventId: parsedEventId,
      quantity: parsedQuantity,
      totalAmount: totalAmount.toString(),
      bookingStatus: bookingStatus || "Pending",
    };
    const message = await createBookingService(newBooking);
    res.status(201).json({ message: "✅ " + message });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to create booking") });
  }
};

// Update booking
export const updateBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "🚫 Invalid booking ID" });
    return;
  }

  const updateData: { [key: string]: any } = {};
  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      let value = req.body[key];
      if (key === 'userId' || key === 'eventId' || key === 'quantity') {
        value = parseInt(value);
        if (isNaN(value)) {
          res.status(400).json({ error: `🚫 Invalid number format for ${key}` });
          return;
        }
      } else if (key === 'totalAmount') {
        value = parseFloat(value);
        if (isNaN(value)) {
          res.status(400).json({ error: `🚫 Invalid number format for ${key}` });
          return;
        }
      }
      updateData[key] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    res.status(400).json({ error: "📝 No fields provided for update" });
    return;
  }

  try {
    const result = await updateBookingService(bookingId, updateData);
    res.status(200).json({ message: "🔄 " + result });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to update booking") });
  }
};

// Delete booking
export const deleteBooking = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.id);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "🚫 Invalid booking ID" });
    return;
  }
  try {
    const result = await deleteBookingService(bookingId);
    res.status(200).json({ message: "🗑️ " + result });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to delete booking") });
  }
};
