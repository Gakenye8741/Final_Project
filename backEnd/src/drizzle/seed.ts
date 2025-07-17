import db from "../drizzle/db"; // Adjust if needed
import {
  users,
  venues,
  events,
  ticketTypes,
  bookings,
  payments,
  supportTickets,
  media,
} from "../drizzle/schema";

async function seed() {
  // USERS
  await db.insert(users).values([
    {
      nationalId: 1001,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice@example.com",
      password: "hashedpassword1",
      contactPhone: "1234567890",
      address: "123 Main St",
    },
    {
      nationalId: 1002,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob@example.com",
      password: "hashedpassword2",
      contactPhone: "0987654321",
      address: "456 Elm St",
      role: "admin",
    },
    {
      nationalId: 1003,
      firstName: "Charlie",
      lastName: "Williams",
      email: "charlie@example.com",
      password: "hashedpassword3",
      contactPhone: "1122334455",
      address: "789 Oak St",
    },
    {
      nationalId: 1004,
      firstName: "Diana",
      lastName: "Brown",
      email: "diana@example.com",
      password: "hashedpassword4",
      contactPhone: "2233445566",
      address: "321 Pine St",
    },
    {
      nationalId: 1005,
      firstName: "Eve",
      lastName: "Davis",
      email: "eve@example.com",
      password: "hashedpassword5",
      contactPhone: "5566778899",
      address: "654 Birch St",
    },
  ]);

  // VENUES
  const insertedVenues = await db.insert(venues).values([
    {
      name: "Grand Hall",
      address: "Downtown City",
      capacity: 500,
      status: "available",
    },
    {
      name: "Open Arena",
      address: "Seaside Blvd",
      capacity: 1000,
      status: "booked",
    },
    {
      name: "Mountain View Arena",
      address: "Mountain Rd",
      capacity: 2000,
      status: "available",
    },
    {
      name: "City Square",
      address: "Main Street",
      capacity: 1500,
      status: "available",
    },
    {
      name: "Stadium Park",
      address: "Park Ave",
      capacity: 3000,
      status: "booked",
    },
  ]).returning();

  // EVENTS
  const insertedEvents = await db.insert(events).values([
    {
      title: "Music Fest 2025",
      description: "An amazing music event.",
      venueId: insertedVenues[0].venueId,
      category: "Music",
      date: "2025-09-01",
      time: "18:00:00",
      ticketPrice: "50.00",
      ticketsTotal: 300,
      status: "in_progress",
    },
    {
      title: "Tech Conference 2025",
      description: "Learn about new technologies.",
      venueId: insertedVenues[1].venueId,
      category: "Technology",
      date: "2025-11-10",
      time: "09:00:00",
      ticketPrice: "150.00",
      ticketsTotal: 500,
      status: "upcoming",
    },
    {
      title: "Rock Concert 2025",
      description: "Rock music at its best.",
      venueId: insertedVenues[2].venueId,
      category: "Music",
      date: "2025-08-10",
      time: "20:00:00",
      ticketPrice: "75.00",
      ticketsTotal: 1500,
      status: "upcoming",
    },
    {
      title: "Football Match 2025",
      description: "Exciting football action.",
      venueId: insertedVenues[3].venueId,
      category: "Sports",
      date: "2025-12-01",
      time: "16:00:00",
      ticketPrice: "20.00",
      ticketsTotal: 2000,
      status: "upcoming",
    },
    {
      title: "Art Exhibition 2025",
      description: "A creative showcase of art.",
      venueId: insertedVenues[4].venueId,
      category: "Art",
      date: "2025-07-15",
      time: "10:00:00",
      ticketPrice: "25.00",
      ticketsTotal: 800,
      status: "in_progress",
    },
  ]).returning();

  // TICKET TYPES
  const insertedTicketTypes = await db.insert(ticketTypes).values([
    {
      eventId: insertedEvents[0].eventId,
      name: "General Admission",
      price: "50.00",
      quantity: 200,
    },
    {
      eventId: insertedEvents[0].eventId,
      name: "VIP",
      price: "100.00",
      quantity: 100,
    },
    {
      eventId: insertedEvents[1].eventId,
      name: "Standard",
      price: "150.00",
      quantity: 400,
    },
    {
      eventId: insertedEvents[2].eventId,
      name: "Regular",
      price: "75.00",
      quantity: 700,
    },
    {
      eventId: insertedEvents[3].eventId,
      name: "VIP",
      price: "50.00",
      quantity: 800,
    },
  ]).returning();

  // BOOKINGS
  const insertedBookings = await db.insert(bookings).values([
    {
      nationalId: 1001,
      eventId: insertedEvents[0].eventId,
      ticketTypeId: insertedTicketTypes[0].ticketTypeId,
      ticketTypeName: "General Admission",
      quantity: 2,
      totalAmount: "100.00",
      bookingStatus: "Confirmed",
    },
    {
      nationalId: 1002,
      eventId: insertedEvents[1].eventId,
      ticketTypeId: insertedTicketTypes[2].ticketTypeId,
      ticketTypeName: "Standard",
      quantity: 1,
      totalAmount: "150.00",
      bookingStatus: "Pending",
    },
    {
      nationalId: 1003,
      eventId: insertedEvents[2].eventId,
      ticketTypeId: insertedTicketTypes[3].ticketTypeId,
      ticketTypeName: "Regular",
      quantity: 3,
      totalAmount: "225.00",
      bookingStatus: "Confirmed",
    },
    {
      nationalId: 1004,
      eventId: insertedEvents[3].eventId,
      ticketTypeId: insertedTicketTypes[4].ticketTypeId,
      ticketTypeName: "VIP",
      quantity: 1,
      totalAmount: "50.00",
      bookingStatus: "Pending",
    },
    {
      nationalId: 1005,
      eventId: insertedEvents[4].eventId,
      ticketTypeId: insertedTicketTypes[0].ticketTypeId,
      ticketTypeName: "General Admission",
      quantity: 5,
      totalAmount: "250.00",
      bookingStatus: "Cancelled",
    },
  ]).returning();

  // PAYMENTS
  await db.insert(payments).values([
    {
      bookingId: insertedBookings[0].bookingId,
      amount: "100.00",
      paymentStatus: "Completed",
      paymentMethod: "Credit Card",
      transactionId: "TXN10001",
    },
    {
      bookingId: insertedBookings[1].bookingId,
      amount: "150.00",
      paymentStatus: "Pending",
      paymentMethod: "PayPal",
      transactionId: "TXN10002",
    },
    {
      bookingId: insertedBookings[2].bookingId,
      amount: "225.00",
      paymentStatus: "Completed",
      paymentMethod: "Debit Card",
      transactionId: "TXN10003",
    },
    {
      bookingId: insertedBookings[3].bookingId,
      amount: "50.00",
      paymentStatus: "Pending",
      paymentMethod: "Credit Card",
      transactionId: "TXN10004",
    },
    {
      bookingId: insertedBookings[4].bookingId,
      amount: "250.00",
      paymentStatus: "Failed",
      paymentMethod: "Credit Card",
      transactionId: "TXN10005",
    },
  ]);

  // SUPPORT TICKETS
  await db.insert(supportTickets).values([
    {
      nationalId: 1001,
      subject: "Booking Confirmation Issue",
      description: "I didn't receive the confirmation email for my booking.",
      status: "Open",
    },
    {
      nationalId: 1002,
      subject: "Payment Delay",
      description: "My PayPal payment is still pending.",
      status: "In Progress",
    },
    {
      nationalId: 1003,
      subject: "Ticket Availability",
      description: "I need more tickets for the event.",
      status: "Resolved",
    },
    {
      nationalId: 1004,
      subject: "Event Cancelled",
      description: "I need a refund due to the cancellation of the event.",
      status: "Closed",
    },
    {
      nationalId: 1005,
      subject: "Account Login Issue",
      description: "I can't log in to my account.",
      status: "Open",
    },
  ]);

  // MEDIA
  await db.insert(media).values([
    {
      eventId: insertedEvents[0].eventId,
      type: "image",
      url: "https://example.com/images/musicfest-1.jpg",
    },
    {
      eventId: insertedEvents[0].eventId,
      type: "video",
      url: "https://example.com/videos/musicfest-2025-highlights.mp4",
    },
    {
      eventId: insertedEvents[1].eventId,
      type: "image",
      url: "https://example.com/images/techconf-1.jpg",
    },
    {
      eventId: insertedEvents[2].eventId,
      type: "video",
      url: "https://example.com/videos/rockconcert-live.mp4",
    },
    {
      eventId: insertedEvents[3].eventId,
      type: "image",
      url: "https://example.com/images/footballmatch-promo.jpg",
    },
    {
      eventId: insertedEvents[4].eventId,
      type: "image",
      url: "https://example.com/images/artexhibit-gallery.jpg",
    },
  ]);

  console.log("✅ Database seeded successfully.");
}

seed().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
