import { Request, Response } from "express";
import {
  createTicketTypeService,
  deleteTicketTypeService,
  getAllTicketTypesService,
  getTicketTypeByIdService,
  getTicketTypesByEventIdService,
  updateTicketTypeService,
} from "../TicketType/TicketType.service";

// Get all ticket types
export const getAllTicketTypes = async (req: Request, res: Response) => {
  try {
    const ticketTypes = await getAllTicketTypesService();
    if (!ticketTypes.length) {
     res.status(404).json({ message: "No ticket types found" });
      return;
    }
    res.status(200).json(ticketTypes);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch ticket types" });
  }
};

// Get ticket type by ID
export const getTicketTypeById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) 
  res.status(400).json({ error: "Invalid ticket type ID" });
  return;
  try {
    const ticket = await getTicketTypeByIdService(id);
    if (!ticket)res.status(404).json({ message: "Ticket type not found" });
    return;
    res.status(200).json(ticket);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch ticket type" });
  }
};

// Get ticket types by event ID
export const getTicketTypesByEventId = async (req: Request, res: Response) => {
  const eventId = parseInt(req.params.eventId);
  if (isNaN(eventId))  res.status(400).json({ error: "Invalid event ID" });
  return;

  try {
    const tickets = await getTicketTypesByEventIdService(eventId);
    if (!tickets.length) res.status(404).json({ message: "No ticket types found for this event" });
    return;
    res.status(200).json(tickets);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch ticket types" });
  }
};

// Create new ticket type
export const createTicketType = async (req: Request, res: Response) => {
  const { eventId, name, price, quantity } = req.body; // Changed 'type' to 'name'
  if (!eventId || !name || !price || !quantity) {
     res.status(400).json({ error: "All fields are required" });return;
  }

  try {
    // Create ticket type by calling the service
    const result = await createTicketTypeService({ eventId, name, price, quantity }); // Passed 'name' instead of 'type'
    res.status(201).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create ticket type" });
  }
};

// Update ticket type by ID
export const updateTicketType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) res.status(400).json({ error: "Invalid ticket type ID" });return ;

  const { eventId, name, price, quantity } = req.body; // Changed 'type' to 'name'
  if (!eventId && !name && !price && !quantity) {
   res.status(400).json({ error: "At least one field must be provided for update" }); return ;
  }

  try {
    // Call service to update ticket type
    const result = await updateTicketTypeService(id, { eventId, name, price, quantity }); // Passed 'name' instead of 'type'
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update ticket type" });
  }
};

// Delete ticket type by ID
export const deleteTicketType = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) res.status(400).json({ error: "Invalid ticket type ID" });return ;

  try {
    // Call service to delete ticket type
    const result = await deleteTicketTypeService(id);
    res.status(200).json({ message: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete ticket type" });
  }
};
