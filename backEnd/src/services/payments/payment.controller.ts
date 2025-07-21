import { Request, Response } from "express";
import {
  getAllPaymentsService,
  getPaymentByIdService,
  getPaymentsByBookingIdService,
  getPaymentsByStatusService,
  getPaymentsByNationalIdService,
  createPaymentService,
  updatePaymentService,
  deletePaymentService,
} from "./payment.service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

// Get all payments
export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const allPayments = await getAllPaymentsService();
    if (!allPayments || allPayments.length === 0) {
      res.status(404).json({ message: "🔍 No payments found" });
    } else {
      res.status(200).json(allPayments);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to retrieve payments") });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "🚫 Invalid payment ID" });
    return;
  }
  try {
    const payment = await getPaymentByIdService(paymentId);
    if (!payment) {
      res.status(404).json({ message: "🔍 Payment not found" });
    } else {
      res.status(200).json(payment);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to retrieve payment") });
  }
};

// Get payments by Booking ID
export const getPaymentsByBookingId = async (req: Request, res: Response) => {
  const bookingId = parseInt(req.params.bookingId);
  if (isNaN(bookingId)) {
    res.status(400).json({ error: "🚫 Invalid booking ID" });
    return;
  }
  try {
    const payments = await getPaymentsByBookingIdService(bookingId);
    if (!payments || payments.length === 0) {
      res.status(404).json({ message: `🔍 No payments found for booking ID ${bookingId}` });
    } else {
      res.status(200).json(payments);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments for booking ID ${bookingId}`) });
  }
};

// Get payments by national ID
export const getPaymentsByNationalId = async (req: Request, res: Response) => {
  const nationalId = parseInt(req.params.nationalId);
  if (isNaN(nationalId)) {
    res.status(400).json({ error: "🚫 Invalid national ID" });
    return;
  }
  try {
    const payments = await getPaymentsByNationalIdService(nationalId);
    if (!payments || payments.length === 0) {
      res.status(404).json({ message: `🔍 No payments found for national ID ${nationalId}` });
    } else {
      res.status(200).json(payments);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments for national ID ${nationalId}`) });
  }
};

// Get payments by Status
export const getPaymentsByStatus = async (req: Request, res: Response) => {
  const status = req.query.status as string;

  if (!status) {
    res.status(400).json({ error: "⚠️ Missing status query parameter" });
    return;
  }

  const allowedStatuses = ["Pending", "Completed", "Failed"] as const;
  type PaymentStatus = typeof allowedStatuses[number];

  if (!allowedStatuses.includes(status as PaymentStatus)) {
    res.status(400).json({ error: `🚫 Invalid status value. Allowed values: ${allowedStatuses.join(", ")}` });
    return;
  }

  try {
    const payments = await getPaymentsByStatusService(status as PaymentStatus);
    if (!payments || payments.length === 0) {
      res.status(404).json({ message: `🔍 No payments found with status "${status}"` });
    } else {
      res.status(200).json(payments);
    }
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || `Failed to retrieve payments with status "${status}"`) });
  }
};

// Create new payment
export const createPayment = async (req: Request, res: Response) => {
  const { bookingId, amount, paymentStatus, paymentMethod, transactionId, nationalId } = req.body;

  if (!bookingId || !amount || !nationalId) {
    res.status(400).json({ error: "⚠️ Required fields: bookingId, amount, nationalId" });
    return;
  }

  const parsedBookingId = parseInt(bookingId);
  const parsedAmount = parseFloat(amount);
  const parsedNationalId = parseInt(nationalId);

  if (isNaN(parsedBookingId) || isNaN(parsedAmount) || isNaN(parsedNationalId)) {
    res.status(400).json({ error: "🚫 Invalid number format for bookingId, amount, or nationalId" });
    return;
  }

  const newPayment = {
    bookingId: parsedBookingId,
    nationalId: parsedNationalId,
    amount: parsedAmount.toString(),
    paymentStatus: paymentStatus || "Pending",
    paymentMethod: paymentMethod || null,
    transactionId: transactionId || null,
  };

  try {
    const message = await createPaymentService(newPayment);
    res.status(201).json({ message: "✅ " + message });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to create payment") });
  }
};

// Update payment
export const updatePayment = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "🚫 Invalid payment ID" });
    return;
  }

  const updateData: { [key: string]: any } = {};
  for (const key in req.body) {
    if (Object.prototype.hasOwnProperty.call(req.body, key)) {
      let value = req.body[key];
      if (["bookingId", "nationalId"].includes(key)) {
        value = parseInt(value);
        if (isNaN(value)) {
          res.status(400).json({ error: `🚫 Invalid number format for ${key}` });
          return;
        }
      } else if (key === "amount") {
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
    const result = await updatePaymentService(paymentId, updateData);
    res.status(200).json({ message: "🔄 " + result });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to update payment") });
  }
};

// Delete payment
export const deletePayment = async (req: Request, res: Response) => {
  const paymentId = parseInt(req.params.id);
  if (isNaN(paymentId)) {
    res.status(400).json({ error: "🚫 Invalid payment ID" });
    return;
  }
  try {
    const result = await deletePaymentService(paymentId);
    res.status(200).json({ message: "🗑️ " + result });
  } catch (error: any) {
    res.status(500).json({ error: "🚫 " + (error.message || "Failed to delete payment") });
  }
};

// Stripe Checkout Session
// Stripe Checkout Session
export const createCheckoutSession = async (req: Request, res: Response) => {
  const { amount, nationalId, bookingId } = req.body;

  console.log("💬 Received checkout session request:", {
    amount,
    nationalId,
    bookingId,
  });

  if (
    typeof amount !== "number" ||
    typeof nationalId !== "number" ||
    typeof bookingId !== "number" ||
    amount <= 0
  ) {
    return res.status(400).json({
      error: "🚫 Invalid input. 'amount', 'nationalId', and 'bookingId' are required and must be valid numbers.",
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount, // amount in cents
            product_data: {
              name: "Ticket booking Payment",
              description: "Paying for the tickets",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        nationalId: nationalId.toString(),
        bookingId: bookingId.toString(),
      },
      success_url: "http://localhost:5173/Dashboard/MyBookings",
      cancel_url: "http://localhost:5173/",
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe checkout session error:", err);
    res.status(500).json({ error: "🚫 Failed to create checkout session" });
  }
};

