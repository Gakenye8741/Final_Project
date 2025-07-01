import { Router } from "express";
import { GetAllVenues, getVenueByName, searchVenue, venueDetails } from "./venue.controller";


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

