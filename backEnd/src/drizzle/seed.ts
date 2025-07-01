import db  from "./db";
import {
  users,
  venues,
  events,
  bookings,
  payments,
  supportTickets,
} from "../drizzle/schema";

// Reset and seed the database
async function seed() {
  try {
    console.log("🌱 Seeding started...");

    // Seed Users
    const [user1, user2] = await db
      .insert(users)
      .values([
        {
          firstName: "Alice",
          lastName: "Johnson",
          email: "alice@example.com",
          password: "password123",
          contactPhone: "123-456-7890",
          address: "123 Main St",
        },
        {
          firstName: "Bob",
          lastName: "Smith",
          email: "bob@example.com",
          password: "securepass456",
          contactPhone: "987-654-3210",
          address: "456 Elm St",
        },
      ])
      .returning();

    // Seed Venues
    const [venue1, venue2] = await db
      .insert(venues)
      .values([
        {
          name: "Grand Hall",
          address: "100 Broadway Ave",
          capacity: 500,
        },
        {
          name: "City Conference Center",
          address: "200 Main Blvd",
          capacity: 1000,
        },
      ])
      .returning();

    // Seed Events
    const [event1, event2] = await db
      .insert(events)
      .values([
        {
          title: "Jazz Night",
          description: "An evening of smooth jazz",
          venueId: venue1.venueId,
          category: "Music",
          date: "2025-07-15",
          time: "20:00:00",
          ticketPrice: "50.00",
          ticketsTotal: 200,
        },
        {
          title: "Tech Conference 2025",
          description: "Explore the future of AI",
          venueId: venue2.venueId,
          category: "Technology",
          date: "2025-08-10",
          time: "09:30:00",
          ticketPrice: "120.00",
          ticketsTotal: 600,
        },
      ])
      .returning();

    // Seed Bookings
    const [booking1] = await db
      .insert(bookings)
      .values([
        {
          userId: user1.userId,
          eventId: event1.eventId,
          quantity: 2,
          totalAmount: "100.00",
          bookingStatus: "Confirmed",
        },
      ])
      .returning();

    // Seed Payments
    await db.insert(payments).values([
      {
        bookingId: booking1.bookingId,
        amount: "100.00",
        paymentStatus: "Completed",
        paymentMethod: "Credit Card",
        transactionId: "TXN123456",
      },
    ]);

    // Seed Support Tickets
    await db.insert(supportTickets).values([
      {
        userId: user2.userId,
        subject: "Login Issue",
        description: "Unable to reset password",
        status: "Open",
      },
    ]);

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit();
  }
}

seed();
