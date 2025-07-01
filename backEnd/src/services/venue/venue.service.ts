import { eq, ilike } from "drizzle-orm";
import db from "../../drizzle/db";
import { events, TSelectVenue, venues } from "../../drizzle/schema";


export const getAllVenueServices = async (): Promise<TSelectVenue[]> =>{

    return await db.query.venues.findMany();

}

export const getVenueByIdServices = async (venueName:string) :Promise<TSelectVenue | undefined> =>{

    return await db.query.venues.findFirst({
        where: ilike(venues.name,venueName)
    })
}
// search venue by name
export const searchVenuesByName = async (searchTerm: string): Promise<TSelectVenue[]> => {
  return await db.query.venues.findMany({
    where: ilike(venues.name, `%${searchTerm}%`),
  });
};

// get all details related to a Venue
export const getAllDetailsForVenue = async (venueName :string) =>{
  return await db.query.venues.findFirst({
    where: ilike(venues.name, `%${venueName}%`),
    with: {
      events: true
    }
  })
}