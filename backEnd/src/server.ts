// src/server.ts or index.ts

import express, { Application, Response } from 'express';
import dotenv from 'dotenv';
import { logger } from './middleware/logger';
import { userRouter } from './services/users/user.route';
import { TicketsRoute } from './services/tickets/ticket.route';
import { venueRoute } from './services/venue/venue.route';
// import userRoute from './services/users/user.route';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger); // custom logger middleware

// ✅ Default route
app.get('/', (_req, res: Response) => {
  res.send("🚀 Welcome to the Event Ticketing & Venue Booking System API (Drizzle + PostgreSQL Designed by Gakenye Ndiritu😎)");
});

// ✅ API routes

app.use('/api', userRouter)
app.use('/api', TicketsRoute)
app.use('/api', venueRoute)

// ✅ Start server
app.listen(PORT, () => {
  console.log(`
  🚀 Server running at: http://localhost:${PORT}
  ✅ Event_Ticketing_&_Venue_Booking_System Backend Initialized!
  🛠️ Developed by: GAKENYE NDIRITU 😉😎
  `);
});
