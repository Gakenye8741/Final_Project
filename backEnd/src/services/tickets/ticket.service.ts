
import { desc, eq, ilike } from "drizzle-orm";
import db from "../../drizzle/db";
import {
  supportTickets,
  TInsertSupportTicket,
  TSelectSupportTicket,
} from "../../drizzle/schema";

// ✅ Get all tickets
export const getAllSupportTicketService = async (): Promise<TSelectSupportTicket[]> => {
  return db.query.supportTickets.findMany({
    orderBy: [desc(supportTickets.ticketId)],
  });
};

// ✅ Get Ticket By ID
export const getTicketByIdService = async (ticketId: number): Promise<TSelectSupportTicket | undefined> => {
  return db.query.supportTickets.findFirst({
    where: eq(supportTickets.ticketId, ticketId),
  });
};

// ✅ Get specific ticket with full user details
export const getTicketWithAllIdServices = async (ticketId: number) => {
  return db.query.supportTickets.findFirst({
    where: eq(supportTickets.ticketId, ticketId),
    with: {
      user: true, // assumes relation is defined
    },
  });
};

// ✅ Create a support ticket
export const createSupportTicketService = async (
  ticket: TInsertSupportTicket
): Promise<string> => {
  await db.insert(supportTickets).values(ticket);
  return "Support ticket created successfully ✅";
};

// ✅ Update a support ticket
export const updateSupportTicketService = async (
  ticketId: number,
  ticket: Partial<TInsertSupportTicket>
): Promise<string> => {
  await db
    .update(supportTickets)
    .set(ticket)
    .where(eq(supportTickets.ticketId, ticketId));
  return "Support ticket updated successfully ✅";
};

// ✅ Delete a support ticket
export const deleteSupportTicketService = async (ticketId: number): Promise<string> => {
  await db.delete(supportTickets).where(eq(supportTickets.ticketId, ticketId));
  return "Support ticket deleted successfully ❌";
};





