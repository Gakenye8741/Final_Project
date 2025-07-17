import { Request, Response } from "express";
import {
  createTicketTypeService,
  deleteTicketTypeService,
  getAllTicketTypesService,
  getTicketTypeByIdService,
  getTicketTypesByEventIdService,
  updateTicketTypeService,
} from "../TicketType/TicketType.service";

// 📥 Get all ticket types
export const getAllTicketTypes = async (req: Request, res: Response) => {
  try {
    const ticketTypes = await getAllTicketTypesService();
    if (!ticketTypes.length) {
      return res.status(404).json({ message: "No ticket types found" });
    }
    return res.status(200).json(ticketTypes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch ticket types" });
  }
};

// 📥 Get ticket type by ID
export const getTicketTypeById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ticket type ID" });
  }

  try {
    const ticket = await getTicketTypeByIdService(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket type not found" });
    }
    return res.status(200).json(ticket);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch ticket type" });
  }
};

// 📥 Get ticket types by event ID
export const getTicketTypesByEventId = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  if (isNaN(eventId)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    const tickets = await getTicketTypesByEventIdService(eventId);
    if (!tickets.length) {
      return res.status(404).json({ message: "No ticket types found for this event" });
    }
    return res.status(200).json(tickets);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to fetch ticket types" });
  }
};

// ➕ Create a new ticket type
export const createTicketType = async (req: Request, res: Response) => {
  const { eventId, name, price, quantity } = req.body;

  if (!eventId || !name || !price || !quantity) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await createTicketTypeService({ eventId, name, price, quantity });
    return res.status(201).json({ message: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to create ticket type" });
  }
};

// 🔄 Update ticket type
export const updateTicketType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ticket type ID" });
  }

  const { eventId, name, price, quantity } = req.body;
  if (!eventId && !name && !price && !quantity) {
    return res.status(400).json({ error: "At least one field must be provided for update" });
  }

  try {
    const result = await updateTicketTypeService(id, { eventId, name, price, quantity });
    return res.status(200).json({ message: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to update ticket type" });
  }
};

// 🗑️ Delete ticket type
export const deleteTicketType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ticket type ID" });
  }

  try {
    const result = await deleteTicketTypeService(id);
    return res.status(200).json({ message: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Failed to delete ticket type" });
  }
};
