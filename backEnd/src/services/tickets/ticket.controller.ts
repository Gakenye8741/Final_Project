
import { Request, Response } from 'express';
import {
  getAllSupportTicketService,
  getTicketByIdService,
  getTicketWithAllIdServices,
  createSupportTicketService,
  updateSupportTicketService,
  deleteSupportTicketService,
  searchTicketsByUserNameService
} from './ticket.service';

// 🎫 Get all support tickets
export const getAllSupTickets = async (req: Request, res: Response) => {
  try {
    const allSupportTickets = await getAllSupportTicketService();
    if (!allSupportTickets || allSupportTickets.length === 0) {
      res.status(404).json({ message: '❌ No Support Tickets Found' });
    } else {
      res.status(200).json(allSupportTickets);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || '⚠️ Failed to fetch Support Tickets' });
  }
};

// 🆔 Get support ticket by ID
export const getTicketById = async (req: Request, res: Response) => {
  const ticketId = parseInt(req.params.id);
  if (isNaN(ticketId)) {
    res.status(400).json({ error: '❗ Invalid Ticket ID' });
    return;
  }
  try {
    const ticket = await getTicketByIdService(ticketId);
    if (!ticket) {
      res.status(404).json({ message: '❌ Support Ticket Not Found' });
    } else {
      res.status(200).json(ticket);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || '⚠️ Failed to fetch ticket' });
  }
};

// 📋 Get support ticket with full user details
export const getTicketbyIdDetails = async (req: Request, res: Response) => {
  const ticketId = parseInt(req.params.id);
  if (isNaN(ticketId)) {
    res.status(400).json({ message: '❗ Invalid Ticket ID' });
    return;
  }
  try {
    const details = await getTicketWithAllIdServices(ticketId);
    if (!details) {
      res.status(404).json({ message: '❌ Support Ticket not found' });
    } else {
      res.status(200).json(details);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || '⚠️ Failed to fetch full ticket details' });
  }
};

// 🆕 Create a new support ticket
export const createTicket = async (req: Request, res: Response) => {
  const ticket = req.body;
  try {
    const message = await createSupportTicketService(ticket);
    res.status(201).json({ message: `✅ ${message}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || '❌ Failed to create ticket' });
  }
};

// ✏️ Update support ticket
export const updateTicket = async (req: Request, res: Response) => {
  const ticketId = parseInt(req.params.id);
  if (isNaN(ticketId)) {
     res.status(400).json({ message: '❗ Invalid Ticket ID' });
     return;
  }

  const update = req.body;

  try {
    const message = await updateSupportTicketService(ticketId, update);
    res.status(200).json({ message: `🔄 ${message}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || '⚠️ Failed to update ticket' });
  }
};

// 🗑️ Delete support ticket
export const deleteTicket = async (req: Request, res: Response) => {
  const ticketId = parseInt(req.params.id);
  if (isNaN(ticketId)) {
    res.status(400).json({ message: '❗ Invalid Ticket ID' });
    return;
  }

  try {
    const message = await deleteSupportTicketService(ticketId);
    res.status(200).json({ message: `🗑️ ${message}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message || '❌ Failed to delete ticket' });
  }
};

// 🔍 Search support tickets by user last name only
export const searchTicketsByUserLastName = async (req: Request, res: Response) => {
  const lastName = req.query.lastName as string; 

  if (!lastName) {
    res.status(400).json({ message: '❗ Query parameter "lastName" is required' });
    return;
  }

  try {
    const tickets = await searchTicketsByUserNameService(lastName); // assuming this service searches by lastName only
    if (!tickets || tickets.length === 0) {
      res.status(404).json({ message: '🔎 No tickets found for the provided last name' });
    } else {
      res.status(200).json(tickets);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || '⚠️ Failed to search tickets by last name' });
  }
};

