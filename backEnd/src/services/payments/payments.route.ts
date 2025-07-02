
// routes/payment.routes.ts

import { Router } from "express";
import {
  getAllPayments,
  getPaymentById,
  getPaymentsByBookingId,
  getPaymentsByStatus,
  createPayment,
  updatePayment,
  deletePayment,
} from "./payment.controller"; 

export const paymentRouter = Router();

// Payment routes definition

// Search payments by status ("Pending", "Completed", "Failed")
paymentRouter.get("/payments-status-search", getPaymentsByStatus);

// Get all payments
paymentRouter.get("/payments", getAllPayments);

// Get payment by ID
paymentRouter.get("/payments/:id", getPaymentById);

// Get payments by Booking ID
paymentRouter.get("/payments/booking/:bookingId", getPaymentsByBookingId);

// Create a new payment
paymentRouter.post("/payments", createPayment);

// Update an existing payment
// Note: Using :id for consistency in PUT/DELETE for individual resources
paymentRouter.put("/payments/:id", updatePayment);

// Delete an existing payment
paymentRouter.delete("/payments/:id", deletePayment);