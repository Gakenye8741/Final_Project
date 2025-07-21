import { Request, Response } from "express";
import {
  createSupportTicketService,
  deleteSupportTicketService,
  getAllSupportTicketService,
  getTicketByIdService,
  getTicketWithAllIdServices,
  updateSupportTicketService,
  getSupportTicketsByNationalIdService, // 🆕 Added import
} from "./ticket.service";

// ✅ Get all support tickets
export const getAllSupTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await getAllSupportTicketService();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

// ✅ Get a ticket by ID
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id);
    const ticket = await getTicketByIdService(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
};

// ✅ Get ticket with user details
export const getTicketbyIdDetails = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id);
    const ticket = await getTicketWithAllIdServices(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ticket details" });
  }
};

// ✅ Create a new ticket
export const createTicket = async (req: Request, res: Response) => {
  try {
    const message = await createSupportTicketService(req.body);
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// ✅ Update a ticket
export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id);
    const message = await updateSupportTicketService(ticketId, req.body);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: "Failed to update ticket" });
  }
};

// ✅ Delete a ticket
export const deleteTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = parseInt(req.params.id);
    const message = await deleteSupportTicketService(ticketId);
    res.json({ message });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
};

// ✅ Get all tickets by user's national ID
export const getTicketsByNationalId = async (req: Request, res: Response) => {
  try {
    const nationalId = parseInt(req.params.nationalId);
    if (isNaN(nationalId)) {
      return res.status(400).json({ error: "Invalid national ID" });
    }

    const tickets = await getSupportTicketsByNationalIdService(nationalId);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets by national ID" });
  }
};
