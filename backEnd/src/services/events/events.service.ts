import { eq, desc, ilike } from "drizzle-orm";
import db from "../../drizzle/db";
import {
  events,
  venues,
  TInsertEvent,
  TSelectEvent,
} from "../../drizzle/schema";

// Get all events
export const getAllEventsService = async (): Promise<TSelectEvent[]> => {
  return await db.query.events.findMany({
    orderBy: [desc(events.createdAt)],
    with: {
        venue: true,
    }
  });
};

// Get event by ID
export const getEventByIdService = async (
  eventId: number
): Promise<TSelectEvent | undefined> => {
  return await db.query.events.findFirst({
    where: eq(events.eventId, eventId),
    with: {
      venue: true,
    },
  });
};

// Get event by title (case-insensitive, partial match)
export const getEventsByTitleService = async (
  title: string
): Promise<TSelectEvent[]> => {
  return await db.query.events.findMany({
    where: ilike(events.title, `%${title}%`),
    with: {
      venue: true,
    },
  });
};

// Get events by category (case-insensitive, partial match)
export const getEventsByCategoryService = async (
  category: string
): Promise<TSelectEvent[]> => {
  return await db.query.events.findMany({
    where: ilike(events.category, `%${category}%`),
    with: {
      venue: true,
    },
  });
};

// Get event with its related venue details
export const getEventWithVenueService = async (eventId: number) => {
  return await db.query.events.findFirst({
    where: eq(events.eventId, eventId),
    with: {
      venue: true,
    },
  });
};

// Create a new event
export const createEventService = async (
  event: TInsertEvent
): Promise<string> => {
  await db.insert(events).values(event).returning();
  return "Event created successfully ✅";
};

// Update an existing event
export const updateEventService = async (
  eventId: number,
  event: Partial<TInsertEvent>
): Promise<string> => {
  await db.update(events).set(event).where(eq(events.eventId, eventId));
  return "Event updated successfully 🔄";
};

// Delete event by ID
export const deleteEventService = async (eventId: number): Promise<string> => {
  await db.delete(events).where(eq(events.eventId, eventId));
  return "Event deleted successfully ❌";
};