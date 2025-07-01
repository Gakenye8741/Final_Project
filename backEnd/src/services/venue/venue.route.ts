import { Router } from "express";
import { CreateVenue, DeleteVenue, GetAllVenues, getVenueByName, searchVenue, updateVenue, venueDetails } from "./venue.controller";


export const venueRoute = Router();

// Venue Routes
// Search by Name
venueRoute.get("/venues/search", searchVenue);

// Get All Venues
venueRoute.get('/venues', GetAllVenues)

// Get Venue By Name
venueRoute.get('/venues/:name', getVenueByName)

//Get All Venue details
venueRoute.get('/details/venues/:name', venueDetails)

// // Create a new user
venueRoute.post("/venues", CreateVenue);

// Update an existing user
venueRoute.put("/venues/:userId", updateVenue);

// Delete an existing user
venueRoute.delete("/venues/:id", DeleteVenue);