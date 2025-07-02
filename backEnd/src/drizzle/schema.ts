import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  pgEnum,
  date,
  time,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ENUMS
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const bookingStatusEnum = pgEnum("bookingStatus", ["Pending", "Confirmed", "Cancelled"]);
export const paymentStatusEnum = pgEnum("paymentStatus", ["Pending", "Completed", "Failed"]);
export const ticketStatusEnum = pgEnum("status", ["Open", "In Progress", "Resolved", "Closed"]);

// USERS
export const users = pgTable("users", {
  userId: serial("userId").primaryKey(),
  firstName: varchar("firstName", { length: 15 }).notNull(),
  lastName: varchar("lastName", { length: 15 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  contactPhone: varchar("contactPhone", { length: 15 }),
  address: text("address"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// VENUES
export const venues = pgTable("venues", {
  venueId: serial("venueId").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  capacity: integer("capacity").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// EVENTS
export const events = pgTable("events", {
  eventId: serial("eventId").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  venueId: integer("venueId").references(() => venues.venueId, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }),
  date: date("date").notNull(),
  time: time("time").notNull(),
  ticketPrice: decimal("ticketPrice", { precision: 10, scale: 2 }).notNull(),
  ticketsTotal: integer("ticketsTotal").notNull(),
  ticketsSold: integer("ticketsSold").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// BOOKINGS
export const bookings = pgTable("bookings", {
  bookingId: serial("bookingId").primaryKey(),
  userId: integer("userId").references(() => users.userId, { onDelete: "cascade" }),
  eventId: integer("eventId").references(() => events.eventId, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  bookingStatus: bookingStatusEnum("bookingStatus").default("Pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// PAYMENTS
export const payments = pgTable("payments", {
  paymentId: serial("paymentId").primaryKey(),
  bookingId: integer("bookingId").references(() => bookings.bookingId, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum("paymentStatus").default("Pending").notNull(),
  paymentDate: timestamp("paymentDate").defaultNow().notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionId: varchar("transactionId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// SUPPORT TICKETS
export const supportTickets = pgTable("supportTickets", {
  ticketId: serial("ticketId").primaryKey(),
  userId: integer("userId").references(() => users.userId, { onDelete: "cascade" }),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: ticketStatusEnum("status").default("Open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});


// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  supportTickets: many(supportTickets),
}));

export const venuesRelations = relations(venues, ({ many }) => ({
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  venue: one(venues, {
    fields: [events.venueId],
    references: [venues.venueId],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.userId],
  }),
  event: one(events, {
    fields: [bookings.eventId],
    references: [events.eventId],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.bookingId],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.userId],
  }),
}));


// INFERRED TYPES
export type TSelectUser = typeof users.$inferSelect;
export type TInsertUser = typeof users.$inferInsert;

export type TSelectVenue = typeof venues.$inferSelect;
export type TInsertVenue = typeof venues.$inferInsert;

export type TSelectEvent = typeof events.$inferSelect;
export type TInsertEvent = typeof events.$inferInsert;

export type TSelectBooking = typeof bookings.$inferSelect;
export type TInsertBooking = typeof bookings.$inferInsert;

export type TSelectPayment = typeof payments.$inferSelect;
export type TInsertPayment = typeof payments.$inferInsert;

export type TSelectSupportTicket = typeof supportTickets.$inferSelect;
export type TInsertSupportTicket = typeof supportTickets.$inferInsert;
